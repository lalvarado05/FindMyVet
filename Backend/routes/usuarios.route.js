const Usuario = require('../models/usuario');
const Departamento = require('../models/departamento');
const express = require('express');
const router = express.Router();

router.post('/', async(req, res) => {
    const { nombre, email, cedula, tipoUsuario, departamentoId } = req.body;

    if (!nombre || !email || !cedula || !tipoUsuario) {
        return res.status(400).json({
            message: 'Todos los campos son requeridos.',
            estado: 'error'
        });
    }

    try {
        if (departamentoId) {
            const departamentoExiste = await Departamento.findById(departamentoId);
            if (!departamentoExiste) {
                return res.status(400).json({
                    message: 'El departamento no existe.',
                    estado: 'error'
                });
            }
        }
        const usuarioNuevo = new Usuario({ nombre, email, cedula, tipoUsuario, departamento: departamentoId });
        await usuarioNuevo.save();

        //opcional, retornar con departamento poblado

        const usuarioConDepartamento = await Usuario.findById(usuarioNuevo._id).populate('departamento');

        res.status(201).json({
            message: 'Usuario creado',
            estado: 'success',
            usuario: usuarioConDepartamento
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear el usuario',
            estado: 'error'
        });
    }
});

router.get('/', async(req, res) => {
    try {
        const usuarios = await Usuario.find().populate('departamento');
        res.json({
            message: 'Usuarios listados',
            total: usuarios.length,
            estado: 'success',
            usuarios: usuarios
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al listar los usuarios',
            estado: 'error',
            error: error.message
        });
    }
});

router.get('/:id', async(req, res) => {
    const id = req.params.id;
    try {
        const usuario = await Usuario.findById(id).populate('departamento');
        if (usuario) {
            res.json({
                message: 'Usuario encontrado',
                estado: 'success',
                usuario: usuario
            });
        } else {
            res.status(404).json({
                message: 'Usuario no encontrado',
                estado: 'error'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al buscar el usuario',
            estado: 'error'
        });
    }
});

router.get('/cedula/:cedula', async(req, res) => {
    const cedula = req.params.cedula;
    try {
        const usuario = await Usuario.findOne({ cedula: cedula }).populate('departamento');
        if (usuario) {
            res.json({
                message: 'Usuario encontrado',
                estado: 'success',
                usuario: usuario
            });
        } else {
            res.status(404).json({
                message: 'Usuario no encontrado',
                estado: 'error'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al buscar el usuario',
            estado: 'error'
        });
    }
});

//crear endpoint para actualizar o eliminar un usuario
router.put('/:id', async(req, res) => {
    const id = req.params.id;

    try {
        const usuario = await Usuario.findById(id).populate('departamento');
        if (!usuario) {
            return res.status(404).json({
                message: 'Usuario no encontrado',
                estado: 'error'
            });
        }

        const payload = (req.body && typeof req.body === 'object') ? req.body : {};
        const { nombre, email, cedula, tipoUsuario } = payload;

        if (!nombre && !email && !cedula && !tipoUsuario) {
            return res.status(400).json({
                message: 'Debe enviar al menos un campo para actualizar en el body (JSON).',
                estado: 'error'
            });
        }

        if (nombre !== undefined) usuario.nombre = nombre;
        if (email !== undefined) usuario.email = email;
        if (cedula !== undefined) usuario.cedula = cedula;
        if (tipoUsuario !== undefined) usuario.tipoUsuario = tipoUsuario;

        await usuario.save();
        res.json({
            message: 'Usuario actualizado',
            estado: 'success',
            usuario: usuario
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar el usuario',
            estado: 'error'
        });
    }
});

router.delete('/:id', async(req, res) => {
    const id = req.params.id;
    try {
        const usuario = await Usuario.findById(id).populate('departamento');
        if (!usuario) {
            return res.status(404).json({
                message: 'Usuario no encontrado',
                estado: 'error'
            });
        }
        await usuario.deleteOne();
        res.json({
            message: 'Usuario eliminado',
            estado: 'success'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar el usuario',
            estado: 'error'
        });
    }
});

// Investigar como se crean las clases en JavaScript y adaptar el ejemplo al uso de la misma

module.exports = router;