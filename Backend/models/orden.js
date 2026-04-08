const mongoose = require('mongoose');

const itemOrdenSchema = new mongoose.Schema({
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true, min: 1 }
}, { _id: false });

const ordenSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    items: { type: [itemOrdenSchema], required: true },
    total: { type: Number, required: true },
    estado: {
        type: String,
        enum: ['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'],
        default: 'PENDIENTE'
    }
}, { timestamps: true });

module.exports = mongoose.model('Orden', ordenSchema);
