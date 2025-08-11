const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login de usuario (autenticación)
  exports.login = async (req, res) => {
  try {
    const { email, clave } = req.body;
    
    // 1. Buscar al usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' }); // No se encontró el email
    }
    // 2. Verificar la contraseña con bcrypt.compare
    const passwordOk = await bcrypt.compare(clave, usuario.clave);
    if (!passwordOk) {
      return res.status(401).json({ error: 'Credenciales inválidas' }); // Contraseña incorrecta
    }
    
    // 3. Credenciales válidas: Generar token JWT
    const datosToken = { id: usuario._id };            // Podemos incluir datos en el token (p.ej. el ID de usuario)
    const secreto = process.env.JWT_SECRET;            // Clave secreta para firmar el token (en producción, mantener en una variable de entorno)
    const opciones = { expiresIn: '1h' };              // El token expirará en 1 hora
    const token = jwt.sign(datosToken, secreto, opciones);
    
    // 4. Enviar el token al cliente
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.createUsuario = async (req, res) => {
  try {
    const { nombre, email, clave } = req.body;
    // 1. Generar un salt (semilla aleatoria) para el hash
    const salt = await bcrypt.genSalt(10);                  // 10 rondas de generación de salt
    // 2. Hashear la contraseña proporcionada usando el salt generado
    const hash = await bcrypt.hash(clave, salt);
    const nuevoUsuario = new Usuario({ nombre, email, clave: hash });
    usuarioGuardado=await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear usuario' });
  }
};

exports.updateUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
};

exports.deleteUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};