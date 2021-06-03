const Costo = require('../sources/models/costo.model')
const shortID = require('short-id')

shortID.configure({
    length: 10,          // The length of the id strings to generate
    algorithm: 'sha1',  // The hashing algoritm to use in generating keys
    salt: Math.random   // A salt value or function
});

const generarID = (tipo) => {
    return `${tipo}-${shortID.generate()}`
}

const crearCentroCosto = async (body, folioObra) => {
    const shID = generarID("CO")
    const partidasNuevas = body.partidas_obra.map(item => 
        item = {
            clave: item.clave,
            descripcion: item.descripcion,
            unidad: item.unidad,
            cantidadEstimada: item.cantidad,
            precioUnitarioEstimado: item.precioUnitario,
            totalEstimado: item.total,
            cantidad: 0,
            total: 0,
            facturas: []
        })
    console.log(partidasNuevas)
    let costo = new Costo({
        folio_obra: folioObra,
        folio_costo: shID,
        lista_items: partidasNuevas,
        monto_total: body.monto_total_obra,
        monto_total_restante: body.monto_total_obra,
        monto_total_gastado: 0,
        nombre_obra: body.nombre_obra
    })
    return await costo.save()
}

const restarFactura = async (req, res) => {
    try {
        const body = req.body
        const controlCosto = await Costo.find({ folio_obra: body.folioObra }).select({ _id: 0 })
        if (controlCosto == 0) {
            res.status(400).send({Error: "No se encontro la obra registrada con ese folio"})
        }
        const itemsFactura = body.conceptos.map(el => {
            return {
                clave: el.claveSelect,
                total: parseFloat(el.Importe),
                cantidad: parseFloat(el.Cantidad),
            }
        })
        itemsFactura.map(itemF => {
            controlCosto[0].lista_items.map(itemC => {
                if (itemF.clave == itemC.clave) {
                    itemC.cantidad = itemC.cantidad + itemF.cantidad
                    itemC.total = itemC.total + itemF.total
                    controlCosto[0].monto_total_gastado = controlCosto[0].monto_total_gastado + itemF.total
                    controlCosto[0].monto_total_restante = controlCosto[0].monto_total_restante - itemF.total
                    itemC.facturas.push(body.folio_factura)
                }
                return
            })
        })
        // let costo = new Costo({

        // })
        res.status(200).send(controlCosto)
        return
    } catch (error) {
        res.status(400).send({Error: error})
        return
    }
}

module.exports = {crearCentroCosto, restarFactura}