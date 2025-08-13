const Camiseta = require('../models/camiseta');
const Usuario = require('../models/Usuario');

exports.getCamisetas = async (req, res) => {
  try {
    const camisetas = await Camiseta.find();
    const camisetasConUsuario = await Promise.all(
      camisetas.map(async (c) => {
        try {
          const usuario = await Usuario.findById(c.creador).select('nombre correo');
          return {
            ...c.toObject(),        // Convertir el documento de Mongoose a objeto plano JS
            creador: usuario || null // Reemplazar el campo 'creador' con los datos del usuario (o null si no se encontró)
          };
        } catch (error) {
          console.log(error)
          return {
            ...c.toObject(),
            creador: null
          };
        }
      })
    );    
    res.json(camisetasConUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.getCamisetasorderbycalificacion = async (req, res) => {
  try {
    const camisetas = await Camiseta.find().sort({calificacion:-1});
    const camisetasConUsuario = await Promise.all(
      camisetas.map(async (c) => {
        try {
          const usuario = await Usuario.findById(c.creador).select('nombre correo');
          return {
            ...c.toObject(),        // Convertir el documento de Mongoose a objeto plano JS
            creador: usuario || null // Reemplazar el campo 'creador' con los datos del usuario (o null si no se encontró)
          };
        } catch (error) {
          console.log(error)
          return {
            ...c.toObject(),
            creador: null
          };
        }
      })
    );    
    res.json(camisetasConUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};


exports.getCamisetaById = async (req, res) => {
  try {
    const camiseta = await Camiseta.findById(req.params.id);
    if (!camiseta) return res.status(404).json({ error: 'Camiseta no encontrada' });
    res.json(camiseta);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.createCamiseta = async (req, res) => {
  try {
    const nuevaCamiseta = new Camiseta(req.body);
    nuevaCamiseta.creador = req.usuarioId
    console.log(nuevaCamiseta.creador)
    camisetaGuardada=await nuevaCamiseta.save();
    res.status(201).json(CamisetaGuardada);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear la camiseta' });
  }
};

exports.calificarcamiseta = async (req, res) => {
  const id = req.params.id;
  const { calificacion } = req.body;  // calificacion será 1 o -1 según voto
  try {
    // Buscar la camiseta por ID en la base de datos
    const camiseta = await Camiseta.findById(id);
    if (!camiseta) {
      return res.status(404).json({ error: 'Camiseta no encontrada' });
    }
    // Actualizar solo el campo calificacion sumando el valor recibido
    camiseta.calificacion += calificacion;
    await camiseta.save();  // guardar cambios en la BD
    // Devolver la camiseta actualizada (opcionalmente podría devolver solo status)
    return res.json(camiseta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de servidor' });
  }
};


exports.updateCamiseta = async (req, res) => {
  try {
    const camisetaActualizada = await Camiseta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!camisetaActualizada) return res.status(404).json({ error: 'Camiseta no encontrado' });
    res.json(camisetaActualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
};

exports.deleteCamiseta = async (req, res) => {
  try {
    const camisetaEliminada = await Camiseta.findByIdAndDelete(req.params.id);
    if (!camisetaEliminada) return res.status(404).json({ error: 'Camiseta no encontrado' });
    res.json({ message: 'Camiseta eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

