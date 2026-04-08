const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
    precio: { type: Number, required: true },
    descripcion: { type: String, default: '' },
    imagen: { type: String, default: '' },
    stock: { type: Number, default: 0 },
    activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);
