import { validarContacto, validarParcial } from "../helpers/zod.js";

export class ContactoController{

    constructor(modelo){
        this.modelo = modelo;
    }

    getAll = async(req, res) => {
        res.json(await this.modelo.getAll());
    }

    getById = async(req, res) => {
        const id = req.params.id;
        const contacto = await this.modelo.getOneById(id);

        if(contacto){
            res.json(contacto);
        }else{
            res.status(400).end();
        }
    }

    delete = async(req, res) => {
        const id = req.params.id;
        const listaContactos = await this.modelo.delete(id);

        if(listaContactos){
            res.json(listaContactos);
        }else{
            res.status(400).end();
        }
    }

    create = async(req, res) => {
        const contacto = validarContacto(req.body);

        if(contacto.error){
            res.status(400).json('Validacion Incorrecta');
        }

        const nuevoContacto = await this.modelo.create(contacto);
        res.json(nuevoContacto);
    }

    update = async(req, res) => {
        const id = req.params.id;
        const contactoValido = validarParcial(req.body);

        const nuevoContacto = await this.modelo.update(id,contactoValido);
        res.json(nuevoContacto);
    }
}