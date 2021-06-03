const mongoose = require('mongoose')

const obra_esquema = new mongoose.Schema({
    folio_obra: { type: String, required: true },
    nombre_obra: { type: String, required: true },
    monto_total_obra: { type: Number, required: true },
    numero_contrato_obra: { type: String, required: true },
    ubicacion_obra: { type: String, required: true },
    fecha_contrato_obra: { type: String, required: true },
    fecha_inicio_obra: { type: String, required: true },
    fecha_fin_obra: { type: String, required: true },
    estado_obra: { type: Boolean, default: true },
    contrato_obra: { type: Boolean, default: false },
    partidas_obra: []
})

module.exports = mongoose.model('Obra', obra_esquema)