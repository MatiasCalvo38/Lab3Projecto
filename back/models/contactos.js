import { contactos } from "../datos/contactos.js";

let listaContactos = contactos;

export class Contacto{
    static getAll(){
        return listaContactos;
    }

    static getById(id){
        return listaContactos.find(c => c.id === id);
    }

    static delete(id){
        return listaContactos.filter(c => c.id !== id);
    }

    static create(contacto){
        if(!contacto.success){
            return Error();
        }
        const nuevoContacto = {
            ...contacto.data,
        };
        listaContactos = [...listaContactos,nuevoContacto];
        return nuevoContacto;
    }

    static update(id,contacto){
        if(!contacto.success){
            res.status(400).json('Validacion incorrecta');
        }

        const contactoIndex = listaContactos.findIndex(c => c.id === id);

        if(contactoIndex === -1){
            return res.status(404).json('Contacto no encontrado');
        }

        const nuevoContacto = {
            ...listaContactos[contactoIndex],
            ...contacto.data
        };

        listaContactos[contactoIndex] = nuevoContacto;
        return nuevoContacto;
    }
}