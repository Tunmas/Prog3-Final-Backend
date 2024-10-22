const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario_modelo'); 

// Ruta para obtener todos los usuarios (clientes) con paginación
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;

  try {
    const total = await Usuario.countDocuments();
    const usuarios = await Usuario.find().skip(skip).limit(pageSize);
    res.json({ usuarios, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
});

// Ruta para obtener un usuario por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID no válido' });
  }

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error });
  }
});

// POST - Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(400).json({ message: 'Error al crear el usuario', error: error.message });
  }
});

// PATCH - Modificar el estado (activo) de un usuario
router.patch('/:id/estado', async (req, res) => {
  try {
    const { activo } = req.body;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { activo },
      { new: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al modificar el estado del usuario:', error);
    res.status(400).json({ message: 'Error al modificar el estado del usuario' });
  }
});

// PUT - Actualizar un usuario por su ID
router.put('/:id', async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(400).json({ message: 'Error al actualizar el usuario' });
  }
});

module.exports = router;
