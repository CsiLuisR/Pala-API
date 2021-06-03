const archivos = require('../routes/file.routes')
const auth = require('../routes/auth.routes')
const obra = require('../routes/obra.routes')
const cliente = require('../routes/cliente.routes')
const item = require('../routes/items.routes')
const controlCosto = require ('../routes/controlCosto.routes')

module.exports = (app) => {
    app.use('/api', archivos);
    app.use("/api", auth);
    app.use("/api", obra);
    app.use("/api", cliente);
    app.use("/api", item);
    app.use("/api", controlCosto)
}