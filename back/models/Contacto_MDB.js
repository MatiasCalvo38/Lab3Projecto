import mongoose, {model, Schema} from "mongoose";
import { conexion } from "../helpers/conexion.js";

conexion();

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

const Contacto = model("Contacto", ContactoSchema);

export class ContactoModel {
    static async getAll(){
        try {
            return Contacto.find();
        } catch (e) {
            console.log(e);
        }
    }

    static async getOneById(id){
        try {
            return await Contacto.findById(id);
        } catch (e) {
            console.log(e);
        }
    }

    static async delete(id){
        try {
            return await Contacto.deleteOne({_id:id})
        } catch (e) {
            console.log(e);
        }
    }

    static async create(contacto){
        if(!contacto.success){
            return Error
        }

        const nuevoContacto = {...contacto.data};

        const contactoGuardar = new Contacto(nuevoContacto);

        try {
            await contactoGuardar.save();
            return nuevoContacto;
            //return contactoGuardar.toObject();
        } catch (e) {
            console.log(e);
        }
    }

    static async update(id, validacion){
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