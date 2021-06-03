const lodash = require('lodash')
const {cloneDeep} = require('lodash');
const Item = require('../sources/models/item.model')
const csv = require('csvtojson')
const path = require('path');

const agregarItemsCsv = async (req, res) => {
    if (!req.files) {
        res.status(400).json({
            message: "No file Uploaded"
        })
        return
    } 
    try {
        const {file} = req.files
        if ( path.extname(file.name) != ".csv") {
            res.status(400).json({
                message: "File must be CSV"
            })
            return
        }
        const {data} = file      
        const jsonObj = await csv().fromString(data.toString())
        const newObj = tratarJson(jsonObj)
        const clavesUnicas = obtenerClaves(newObj)
        const itemsDB = await buscarItemsFolio(clavesUnicas)

        if(itemsDB.length == 0) {
            res.status(400).send({Error: "Items no encontrados en la DB"})
            return
        }

        const itemsResult = cloneDeep(itemsDB).map(res => ({
            clave: res.clave,
            unidad: res.unidad,
            descripcion: res.descripcion,
            cantidad: obtenerDato(res.clave, newObj, "cantidad"),  
            precioUnitario: obtenerDato(res.clave, newObj, "precioUnitario"),
            total: obtenerDato(res.clave, newObj, "total"),  
            partida: obtenerDato(res.clave, newObj, "partida")    
        }))

        const clavesUnicasItems = obtenerClaves(itemsResult)
        const clavesUnicasItemsFaltantes = lodash.difference(clavesUnicas, clavesUnicasItems)
        const itemsFaltantes = clavesUnicasItemsFaltantes.map(el => (newObj.find(foo => foo.clave == el )))
        console.log(newObj)

        const partidas = new Set(itemsResult.map(res => (res.partida)))
        const partidasUnicas = [...partidas]
        partidasUnicas.map(el => {
            const partidasResult = itemsResult.filter(foo => el == foo.partida)
            const totalPartidas = partidasResult.reduce((acc, ele) => acc+ele.total,0 )
            itemsResult.map(elem => {
                if(elem.partida === el) {
                    elem.totalPartida = totalPartidas
                    elem.partidayTotal = elem.partida + " $" + totalPartidas
                }
            })
        })
        if (itemsResult === null) {
            res.status(400).json({
                error: "Error"
            })
            return
        } else {
            res.status(200).json({
                Items_Encontrados: itemsResult,
                Items_No_Encontrados: itemsFaltantes
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "file convert failed"
        })
        return
    }
}

const cargarItems = async (req, res) => {
    try {
        const body = req.body.objeto
        const clavesUnicas = obtenerClaves(body)
        const itemsBusqueda = await buscarItemsFolio(clavesUnicas)
        if (body.length == itemsBusqueda.length)
        {
            res.status(400).send({Error: "Todos los items se encuentran cargados en la base de datos"})
            return
        }
        const clavesUnicasBusqueda = obtenerClaves(itemsBusqueda)
        const itemsNoEncontrados = lodash.difference(clavesUnicas, clavesUnicasBusqueda)
        const itemsN = []
        body.map(el => {
            itemsNoEncontrados.map(ele => {
                if(el.clave == ele) {
                    itemsN.push(el)
                }
            })
        })
        const itemsSiEncontrados = lodash.difference(body, itemsN)
        itemsN.map(el => {
            let item = new Item({
                clave: el.clave,
                descripcion: el.descripcion,
                unidad: el.unidad
            })
            return item.save()
        })
        res.status(200).send({
            Mensaje: "Items Cargados Correctamente",
            Items_Cargados: itemsN,
            Items_Encontrados_enDB: itemsSiEncontrados
        })
        return
    }
    catch (err) {
        res.status(400).send(err)
    } 
    return   
}

const obtenerClaves = (arr) => {
    const claves = arr.map(res => (res.clave))
    return claves
}

const buscarItemsFolio = async(folios) => {
    const items = await Item.find({clave: {$in: folios}}).select({_id: 0,__v: 0})
    return items
}

const obtenerDato = (clave, arr, dato) => {
    const res = cloneDeep(arr).filter(el => el.clave === clave)
    if (res.length === 0){
        return null
    } 
    switch (dato) {
        case "cantidad": return res[0].cantidad
        case "precioUnitario": return res[0].precioUnitario
        case "total": return res[0].total
        case "partida": return res[0].partida
    }
}

const tratarJson = (jsonObj) => {
    let partida = ''
    var newObj = []
    jsonObj.map(v => {        
        if(v.Unidad == ''){
            partida = v['Descripcion']
        }else{
            newObj.push({ 
                'clave': v['Clave'],
                'descripcion': v['Descripcion'],
                'partida': partida,
                'unidad': v['Unidad'],
                'cantidad': v['Cantidad'],
                'precioUnitario': parseFloat(v['Precio unitario'].replace('$', '').replace(',', '')),
                'total': parseFloat(v['Total'].replace('$', '').replace(',', ''))
            })
        }
    })
    return newObj
}

module.exports = {cargarItems, agregarItemsCsv}