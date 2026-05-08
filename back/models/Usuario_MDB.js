import mongoose, { model,Schema } from "mongoose";
import {conexion} from '../helpers/conexion.js';
import bcrypt from 'bcrypt';
import { crearToken } from "../helpers/jwt_usuarios.js";

conexion(); // Conecta a la base de datos

const usuarioSchema = new Schema( // Esquema de usuario
    {
        nombre: String,
        password: String,
        mail: String,
        rol: {type: String, enum:["admin","usuario"], default:"usuario"}
    },
    {
        versionKey:false
    }
);

const Usuario = model('Usuario',usuarioSchema) // Modelo de usuario, se encarga de interactuar con la base de datos, tiene metodos estaticos para realizar las operaciones CRUD sobre los usuarios, cada metodo recibe los parametros necesarios para realizar la operacion y devuelve el resultado de la operacion o un error si la operacion falla

export class UsuarioModel{ // Modelo de usuario, se encarga de interactuar con la base de datos, tiene metodos estaticos para realizar las operaciones CRUD sobre los usuarios, cada metodo recibe los parametros necesarios para realizar la operacion y devuelve el resultado de la operacion o un error si la operacion falla
    static register = async(usuario) => { // Registra un nuevo usuario, el usuario debe ser valido segun el esquema definido en helpers/zod.js, el usuario registrado no puede tener el mismo email que otro usuario registrado
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

    static update = async(id, datos) => { // Actualiza un usuario por su id, solo si el usuario es el propietario o el usuario es admin
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

    static login = async(usuario) => { // Autentica a un usuario, el usuario debe ser valido segun el esquema definido en helpers/zod.js, si la autenticacion es exitosa se devuelve un objeto con la informacion del usuario y un token JWT, si la autenticacion falla se devuelve un error
        let usuarioEncontrado = usuario;

        try {
            usuarioEncontrado = await Usuario.findOne({nombre: usuarioEncontrado.nombre});

            if(!usuarioEncontrado){
                return "Usuario no existe";
            }

            const pwd = await bcrypt.compare(usuario.password, usuarioEncontrado.password);

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