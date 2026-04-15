const express = require('express');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const { auth, esAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { categoria, busqueda } = req.query;
        const filtro = { activo: true };

        if (categoria) filtro.categoria = categoria;
        if (busqueda) {
            filtro.$or = [
                { nombre: { $regex: busqueda, $options: 'i' } },
                { descripcion: { $regex: busqueda, $options: 'i' } }
            ];
        }

        const productos = await Producto.find(filtro).populate('categoria');
        res.json({
            message: 'Productos listados.',
            total: productos.length,
            estado: 'success',
            productos
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al listar productos.', estado: 'error', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id).populate('categoria');
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado.', estado: 'error' });
        }
        res.json({ message: 'Producto encontrado.', estado: 'success', producto });
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar producto.', estado: 'error', error: error.message });
    }
});

router.post('/', auth, esAdmin, async (req, res) => {
    const { nombre, categoriaId, precio, descripcion, imagen, stock } = req.body;

    if (!nombre || !categoriaId || precio === undefined) {
        return res.status(400).json({
            message: 'Los campos nombre, categoriaId y precio son requeridos.',
            estado: 'error'
        });
    }

    try {
        const categoriaExiste = await Categoria.findById(categoriaId);
        if (!categoriaExiste) {
            return res.status(400).json({ message: 'La categoría no existe.', estado: 'error' });
        }

        const producto = new Producto({
            nombre,
            categoria: categoriaId,
            precio, descripcion, imagen, stock
        });
        await producto.save();

        const productoPopulado = await Producto.findById(producto._id).populate('categoria');
        res.status(201).json({ message: 'Producto creado.', estado: 'success', producto: productoPopulado });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto.', estado: 'error', error: error.message });
    }
});

router.put('/:id', auth, esAdmin, async (req, res) => {
    try {
        if (req.body.categoriaId) {
            const categoriaExiste = await Categoria.findById(req.body.categoriaId);
            if (!categoriaExiste) {
                return res.status(400).json({ message: 'La categoría no existe.', estado: 'error' });
            }
            req.body.categoria = req.body.categoriaId;
            delete req.body.categoriaId;
        }

        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('categoria');
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado.', estado: 'error' });
        }
        res.json({ message: 'Producto actualizado.', estado: 'success', producto });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto.', estado: 'error', error: error.message });
    }
});

router.delete('/:id', auth, esAdmin, async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado.', estado: 'error' });
        }
        res.json({ message: 'Producto eliminado.', estado: 'success' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto.', estado: 'error', error: error.message });
    }
});

router.put('/:id/stock', auth, esAdmin, async (req, res) => {
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
        return res.status(400).json({
            message: 'El stock debe ser un número mayor o igual a 0.',
            estado: 'error'
        });
    }

    try {
        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            { $inc: { stock } },
            { new: true, runValidators: true }
        ).populate('categoria');
        
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado.', estado: 'error' });
        }
        res.json({ message: 'Stock actualizado.', estado: 'success', producto });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar stock.', estado: 'error', error: error.message });
    }
});

module.exports = router;
