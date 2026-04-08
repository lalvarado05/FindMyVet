const mongoose = require('mongoose');
const departamento = require('./departamento');

const usuarioSchema = new mongoose.Schema({
    // id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    cedula: { type: String, required: true, unique: true },
    tipoUsuario: { type: String, required: true },
    departamento: { type: mongoose.Schema.Types.ObjectId, ref: 'Departamento', required: true, default: null }
});

module.exports = mongoose.model('Usuario', usuarioSchema);