const mongoose = require('mongoose')

const item_esquema = new mongoose.Schema({
    clave: 
    {
        type: String,
        required: true
    },
    descripcion: 
    {
        type: String,
        required: true
    },
    unidad: 
    {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Item', item_esquema)