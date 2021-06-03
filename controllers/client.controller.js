const Cliente = require('../sources/models/cliente.model')
const Obra = require('../sources/models/obra.model')
const shortID = require('short-id')

shortID.configure({
    length: 10,          // The length of the id strings to generate
    algorithm: 'sha1',  // The hashing algoritm to use in generating keys
    salt: Math.random   // A salt value or function
});

const generarID = (tipo) => {
    return `${tipo}-${shortID.generate()}`
}

const registrarCliente = async (body) => {
    const shID = generarID("C")
    let identificador = await Cliente.findOne({ folio_contrato: shID }).select({ folio_contrato: 1, _id: 0 })
    if (identificador) {
        registrarCliente(body)
    } else {
        let folioObra = await Cliente.findOne({folioObra: body.obraSeleccionada.folio_obra }).select({ folioObra: 1, _id: 0 })
        if (folioObra) {
            return {Error: "La obra ya tiene un cliente registrado"}
        } else {
            let folioObraB = await Obra.findOne({folio_obra: body.obraSeleccionada.folio_obra }).select({ folio_obra: 1, _id: 0 })
            if (folioObraB) {
                let cliente = new Cliente({
                    folio_contrato: shID,
                    monto_anticipo_cliente: 0,
                    monto_avance_cliente: 0,
                    folioObra: body.obraSeleccionada.folio_obra,
                    obraSeleccionada: {
                        folio: body.obraSeleccionada.folio_obra,
                        nombre: body.obraSeleccionada.nombre_obra,
                        monto_total: body.obraSeleccionada.monto_total_obra,
                        numero_contrato: body.obraSeleccionada.numero_contrato_obra,
                        ubicacion: body.obraSeleccionada.ubicacion_obra,
                        fecha_contrato: body.obraSeleccionada.fecha_contrato_obra,
                        fecha_inicio: body.obraSeleccionada.fecha_inicio_obra,
                        fecha_fin: body.obraSeleccionada.fecha_fin_obra,
                        partidas: body.obraSeleccionada.partidas_obra
                    },
                    datos_cliente: {
                        datos_personales: {
                            correo: body.datos_cliente.datos_personales.correo,
                            nombre: body.datos_cliente.datos_personales.nombre,
                            telefonoFijo: body.datos_cliente.datos_personales.telefonoFijo,
                            telefonoMovil: body.datos_cliente.datos_personales.telefonoMovil,
                        },
                        datos_fiscales: {
                            nombreEmpresa: body.datos_cliente.datos_fiscales.nombreEmpresa,
                            rfc: body.datos_cliente.datos_fiscales.rfc,
                            direccionFiscal: body.datos_cliente.datos_fiscales.direccionFiscal,
                            direccionOficina: body.datos_cliente.datos_fiscales.direccionOficina,
                            calleReferencia1: body.datos_cliente.datos_fiscales.calleReferencia1,
                            calleReferencia2: body.datos_cliente.datos_fiscales.calleReferencia2,
                            cp: body.datos_cliente.datos_fiscales.cp,
                            colonia: body.datos_cliente.datos_fiscales.colonia,
                            ciudad: body.datos_cliente.datos_fiscales.ciudad,
                            estado: body.datos_cliente.datos_fiscales.estado,
                        },
                        datos_bancarios: {
                            numeroClave: body.datos_cliente.datos_bancarios.numeroClave,
                            cuenta: body.datos_cliente.datos_bancarios.cuenta,
                            razonSocial: body.datos_cliente.datos_bancarios.razonSocial,
                        }
                    }
                })
                await Obra.findOneAndUpdate({ folio_obra: body.obraSeleccionada.folio_obra }, {
                    $set: {
                        contrato_obra: true
                    }
                }, { new: true })
                return await cliente.save()
            }
            else {
                return {Error: "No existe una obra registrada con ese folio"}
            }
        }
    }
}

const registrarClienteRuta = (req, res) => {
    let body = req.body.objeto
    console.log(req.body)
    registrarCliente(body)
        .then(cliente => {
        if (cliente === null){
            res.status(400).json({
                error: "El cliente ya fue registrado"
            })
        } else {
            res.status(200).json(cliente)
        }
    }).catch(err => {
        res.status(400).send({Error: err})
    })
}

const consultarContratos = async (req, res) => {
    try{
        let contratos = await Cliente.find().select({_id: 0, __v: 0})
        if (contratos == 0)
        {
            res.status(400).send([])
            return
        }
        res.status(200).send(contratos)
        }    
    catch (err) {
        res.status(400).send({
            error: err
        })
        return
    }
}

module.exports = {registrarCliente, registrarClienteRuta, consultarContratos}