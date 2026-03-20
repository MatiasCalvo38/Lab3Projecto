import { usuarios } from "../datos/usuarios.js";

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

        listaUsuarios = [...listaUsuarios, nuevoUsuario]
        return nuevoUsuario;
    }
}