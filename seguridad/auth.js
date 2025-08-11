const jwt = require('jsonwebtoken');
require('dotenv').config();
function verificarToken(req, res, next) {


const token = req.query.token || req.headers['authorization'].split(' ')[1];
 console.log(token)
 
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);    // Verifica y decodifica el token
    req.usuarioId = decoded.id;                    // Guardamos el id del token en la request para usarlo después
    next();                                       // Token válido, continuar a la siguiente función
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}
module.exports = { verificarToken };