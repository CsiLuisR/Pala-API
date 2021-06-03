const router = require('express').Router()
const {usuarioAutenticado, verificarToken, verificarTokenGeneral, asignarToken} = require('../sources/middlewares/autorizacion');
const { mRefreshToken, mPrivateKey, tokenExpiration } = require("../sources/configToken")
const Token = require('../sources/models/token.model')
const jwt = require('jsonwebtoken')

// Obtiene al usuario autenticado
router.get('/auth',
    verificarToken,
    verificarTokenGeneral,
    usuarioAutenticado
)

router.post("/login", verificarTokenGeneral, asignarToken)

//Refresh Token
router.post('/refreshToken', async (req, res) => {
    try{
        //get refreshToken
        const { refreshToken } = req.body
        //send error if no refreshToken is sent
        if(!refreshToken) {
            return res.status(403).json({ error: 'Acceso denegado, Se necesita el Token' })
        } else {
            //query for the token to check if it is valid
            const tokenDoc = await Token.findOne({ token: refreshToken })
            //send error if no token found
            if(!tokenDoc){
                return res.status(401).json({ error: 'Token Expirado' })
            } else {
                // extract payload from refresh token and generate a new access token and send it
                const payload = jwt.verify(tokenDoc.token, mRefreshToken)
                const accessToken = jwt.sign({ usuario: {nombre_usuario: payload.usuario.nombre_usuario, correo_usuario: payload.usuario.correo_usuario, nivel_acceso_usuario: payload.usuario.nivel_acceso_usuario} }, mPrivateKey, { expiresIn: tokenExpiration } )
                return res.status(200).json({ accessToken })
            }
        }
    }catch (error){
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

//Cerrar Sesion
router.delete('/logout/:refreshToken', async (req, res) => {
    try{
        const refreshToken  = req.params.refreshToken
        await Token.findOneAndDelete({ token: refreshToken })
        return res.status(200).json({ success: 'User logged out!' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = router;