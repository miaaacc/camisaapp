const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema({
  nombre:        { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  clave:         { type: String, required: true },
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = model('Usuario', usuarioSchema);