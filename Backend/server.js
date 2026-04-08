require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Luego agregamos info de DB

// Aqui van las rutas de la API
const usuariosRoutes = require('./routes/usuarios.route');
const departamentosRoutes = require('./routes/departamento.route');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/departamentos', departamentosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

