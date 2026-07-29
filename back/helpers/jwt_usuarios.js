import jwt from "jwt-simple"
import 'dotenv/config'

const caducidad = 1000 * 60 * 60; // 1 hora en milisegundos

export const crearToken = (usuario) => { // Crea un token JWT con la informacion del usuario, el token tiene una duracion de 1 hora, el token se firma con una clave secreta definida en las variables de entorno
    const payload = {
        id: usuario.id,
        nick: usuario.nombre,
        mail: usuario.mail,
        rol: usuario.rol,
        exp: Date.now()+caducidad
    }

    return jwt.encode(payload,process.env.SECRETO);
}