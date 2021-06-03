const Usuario = require('../sources/models/usuario.model')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


//Funciones Usuarios
const crearUsuario = async(body) => {
    correo = await Usuario.findOne({ correo: body.correo_usuario }).select({ correo_usuario: 1, _id: 0 })
    if (correo) {
        return null
    } else {
        let usuario = new Usuario({
            nombre_usuario: body.nombre_usuario,
            correo_usuario: body.correo_usuario,
            password_usuario: bcrypt.hashSync(body.password_usuario, 10),
            nivel_acceso_usuario: 0,
        })
        return await usuario.save()
    }
}

const listarUsuarios = async() => {
    let usuarios = await Usuario.find({ estado_usuario: true }).select({ nombre_usuario: 1, correo_usuario: 1, nivel_acceso_usuario: 1, _id: 0 })
    return usuarios
}

module.exports = {
    crearUsuario,
    listarUsuarios
}