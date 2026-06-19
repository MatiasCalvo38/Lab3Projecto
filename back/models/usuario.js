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

        if(listaUsuarios.find(usuario => usuario.nick === nuevoUsuario.nick) || listaUsuarios.find(usuario => usuario.password === nuevoUsuario.password)){
            return "Usuario duplicado";
        }

        nuevoUsuario.password = await bcrypt.hash(nuevoUsuario.password,10);

        listaUsuarios = [...listaUsuarios, nuevoUsuario]
        return nuevoUsuario;
    }

    static login = async(usuario) => {
        let usuarioRecibido = usuario;

        let usuarioRegistrado = listaUsuarios.find(usuario => usuario.nick === usuarioRecibido.nick);

        if(!usuarioRegistrado){
            return "Usuario no encontrado";
        }

        let pwd = await bcrypt.compare(usuarioRecibido.password,usuarioRegistrado.password);

        if(!pwd){
            return "Contraseña incorrecta";
        }

        const token = crearToken(usuarioRegistrado);

        const usuarioFormateado = {
            nick:usuarioRecibido.nick,
            mail:usuarioRecibido.mail,
            token:token
        }
        return usuarioFormateado;
    }
}