const mongoose = require('mongoose');

const departamentoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String , required: false, default: '' }
});

module.exports = mongoose.model('Departamento', departamentoSchema);