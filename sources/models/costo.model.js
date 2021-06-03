const mongoose = require('mongoose')

const costo_esquema = new mongoose.Schema({
    folio_costo: { type: String, required: true },
    folio_obra: { type: String, required: true },
    lista_items: { type: Array, required: true },
    lista_manoObra: { type: Array, required: false },
    monto_total: { type: Number, required: true },
    monto_total_gastado: { type: Number, required: true },
    monto_total_restante: { type: Number, required: true },
    nombre_obra: { type: String, required: true }
})

module.exports = mongoose.model('Costo', costo_esquema)