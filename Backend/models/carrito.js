const mongoose = require('mongoose');

const itemCarritoSchema = new mongoose.Schema({
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad: { type: Number, required: true, min: 1, default: 1 }
}, { _id: false });

const carritoSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
    items: [itemCarritoSchema]
}, { timestamps: true });

module.exports = mongoose.model('Carrito', carritoSchema);
