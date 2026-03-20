import { usuarios } from "../datos/usuarios.js";
import bcrypt from "bcrypt";
import { crearToken } from "../helpers/jwt_usuarios.js";

let listaUsuarios = usuarios;

export class Usuario{

    static getAll(){
        return listaUsuarios;
    }

    static register = async(usuario) => {
        if(!usuario.success){
            return Error();
        }

        const nuevoUsuario = {
            ...usuario.data,
        }

        if(listaUsuarios.find(usuario => usuario.nombre === nuevoUsuario.nombre) || listaUsuarios.find(usuario => usuario.password === nuevoUsuario.password)){
            return "Usuario duplicado";
        }

        nuevoUsuario.password = await bcrypt.hash(nuevoUsuario.password,10);

        listaUsuarios = [...listaUsuarios, nuevoUsuario]
        return nuevoUsuario;
    }

    static login = async(usuario) => {
        let usuarioRecibido = usuario;

        let usuarioRegistrado = listaUsuarios.find(usuario => usuario.nombre === usuarioRecibido.nombre);

        if(!usuarioRegistrado){
            return "Usuario no encontrado";
        }

        let pwd = await bcrypt.compare(usuarioRecibido.password,usuarioRegistrado.password);

        if(!pwd){
            return "Contraseña incorrecta";
        }

        const token = crearToken(usuarioRegistrado);

        const usuarioFormateado = {
            nombre:usuarioRecibido.nombre,
            mail:usuarioRecibido.mail,
            token:token
        }
        return usuarioFormateado;
    }
}