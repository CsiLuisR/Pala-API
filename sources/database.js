const mongoose = require('mongoose')

const dbconnect = () => {
    return mongoose.connect("mongodb+srv://admin:gyY9RSWGKlTtdStf@cluster0-oitnp.mongodb.net/whatsapp_bot?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(() => console.log('conectado a MongoDB 💾'))
    .catch(err => console.log('No se pudo conectar a MongoDB', err))
}

module.exports = {dbconnect}