const mongoose = require('mongoose')

const factura_esquema = new mongoose.Schema({
    total: { type: String, required: true},
    subtotal: { type: String, required: true},
    moneda: { type: String, required: true},
    fecha: { type: String, required: true},
    folioFiscal: { type: String, required: true},
    receptor:{
        rfc: { type: String, required: true},
        nombre: { type: String, required: true},
    },
    conceptos:[],
    folioObra: { type: String, required: true}
})

module.exports = mongoose.model('Factura', factura_esquema)