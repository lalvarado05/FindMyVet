const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    cedula: { type: String, default: '', unique: true },
    rol: { type: String, enum: ['cliente', 'admin'], default: 'cliente' }
}, { timestamps: true });

usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

usuarioSchema.methods.compararPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
