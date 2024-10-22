const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS personalizada
const corsOptions = {
  origin: process.env.CLIENT_URL || 'https://prog3-final.vercel.app/',
  credentials: true, // Habilita las cookies de sitios cruzados
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); 
app.use(express.json()); 

// Conectar a la base de datos de usuarios en MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a la base de datos de usuarios'))
.catch(err => console.error('Error conectando a la base de datos de usuarios:', err));

// Verificación de la conexión de mongoose
mongoose.connection.on('connected', () => {
  console.log('Mongoose está conectado correctamente a la base de datos');
});

mongoose.connection.on('error', (err) => {
  console.error('Error en la conexión de Mongoose:', err);
});

// Importar rutas
const usuarioRutas = require('./routes/Usuario_rutas');
app.use('/api/usuarios', usuarioRutas);

// Middleware para la verificación de solicitudes
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Ocurrió un error en el servidor', error: err.message });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
