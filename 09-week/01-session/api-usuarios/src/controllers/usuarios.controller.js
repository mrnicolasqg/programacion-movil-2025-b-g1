const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');


const usuariosPath = path.join(__dirname, '../data/usuarios.json');

const leerUsuarios = () => {
  if (!fs.existsSync(usuariosPath)) return [];
  return JSON.parse(fs.readFileSync(usuariosPath, 'utf8'));
};

const guardarUsuarios = (data) => {
  fs.writeFileSync(usuariosPath, JSON.stringify(data, null, 2));
};


exports.crearUsuario = (req, res) => {
  const usuarios = leerUsuarios();
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  if (usuarios.find(u => u.email === email)) {
    return res.status(400).json({ mensaje: 'El correo ya está registrado' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const nuevo = {
    id: uuidv4(),
    nombre,
    email,
    password: hashed,
    fecha_creacion: new Date()
  };

  usuarios.push(nuevo);
  guardarUsuarios(usuarios);

  res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario: nuevo });
};


exports.listarUsuarios = (req, res) => {
  const usuarios = leerUsuarios();
  res.json(usuarios);
};


exports.obtenerUsuario = (req, res) => {
  const usuarios = leerUsuarios();
  const usuario = usuarios.find(u => u.id === req.params.id);
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  res.json(usuario);
};


exports.actualizarUsuario = (req, res) => {
  const usuarios = leerUsuarios();
  const index = usuarios.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  usuarios[index] = { ...usuarios[index], ...req.body };
  guardarUsuarios(usuarios);
  res.json({ mensaje: 'Usuario actualizado', usuario: usuarios[index] });
};


exports.eliminarUsuario = (req, res) => {
  const usuarios = leerUsuarios();
  const nuevos = usuarios.filter(u => u.id !== req.params.id);
  guardarUsuarios(nuevos);
  res.json({ mensaje: 'Usuario eliminado correctamente' });
};
