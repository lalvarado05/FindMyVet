const express = require('express');
const Orden = require('../models/orden');
const Carrito = require('../models/carrito');
const Producto = require('../models/producto');
const { auth, esAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const carrito = await Carrito.findOne({ usuario: req.usuario._id }).populate('items.producto');

        if (!carrito || carrito.items.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío.', estado: 'error' });
        }

        for (const linea of carrito.items) {
            if (!linea.producto) {
                return res.status(400).json({
                    message: 'Un producto del carrito ya no está disponible. Actualice el carrito.',
                    estado: 'error'
                });
            }
        }

        const items = carrito.items.map(item => ({
            producto: item.producto._id,
            nombre: item.producto.nombre,
            precio: item.producto.precio,
            cantidad: item.cantidad
        }));

        for (const linea of carrito.items) {
            await Producto.updateOne(
                { _id: linea.producto._id },
                { $inc: { stock: -linea.cantidad } }
            );
        }

        const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

        const orden = new Orden({
            usuario: req.usuario._id,
            items,
            total
        });
        await orden.save();

        carrito.items = [];
        await carrito.save();

        const ordenPopulada = await Orden.findById(orden._id)
            .populate('usuario', 'nombre email username')
            .populate('items.producto');

        res.status(201).json({ message: 'Orden creada exitosamente.', estado: 'success', orden: ordenPopulada });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la orden.', estado: 'error', error: error.message });
    }
});

router.get('/mis-ordenes', auth, async (req, res) => {
    try {
        const ordenes = await Orden.find({ usuario: req.usuario._id })
            .populate('items.producto')
            .sort({ createdAt: -1 });

        res.json({
            message: 'Órdenes del usuario.',
            total: ordenes.length,
            estado: 'success',
            ordenes
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener órdenes.', estado: 'error', error: error.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const orden = await Orden.findById(req.params.id)
            .populate('usuario', 'nombre email username')
            .populate('items.producto');

        if (!orden) {
            return res.status(404).json({ message: 'Orden no encontrada.', estado: 'error' });
        }

        if (orden.usuario._id.toString() !== req.usuario._id.toString() && req.usuario.rol !== 'admin') {
            return res.status(403).json({ message: 'No tiene permiso para ver esta orden.', estado: 'error' });
        }

        res.json({ message: 'Orden encontrada.', estado: 'success', orden });
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar orden.', estado: 'error', error: error.message });
    }
});

router.get('/', auth, esAdmin, async (req, res) => {
    try {
        const { estado, usuario } = req.query;
        const filtro = {};
        if (estado) filtro.estado = estado;
        if (usuario) filtro.usuario = usuario;

        const ordenes = await Orden.find(filtro)
            .populate('usuario', 'nombre email username')
            .populate('items.producto')
            .sort({ createdAt: -1 });

        res.json({
            message: 'Todas las órdenes.',
            total: ordenes.length,
            estado: 'success',
            ordenes
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al listar órdenes.', estado: 'error', error: error.message });
    }
});

router.put('/:id/estado', auth, esAdmin, async (req, res) => {
    const { estado } = req.body;
    const estadosValidos = ['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

    if (!estado || !estadosValidos.includes(estado)) {
        return res.status(400).json({
            message: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}`,
            estado: 'error'
        });
    }

    try {
        const ordenPrev = await Orden.findById(req.params.id);
        if (!ordenPrev) {
            return res.status(404).json({ message: 'Orden no encontrada.', estado: 'error' });
        }

        const pasaACancelado = estado === 'CANCELADO' && ordenPrev.estado !== 'CANCELADO';

        if (pasaACancelado) {
            for (const item of ordenPrev.items) {
                await Producto.updateOne(
                    { _id: item.producto },
                    { $inc: { stock: item.cantidad } }
                );
            }
            await Orden.findByIdAndUpdate(ordenPrev._id, { estado: 'CANCELADO' });
        } else {
            await Orden.findByIdAndUpdate(
                req.params.id,
                { estado },
                { new: true, runValidators: true }
            );
        }

        const orden = await Orden.findById(req.params.id)
            .populate('usuario', 'nombre email username')
            .populate('items.producto');

        const msg = pasaACancelado
            ? 'Orden cancelada y stock devuelto al inventario.'
            : `Orden actualizada a ${estado}.`;

        res.json({ message: msg, estado: 'success', orden });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar orden.', estado: 'error', error: error.message });
    }
});

module.exports = router;
