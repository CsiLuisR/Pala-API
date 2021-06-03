const express = require("express")
const router = express.Router();
const {agregarItemsCsv, cargarItems} = require('../controllers/items.controller')
const {verificarToken} = require ('../sources/middlewares/autorizacion');

router.post("/items/verificar", agregarItemsCsv)
router.post("/items/cargar", cargarItems)

module.exports = router;