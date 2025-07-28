const express = require('express');
const router = express.Router();
const camisetaController = require('../controllers/camisetaController');
const { verificarToken } = require('../seguridad/auth');

router.get('/', camisetaController.getCamisetas);
router.get('/:id',verificarToken, camisetaController.getCamisetaById);
router.post('/',verificarToken, camisetaController.createCamiseta);
router.put('/:id',verificarToken, camisetaController.updateCamiseta);
router.delete('/:id',verificarToken, camisetaController.deleteCamiseta);

module.exports = router;