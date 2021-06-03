const express = require("express")
const router = express.Router();
const {verificarToken} = require ('../sources/middlewares/autorizacion');
const {crearObraRuta, consultarObras} = require('../controllers/obra.controller')

router.post("/crearObra", verificarToken, crearObraRuta)
router.get("/consultaObras", verificarToken, consultarObras)


module.exports = router