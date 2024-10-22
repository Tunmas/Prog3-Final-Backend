const mongoose = require('mongoose');

// Definir el esquema del usuario
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String },
  direccion: { type: String },
  fechaRegistro: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true }
});

// Crear y exportar el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
