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

    static update = async(id, datos) => {
        try {
            const actualizacion = {}

            if(datos.nombre){
                actualizacion.nombre = datos.nombre;
            }

            if(datos.mail){
                actualizacion.mail = datos.mail;
            }

            if(datos.password){
                actualizacion.password = await bcrypt.hash(datos.password,10);
            }

            const usuarioActualizado = await Usuario.findByIdAndUpdate(id, actualizacion, {new:true});

            if(!usuarioActualizado){
                return null;
            }

            const token = crearToken(usuarioActualizado);

            return{
                id: usuarioActualizado._id,
                nombre: usuarioActualizado.nombre,
                mail: usuarioActualizado.mail,
                rol: usuarioActualizado.rol,
                token
            }

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
                id: usuarioEncontrado._id,
                nombre: usuarioEncontrado.nombre,
                mail: usuarioEncontrado.mail,
                rol: usuarioEncontrado.rol,
                token: token
            }
            return usuarioFormateado;

        } catch (e) {
            console.log(e)
        }
    }
}