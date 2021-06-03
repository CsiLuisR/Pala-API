const Usuario = require("../sources/models/usuario.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// Obtiene que usuario esta autenticado
const usuarioAutenticado = async (req, res) => {
    try{
        const usuario = await Usuario.findOne({correo_usuario: req.usuario.correo_usuario}).select({password_usuario: 0, _id: 0, estado_usuario:0})
        res.json({ usuario })

    } catch (error){
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error' })
    }
}

const asignarToken = async (req, res) => {
    correo = req.body.objeto.correo
    password = req.body.objeto.password
    try {
        let correoUsuario = await Usuario.findOne({correo_usuario: correo})
        if(correoUsuario){
            const passwordValidar = bcrypt.compareSync(password, correoUsuario.password_usuario)
            if(passwordValidar){
                let accessToken = await correoUsuario.crearAccessToken()
                let refreshToken = await correoUsuario.crearRefreshToken() 
                return res.status(201).json({ accessToken, refreshToken })                   
            } else {
                return res.status(400).json({
                    error: "Usuario o Contraseña Incorrecto"
                })
            }
        }else {
            return  res.status(400).json({
                error: "Usuario o Contraseña Incorrecto"
            })
        }      
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: "Error en el Servicio "+ error
        })
    }
}

module.exports = {usuarioAutenticado, asignarToken}