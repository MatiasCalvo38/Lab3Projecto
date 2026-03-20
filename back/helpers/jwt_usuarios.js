import jwt from "jwt-simple"
import 'dotenv/config'

const caducidad = 1000*60;

export const crearToken = (usuario) => {
    const payload = {
        id:usuario.id,
        nombre:usuario.nombre,
        mail:usuario.mail,
        exp:Date.now()+caducidad
    }

    return jwt.encode(payload,process.env.SECRETO);
}