const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const auth = async (req, res, next) => {
    try {
        const header = req.header('Authorization');
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.', estado: 'error' });
        }

        const token = header.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findById(decoded.id).select('-password');

        if (!usuario) {
            return res.status(401).json({ message: 'Token inválido.', estado: 'error' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado.', estado: 'error' });
    }
};

const esAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.', estado: 'error' });
    }
    next();
};

module.exports = { auth, esAdmin };
