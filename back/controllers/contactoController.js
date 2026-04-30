import { validarContacto, validarParcial } from "../helpers/zod.js";

export class ContactoController{

    constructor(modelo){
        this.modelo = modelo;
    }

    getAll = async(req, res) => {
        const isAdmin = req.usuario.rol === 'admin';
        res.json(await this.modelo.getAll(req.usuario.id, isAdmin));
    }

    getById = async(req, res) => {
        const id = req.params.id;
        const contacto = await this.modelo.getOneById(id);

        if(contacto){
            res.json(contacto);
        }else{
            res.status(404).end();
        }
    }

    delete = async(req, res) => {
        const id = req.params.id;
        const contacto = await this.modelo.getOneById(id);

        if(!contacto){
            return res.status(404).end();
        }

        if(!contacto.propietario || contacto.propietario.toString() !== req.usuario.id){
            return res.status(403).json('Sin permiso')
        }

        await this.modelo.delete(id);
        res.json({ok:true});
    }

    create = async(req, res) => {
        const contacto = validarContacto(req.body);

        if(!contacto.success){
            res.status(400).json('Validacion Incorrecta');
        }

        const nuevoContacto = await this.modelo.create(contacto, req.usuario.id);
        res.json(nuevoContacto);
    }

    update = async(req, res) => {
        const id = req.params.id;
        const contacto = await this.modelo.getOneById(id);
        if(!contacto){
            return res.status(404).end()
        }

        if(!contacto.propietario || contacto.propietario.toString() !== req.usuario.id){
            return res.status(403).json('Sin permiso')
        }
        
        const contactoValido = validarParcial(req.body);
        const actualizado = await this.modelo.update(id,contactoValido);

        res.json(actualizado);
    }

    togglePublico = async(req, res) => {
        const id = req.params.id;
        const contacto = await this.modelo.getOneById(id);

        if(!contacto){
            return res.status(404).end()
        }

        if(!contacto.propietario || contacto.propietario.toString() !== req.usuario.id){
            return res.status(403).json('Sin permiso')
        }

        const actualizado = await this.modelo.togglePublico(id);
        
        res.json(actualizado);
    }

    toggleVisible = async(req, res) => {
        if(req.usuario.rol !== 'admin'){
            return res.status(403).json('Solo el administrador puede realizar esta accion')
        }

        const id = req.params.id;
        const contacto = await this.modelo.getOneById(id);

        if(!contacto){
            return res.status(404).end()
        }

        if(!contacto.esPublico){
            return res.status(400).json('Solo se pueden ocultar contactos publicos')
        }

        const actualizado = await this.modelo.toggleVisible(id);
        
        res.json(actualizado);
    }
}