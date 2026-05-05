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

    update = async(req,res) => {
        const { id } = req.params;
        const datos = req.body;

        const usuarioActualizado = await this.modelo.update(id, datos);

        if(!usuarioActualizado){
            res.status(404).json("Usuario no encontrado");
        }
        
        res.json(usuarioActualizado);
    }

    login = async(req,res) => {
        const datosAuth = req.body

        const usuario = await this.modelo.login(datosAuth);

        if(usuario && typeof usuario === 'object'){
            res.json(usuario);
        }else{
            res.status(401).json({ error: usuario || "Error de autentificacion" });
        }
    }
}