const express = require("express")
const router = express.Router();
const {verificarToken} = require ('../sources/middlewares/autorizacion');
const {registrarClienteRuta, consultarContratos} = require('../controllers/client.controller')

router.post("/registrarCliente", verificarToken, registrarClienteRuta)
router.get("/consultarContrato", consultarContratos)

module.exports = router