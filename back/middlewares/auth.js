import jwt from "jwt-simple";
import 'dotenv/config';

// Middleware de autenticacion, se encarga de verificar que
// el token JWT enviado en la cabecera de autorizacion sea valido, si el token es valido se agrega 
// la informacion del usuario al objeto req y se llama a next() para continuar con la ejecucion de 
// la ruta, si el token no es valido se devuelve un error 401 o 403 segun corresponda
export const auth = (req, res, next) => { 

    const tokenRecibido = req.headers.authorization;

    if (!tokenRecibido){
        return res.status(403).json("Error de autentificacion")
    }

    let token = tokenRecibido.replace(/['"]+/g,'');

    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    let payload

    try {
        payload = jwt.decode(token,process.env.SECRETO);

        if(payload.exp <= Date.now()){
            return res.status(401).json("Token expirado")
        }
    } catch (error) {
        console.log("Error al decodificar:", error.message);
        return res.status(401).json("Error de autentificacion")
    }

    req.usuario = payload;
    next();
}