import jwt from "jwt-simple";
import 'dotenv/config';

export const auth = (req,res,next) => {
    const tokenRecibido = req.headers.authorization;

    if(!tokenRecibido){
        return res.status(403).json("Error de autentificacion")
    }

    const token = tokenRecibido.replace(/['"]+/g,'');

    let payload

    try {
        payload = jwt.decode(token,process.env.SECRETO);

        if(payload.exp <= Date.now()){
            return res.status(404).json("Token expirado")
        }
    } catch (error) {
        return res.status(404).json("Error de autentificacion")
    }

    req.usuario = payload;
    next();
}