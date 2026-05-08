import { validarUsuario } from "../helpers/zodUsuarios.js";

export class usuarioController{ // Controlador de usuarios, se encarga de manejar las peticiones relacionadas con los usuarios y delegar la logica al modelo
    constructor(modelo){
        this.modelo = modelo;
    }

    getAll = async(req, res) => { // Devuelve todos los usuarios
        res.json(await this.modelo.getAll());
    }

    register = async(req,res) => { // Registra un nuevo usuario, el usuario debe ser valido segun el esquema definido en helpers/zod.js, el usuario registrado no puede tener el mismo email que otro usuario registrado
        const usuario = validarUsuario(req.body);

        const nuevoUsuario = await this.modelo.register(usuario);

        if(nuevoUsuario == Error){
            res.status(400).json('Error de validacion');
        }

        res.json(nuevoUsuario);
    }

    update = async(req,res) => { // Actualiza un usuario por su id, solo si el usuario es el propietario o el usuario es admin
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

        if(usuario){
            res.json(usuario);
            
        }else{
            res.status(401).end();
        }
    }
}