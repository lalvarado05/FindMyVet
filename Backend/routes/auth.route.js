const express = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const { auth, esAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/registro', async (req, res) => {
    const { nombre, username, email, password, cedula } = req.body;

    if (!nombre || !username || !email || !password || !cedula) {
        return res.status(400).json({
            message: 'Los campos nombre, username, email, password y cedula son requeridos.',
            estado: 'error'
        });
    }

    try {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({ message: 'El email ya está registrado.', estado: 'error' });
        }

        const existeUsername = await Usuario.findOne({ username });
        if (existeUsername) {
            return res.status(400).json({ message: 'El username ya está registrado.', estado: 'error' });
        }

        const usuario = new Usuario({ nombre, username, email, password, cedula, activo: true });
        await usuario.save();

        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'Usuario registrado exitosamente.',
            estado: 'success',
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                username: usuario.username,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario.', estado: 'error', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({
            message: 'Los campos login y password son requeridos.',
            estado: 'error'
        });
    }

    try {
        const usuario = await Usuario.findOne({
            $or: [{ email: login.toLowerCase() }, { username: login }]
        });

        if (!usuario) {
            return res.status(401).json({ message: 'Credenciales inválidas.', estado: 'error' });
        }

        const passwordValido = await usuario.compararPassword(password);
        if (!passwordValido) {
            return res.status(401).json({ message: 'Credenciales inválidas.', estado: 'error' });
        }

        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Inicio de sesión exitoso.',
            estado: 'success',
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                username: usuario.username,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión.', estado: 'error', error: error.message });
    }
});

router.get('/perfil', auth, async (req, res) => {
    res.json({
        message: 'Perfil del usuario.',
        estado: 'success',
        usuario: req.usuario
    });
});

// Rutas de administración
router.get('/usuarios', auth, esAdmin, async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password').sort({ createdAt: -1 });
        res.json({
            message: 'Usuarios listados.',
            total: usuarios.length,
            estado: 'success',
            usuarios
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al listar usuarios.', estado: 'error', error: error.message });
    }
});

router.put('/usuarios/:id/rol', auth, esAdmin, async (req, res) => {
    const { rol } = req.body;
    const rolesValidos = ['cliente', 'admin'];

    if (!rol || !rolesValidos.includes(rol)) {
        return res.status(400).json({
            message: `Rol inválido. Valores permitidos: ${rolesValidos.join(', ')}`,
            estado: 'error'
        });
    }

    // No permitir cambiar el propio rol
    if (req.usuario._id.toString() === req.params.id) {
        return res.status(400).json({ message: 'No puedes cambiar tu propio rol.', estado: 'error' });
    }

    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, { rol }, { new: true, runValidators: true }).select('-password');
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.', estado: 'error' });
        }
        res.json({ message: 'Rol actualizado.', estado: 'success', usuario });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar rol.', estado: 'error', error: error.message });
    }
});

router.put('/usuarios/:id/activo', auth, esAdmin, async (req, res) => {
    // No permitir deshabilitar el propio usuario
    if (req.usuario._id.toString() === req.params.id) {
        return res.status(400).json({ message: 'No puedes deshabilitar tu propio usuario.', estado: 'error' });
    }

    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.', estado: 'error' });
        }
        
        usuario.activo = !usuario.activo;
        await usuario.save();
        
        const usuarioActualizado = await Usuario.findById(req.params.id).select('-password');
        const mensaje = usuario.activo ? 'Usuario habilitado.' : 'Usuario deshabilitado.';
        
        res.json({ message: mensaje, estado: 'success', usuario: usuarioActualizado });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar estado del usuario.', estado: 'error', error: error.message });
    }
});

router.delete('/usuarios/:id', auth, esAdmin, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.', estado: 'error' });
        }
        
        // No permitir eliminar el propio usuario
        if (req.usuario._id.toString() === req.params.id) {
            return res.status(400).json({ message: 'No puedes eliminar tu propio usuario.', estado: 'error' });
        }
        
        await Usuario.findByIdAndDelete(req.params.id);
        res.json({ message: 'Usuario eliminado.', estado: 'success' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario.', estado: 'error', error: error.message });
    }
});

module.exports = router;
