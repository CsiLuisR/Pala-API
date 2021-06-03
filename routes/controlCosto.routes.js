const express = require("express")
const router = express.Router();
const {verificarToken} = require ('../sources/middlewares/autorizacion');
const {restarFactura} = require ('../controllers/controlCosto.controller')

router.post("/control", verificarToken, restarFactura)

module.exports = router;