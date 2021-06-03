const mongoose = require('mongoose')

const cliente_esquema = new mongoose.Schema({
    folio_contrato: { type: String, required: true },
    monto_anticipo_cliente: { type: Number, required: true },
    monto_avance_cliente: { type: Number, required: true },
    folioObra: { type: String, required: true },
    obraSeleccionada: {
        folio: { type: String, required: true },
        nombre: { type: String, required: true },
        monto_total: { type: Number, required: true },
        numero_contrato: { type: String, required: true },
        ubicacion: { type: String, required: true },
        fecha_contrato: { type: String, required: true },
        fecha_inicio: { type: String, required: true },
        fecha_fin: { type: String, required: true },
        partidas: []
    },
    datos_cliente: {
        datos_personales: {
            correo: { type: String, required: true },
            nombre: { type: String, required: true },
            telefonoFijo: { type: String, required: true },
            telefonoMovil: { type: String, required: true },
        },
        datos_fiscales: {
            nombreEmpresa: { type: String, required: true },
            rfc: { type: String, required: true },
            direccionFiscal: { type: String, required: true },
            direccionOficina: { type: String, required: true },
            calleReferencia1: { type: String, required: true },
            calleReferencia2: { type: String, required: true },
            cp: { type: String, required: true },
            colonia: { type: String, required: true },
            ciudad: { type: String, required: true },
            estado: { type: String, required: true },
        },
        datos_bancarios: {
            numeroClave: { type: String, required: true },
            cuenta: { type: String, required: true },
            razonSocial: { type: String, required: true },
        }
    }
})

module.exports = mongoose.model('Cliente', cliente_esquema)