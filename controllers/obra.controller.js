const Obra = require('../sources/models/obra.model')
const shortID = require('short-id')
const {crearCentroCosto} = require('../controllers/controlCosto.controller')

shortID.configure({
    length: 10,          // The length of the id strings to generate
    algorithm: 'sha1',  // The hashing algoritm to use in generating keys
    salt: Math.random   // A salt value or function
});

const generarID = (tipo) => {
    return `${tipo}-${shortID.generate()}`
}

const crearObra = async (body) => {
    const shID = generarID("O")
    let identificador = await Obra.findOne({ folio_obra: shID }).select({ folio_obra: 1, _id: 0 })
    if (identificador) {
        crearObra(body)
    } else {
        await crearCentroCosto(body, shID)
        let obra = new Obra({
            folio_obra: shID,
            nombre_obra: body.nombre_obra,
            monto_total_obra: body.monto_total_obra,
            numero_contrato_obra: body.numero_contrato_obra,
            ubicacion_obra: body.ubicacion_obra,
            fecha_contrato_obra: body.fecha_contrato_obra,
            fecha_inicio_obra: body.fecha_inicio_obra,
            fecha_fin_obra: body.fecha_fin_obra,
            partidas_obra: body.partidas_obra
        })
        return await obra.save()
    }
}

const crearObraRuta = async (req, res) => {
    let body = req.body.objeto
    crearObra(body)
        .then(obra => {
        if (obra === null){
            res.status(400).json({
                error: "El folio ya fue registrado"
            })
            return
        } else {
            
            res.status(200).json({
                Obra_Creada: obra,
                Mensaje: "El control de costo de la obra fue creado correctamente"
            })
            return
        }
    }).catch(err => {
        if(err._message == "Obra validation failed"){
            res.status(400).send({Error: "Tipo de dato introducido no válido"})
            return
        }   
        res.status(400).send({Error: err})
        return
    })
}

const consultarObras = async (req, res) => {
    try{
        let obras = await Obra.find().select({_id: 0, __v: 0, "partidas_obra.tableData": 0})
        if (obras == 0)
        {
            res.status(400).send([])
            return
        }
        res.status(200).send(obras)
        return
        }    
    catch (err) {
        res.status(400).send({
            error: err
        })
        return
    }
}

module.exports = {crearObraRuta, consultarObras}