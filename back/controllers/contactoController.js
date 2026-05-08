import { validarContacto, validarParcial } from "../helpers/zod.js";

export class ContactoController{ // Controlador de contactos, se encarga de manejar las peticiones relacionadas con los contactos y delegar la logica al modelo

    constructor(modelo){ // Recibe el modelo de contactos para poder interactuar con la base de datos
        this.modelo = modelo;
    }

    getAll = async(req, res) => { // Devuelve todos los contactos del usuario, si el usuario es admin devuelve todos los contactos de todos los usuarios
        const isAdmin = req.usuario.rol === 'admin';
        res.json(await this.modelo.getAll(req.usuario.id, isAdmin));
    }

    getById = async(req, res) => { // Devuelve un contacto por su id, solo si el contacto es publico o el usuario es el propietario del contacto o el usuario es admin
        const id = req.params.id;
        const contacto = await this.modelo.getOneById(id);

        if(contacto){
            res.json(contacto);
        }else{
            res.status(404).end();
        }
    }

    delete = async(req, res) => { // Elimina un contacto por su id, solo si el usuario es el propietario del contacto o el usuario es admin
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

    create = async(req, res) => { // Crea un nuevo contacto, el contacto debe ser valido segun el esquema definido en helpers/zod.js, el contacto creado sera propiedad del usuario que lo creo
        const contacto = validarContacto(req.body);

        if(contacto.error){
            res.status(400).json('Validacion Incorrecta');
        }

        const nuevoContacto = await this.modelo.create(contacto, req.usuario.id);
        res.json(nuevoContacto);
    }

    update = async(req, res) => { // Actualiza un contacto por su id, solo si el usuario es el propietario del contacto, el contacto actualizado debe ser valido segun el esquema definido en helpers/zod.js
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

    togglePublico = async(req, res) => { // Cambia el estado de publico de un contacto por su id, solo si el usuario es el propietario del contacto, el contacto debe existir
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

    toggleVisible = async(req, res) => { // Cambia el estado de visible de un contacto por su id, solo si el usuario es admin, el contacto debe existir, solo se pueden ocultar contactos publicos
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