const express = require('express');
const usuariosRoutes = require('./routes/usuarios.routes');

const app = express();
app.use(express.json());

// Rutas base
app.use('/api/usuarios', usuariosRoutes);

app.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
});
