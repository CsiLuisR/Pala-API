const Usuario = require('../models/usuario.model')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {mTokenGeneral, mPrivateKey} = require("../configToken")

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

const usuarioAutenticado = async (req, res) => {
    try{
        const usuario = await Usuario.findOne({correo_usuario: req.usuario.correo_usuario}).select({password_usuario: 0, _id: 0, estado_usuario:0})
        res.json({ usuario })

    } catch (error){
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error' })
    }
}

const verificarTokenGeneral = (req, res, next) => {
    const tokenGeneral = req.get("AutorizadoG")
    if (tokenGeneral !== mTokenGeneral){
        return res.status(401).json({
            error: "Acceso restringido, Token no válido"
        })
    }
    next()
}

const verificarToken = (req, res, next) => {
    const token = req.get('Autorizado')
    if(!token){
        return res.status(401).json({ error: 'Acceso Restringido, Token Inválido!' })
    } else {
        try {
            let tokenGeneral = req.get("AutorizadoG")  
            if (tokenGeneral !== mTokenGeneral){
                return res.status(401).json({
                    error: "Acceso restringido, Token no válido"
                })
            }
            const payload = jwt.verify(token, mPrivateKey)
            req.usuario = payload.usuario
            next()
        } catch (error) {
            if( error.name === 'TokenExpiredError' ) {
                console.log('TokenExpiredError');
                return res.status(400).json({ error: 'Session timed out, Porfavor logearse nuevamente' })
            }else if (error.name === 'JsonWebTokenError') {
                console.log('JsonWebTokenError');
                return res.status(401).json({ error: 'Token Inválido, Intenta nuevamente' })
            } else {
                console.log(error)
                return res.status(400).json({ error })
            }
        }
    }
}

module.exports = {asignarToken, usuarioAutenticado, verificarToken, verificarTokenGeneral}