const express = require("express")
const fileUpload = require("express-fileupload")

const {dbconnect} = require("./sources/database")
const config = require("./sources/config")
const router  = require("./sources/router")

const app = express()

app.use(fileUpload({
  createParentPath: true
}))

config(app);
router(app);

const port = process.env.PORT || 3000

app.listen(port, () =>
  console.log(`Servidor Iniciado 💻`)
);

dbconnect();