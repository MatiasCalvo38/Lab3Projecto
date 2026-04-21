import jwt from "jwt-simple";
import 'dotenv/config';

export const auth = (req,res,next) => {
    const tokenRecibido = req.headers.authorization;

    if(!tokenRecibido){
        return res.status(403).json("Error de autentificacion")
    }

    // CAMBIAMOS 'const' por 'let' para poder modificarlo abajo
    let token = tokenRecibido.replace(/['"]+/g,'');

    if (token.startsWith('Bearer ')) {
        token = token.slice(7); // Ahora esto funcionará sin errores
    }

    let payload

    try {
        payload = jwt.decode(token,process.env.SECRETO);

        if(payload.exp <= Date.now()){
            return res.status(401).json("Token expirado")
        }
    } catch (error) {
        // Es buena práctica imprimir el error en consola para debuguear el backend
        console.log("Error al decodificar:", error.message);
        return res.status(401).json("Error de autentificacion")
    }

    req.usuario = payload;
    next();
}