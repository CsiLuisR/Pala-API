const express = require("express")
const router = express.Router();
const {convertXML, guardarFactura} = require ('../controllers/file.controller');
const {verificarToken} = require ('../sources/middlewares/autorizacion');

router.post("/archivos/XML", verificarToken, convertXML)
router.post("/archivos/subirFactura", guardarFactura)

module.exports = router;