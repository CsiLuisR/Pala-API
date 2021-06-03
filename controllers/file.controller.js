const convert = require('xml-js');
const Factura = require('../sources/models/factura.model')
const path = require('path');

const convertXML = async (req, res) => {
    if (!req.files) {
        res.status(400).json({
            message: "No file Uploaded"
        })
        return
    } 
    try {  
        const {file} = req.files
        if ( path.extname(file.name) != ".xml") {
            res.status(400).json({
                message: "File must be XML"
            })
            return
        }
        const {data} = file
        const fileJson = convert.xml2json(data, {compact: false, spaces: 4});
        const archivo = JSON.parse(fileJson)

        delete archivo.elements[0].elements[2].elements[0].attributes.ClaveProdServ
        delete archivo.elements[0].elements[2].elements[0].attributes.Unidad

        const arreglo = archivo.elements[0].elements[2].elements

        const conceptos = []

        for(let n of arreglo ){
            conceptos.push(n.attributes);
        }

        const objeto = {
            total: archivo.elements[0].attributes.Total,
            subtotal: archivo.elements[0].attributes.SubTotal,
            moneda: archivo.elements[0].attributes.Moneda,
            fecha: archivo.elements[0].attributes.Fecha,
            folioFiscal: archivo.elements[0].attributes.Folio,
            receptor: {
                rfc: archivo.elements[0].elements[1].attributes.Rfc,
                nombre: archivo.elements[0].elements[1].attributes.Nombre
            },
            conceptos: conceptos
        } 
        res.status(200).json(objeto)
    } catch (error) {
        res.status(400).json({
            message: error
        })
        return
    }
}

const guardarFactura = async (req, res) => {
    try {
    let body = req.body.objeto
    let identificador = await Factura.findOne({ folioFiscal: body.folioFiscal }).select({ folioFiscal: 1, _id: 0 })
    if (identificador) {
        res.status(400).send({Error: "Ya existe una factura con este folio fiscal"})
    } else{
        let factura = new Factura ({
            total: body.total,
            subtotal: body.subtotal,
            moneda: body.moneda,
            fecha: body.fecha,
            folioFiscal: body.folioFiscal,
            receptor: {
                rfc: body.receptor.rfc,
                nombre: body.receptor.nombre
            },
            conceptos: body.conceptos,
            folioObra: body.folioObra
        })
        await factura.save()
        res.status(200).json(factura)
        } 
    }   
    catch (err) {
        res.status(400).json({error: err})
    }
}

module.exports = {convertXML, guardarFactura}