// Ejemplo de esquema Camiseta (simplificado)
const { Schema, model } = require('mongoose');

const CamisetaSchema = new Schema({
  creador: String,
  torsoColor: String,
  mangaIzqColor: String,
  mangaDerColor: String,
  cuelloDerColor: String,
  cuelloIzqColor: String,
  fechaCreacion: { type: Date, default: Date.now },
  votos: [],       // (ver siguiente sección)
  calificacion: { type: Number, default: 0 }
});

module.exports = model('Camiseta', CamisetaSchema);