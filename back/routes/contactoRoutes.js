import { Router } from "express"; //
import { ContactoController } from "../controllers/contactoController.js"; // Importamos

export const contactoRouter = Router(); // Importamos router

export const Enrutador = (modelo) => { // Variable enrutador para mandar el modelo que se creo con el constructor

    const controlador = new ContactoController(modelo);

    contactoRouter.get('/',controlador.getAll);
    contactoRouter.get('/:id',controlador.getById);
    contactoRouter.delete('/:id',controlador.delete);
    contactoRouter.post('/',controlador.create);
    contactoRouter.put('/:id',controlador.update);

    return contactoRouter;
}