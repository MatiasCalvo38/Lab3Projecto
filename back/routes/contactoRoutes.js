import { Router } from "express";
import { ContactoController } from "../controllers/contactoController.js";

export const contactoRouter = Router();

contactoRouter.get('/',ContactoController.getAll);
contactoRouter.get('/:id',ContactoController.getById);
contactoRouter.delete('/:id',ContactoController.delete);
contactoRouter.post('/',ContactoController.create);
contactoRouter.put('/:id',ContactoController.update);