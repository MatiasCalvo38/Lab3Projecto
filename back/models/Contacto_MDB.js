import mongoose, {model, Schema} from "mongoose";
import { conexion } from "../helpers/conexion.js";

conexion(); // Conecta a la base de datos

const ContactoSchema = new Schema( // Esquema de contacto
    {
        nombre: String,
        apellido: String,
        email: String,
        empresa: String,
        domicilio: String,
        telefonos: [String],
        propietario: {type: Schema.Types.ObjectId, ref: "Usuario"},
        esPublico: {type: Boolean, default: false},
        esVisible: {type: Boolean, default: true},
        password: String
    },
    {
        versionKey: false,
    },
);

const Contacto = model("Contacto", ContactoSchema); // Modelo de contacto, se encarga de interactuar con la base de datos, tiene metodos estaticos para realizar las operaciones CRUD sobre los contactos, cada metodo recibe los parametros necesarios para realizar la operacion y devuelve el resultado de la operacion o un error si la operacion falla

export class ContactoModel { // Modelo de contacto, se encarga de interactuar con la base de datos, tiene metodos estaticos para realizar las operaciones CRUD sobre los contactos, cada metodo recibe los parametros necesarios para realizar la operacion y devuelve el resultado de la operacion o un error si la operacion falla
    static async getAll(userId, isAdmin){ // Devuelve todos los contactos del usuario, si el usuario es admin devuelve todos los contactos de todos los usuarios, si el usuario no es admin devuelve solo los contactos que son publicos o que son propiedad del usuario, cada contacto devuelto debe ser visible
        try {
            if(isAdmin){
                return await Contacto.find({});
            }
            return await Contacto.find({
                $or: [
                    { propietario: userId },
                    { esPublico: true, esVisible: true }
                ]
            });
        } catch (e) {
            console.log(e);
        }
    }

    static async getOneById(id){ // Devuelve un contacto por su id, solo si el contacto es publico o el usuario es el propietario del contacto o el usuario es admin, el contacto devuelto debe ser visible
        try {
            return await Contacto.findById(id);
        } catch (e) {
            console.log(e);
        }
    }

    static async delete(id){ // Elimina un contacto por su id, solo si el usuario es el propietario del contacto o el usuario es admin12121212
        try {
            return await Contacto.deleteOne({_id:id});
        } catch (e) {
            console.log(e);
        }
    }

    static async create(contacto, propietarioId){ // Crea un nuevo contacto, el contacto debe ser valido segun el esquema definido en helpers/zod.js, el contacto creado sera propiedad del usuario que lo creo
        if(!contacto.success){
            return Error
        }

        const nuevoContacto = {...contacto.data, propietario: propietarioId};

        const contactoGuardar = new Contacto(nuevoContacto);

        try {
            await contactoGuardar.save();
            return contactoGuardar;
            
        } catch (e) {
            console.log(e);
        }
    }

    static async toggleVisible(id){ // Cambia el estado de visible de un contacto por su id, solo si el usuario es el propietario del contacto, el contacto actualizado debe ser valido segun el esquema definido en helpers/zod.js
        try {
            const contacto = await Contacto.findById(id);
            if(!contacto){
                return null;
            }

            return await Contacto.findOneAndUpdate(
                id,
                {esVisible: !contacto.esVisible},
                {new: true}
            )
        } catch (e) {
            console.log(e);
        }
    }

    static async togglePublico(id){ // Cambia el estado de publico de un contacto por su id, solo si el usuario es el propietario del contacto, el contacto debe existir
        try {
            const contacto = await Contacto.findById(id);
            if(!contacto){
                return null;
            }
            
            return await Contacto.findOneAndUpdate(
                id,
                {esPublico: !contacto.esPublico},
                {new:true}
            );

        } catch (e) {
            console.log(e);
        }
    }

    static async update(id, validacion){ // Actualiza un contacto por su id, solo si el usuario es el propietario del contacto, el contacto actualizado debe ser valido segun el esquema definido en helpers/zod.js
        if(!validacion.success){
            res.status(400).json("Error en la validacion");
        }

        try {
            return await Contacto.findOneAndUpdate({_id:id},{...validacion.data},{new:true});
            
        } catch (e){
            console.log(e);
        }
    }
}