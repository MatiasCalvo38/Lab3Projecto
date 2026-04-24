import mongoose, { model,Schema } from "mongoose";
import {conexion} from '../helpers/conexion.js';
import bcrypt from 'bcrypt';
import { crearToken } from "../helpers/jwt_usuarios.js";

conexion();

const usuarioSchema = new Schema( // Esquema de usuario
    {
        nombre:String,
        password:String,
        mail:String,
        rol: {type: String, enum:["admin","usuario"], default:"usuario"}
    },
    {
        versionKey:false
    }
);

const Usuario = model('Usuario',usuarioSchema)

export class UsuarioModel{
    static register = async(usuario) => {
        if(!usuario.success){
            return Error();
        }

        const nuevoUsuario = {...usuario.data};

        const usuarioExiste = await Usuario.findOne({$or:[{nombre:nuevoUsuario.nombre},{mail:nuevoUsuario.mail}]});

        if(usuarioExiste){
            return "Usuario duplicado";
        }

        try {
            nuevoUsuario.password = await bcrypt.hash(nuevoUsuario.password,10);
            const usuarioGuardar = Usuario(nuevoUsuario);
            await usuarioGuardar.save();
            return nuevoUsuario;
            
        } catch (e) {
            console.log(e);
        }
    }

    static login = async(usuario) => {
        let usuarioEncontrado = usuario;

        try {
            usuarioEncontrado = await Usuario.findOne({nombre:usuarioEncontrado.nombre});

            if(!usuarioEncontrado){
                return "Usuario no existe";
            }

            const pwd = await bcrypt.compare(usuario.password,usuarioEncontrado.password);

            if(!pwd){
                return "Fallo autentificacion";
            }

            const token = crearToken(usuarioEncontrado);

            const usuarioFormateado = {
                nombre:usuarioEncontrado.nombre,
                mail:usuarioEncontrado.mail,
                token:token
            }
            return usuarioFormateado;

        } catch (e) {
            console.log(e)
        }
    }
}