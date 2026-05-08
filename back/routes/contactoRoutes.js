import { Router } from "express"; //
import { ContactoController } from "../controllers/contactoController.js"; // Importamos

export const contactoRouter = Router(); // Importamos router

export const Enrutador = (modelo) => { // Variable enrutador para mandar el modelo que se creo con el constructor

    const controlador = new ContactoController(modelo); // Creamos el controlador de contactos, le pasamos el modelo para que pueda interactuar con la base de datos

    contactoRouter.get('/', controlador.getAll);
    contactoRouter.get('/:id', controlador.getById);
    contactoRouter.delete('/:id',controlador.delete);
    contactoRouter.post('/', controlador.create);
    contactoRouter.put('/:id', controlador.update);
    contactoRouter.patch('/:id/publico', controlador.togglePublico);
    contactoRouter.patch('/:id/visible', controlador.toggleVisible);

    return contactoRouter;
}