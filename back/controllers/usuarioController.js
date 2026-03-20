import { validarUsuario } from "../helpers/zodUsuarios.js";

export class usuarioController{
    constructor(modelo){
        this.modelo = modelo;
    }

    getAll = async(req, res) => {
        res.json(await this.modelo.getAll());
    }

    register = async(req,res) => {
        const usuario = validarUsuario(req.body);

        const nuevoUsuario = await this.modelo.register(usuario);

        if(nuevoUsuario == Error){
            res.status(400).json('Validacion incorrecta')
        }

        res.json(nuevoUsuario);
    }
}