const Departamento = require('../models/departamento');
const express = require('express');
const router = express.Router();

router.post('/', async(req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
        return res.status(400).json({
            message: 'El campo "nombre" es requerido.',
            estado: 'error'
        });
    }

    try {
        const departamento = new Departamento({ nombre, descripcion });
        await departamento.save();
        res.status(201).json({
            message: 'Departamento creado',
            estado: 'success',
            departamento: departamento
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear el departamento',
            estado: 'error'
        });
    }
});

router.get('/', async(req, res) => {
    try {
        const departamentos = await Departamento.find();
        res.json({
            message: 'Departamentos listados',
            total: departamentos.length,
            estado: 'success',
            departamentos: departamentos
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al listar los departamentos',
            estado: 'error',
            error: error.message
        });
    }
});


// Investigar como se crean las clases en JavaScript y adaptar el ejemplo al uso de la misma

module.exports = router;