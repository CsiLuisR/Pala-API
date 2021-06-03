const mongoose = require('mongoose')
const {mPrivateKey, mRefreshToken, refreshTokenExpiration, tokenExpiration} = require('../configToken')
const jwt = require('jsonwebtoken')
const Token = require('../../sources/models/token.model')

const usuario_esquema = new mongoose.Schema({
    nombre_usuario: {
        type: String,
        required: true
    },
    correo_usuario: {
        type: String,
        required: true
    },
    password_usuario: {
        type: String,
        required: true
    },
    nivel_acceso_usuario: {
        type: Number,
        required: true
    },
    estado_usuario: {
        type: Boolean,
        default: true
    }
})

usuario_esquema.methods = {
    crearAccessToken: async function() {
        try{

            let {nombre_usuario, correo_usuario, nivel_acceso_usuario} = this
            let accessToken = jwt.sign(
                { usuario: {nombre_usuario, correo_usuario, nivel_acceso_usuario} },
                mPrivateKey,
                {
                    expiresIn: tokenExpiration
                }
            )
            return accessToken

        } catch( error ) {
            console.log(error)
            return
        }
    },
    crearRefreshToken: async function() {
        try {
            let {nombre_usuario, correo_usuario, nivel_acceso_usuario} = this
            let refreshToken = jwt.sign(
                { usuario: {nombre_usuario, correo_usuario, nivel_acceso_usuario}},
                 mRefreshToken,
                {
                    expiresIn: refreshTokenExpiration
                }
            )
            await new Token({ token: refreshToken }).save()
            return refreshToken

        } catch(error) {
            console.log(error)
            return
        }
    }
}

//exportar el modelo
module.exports = mongoose.model('Usuario', usuario_esquema)