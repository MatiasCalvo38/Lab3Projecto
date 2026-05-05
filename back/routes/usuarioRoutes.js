import { Router } from "express";
import { usuarioController } from "../controllers/usuarioController.js";
import { auth } from "../middlewares/auth.js";

export const creadorUsuarios = (modelo) => { // Creador de rutas de usuario, recibe el modelo como parametro para crear el controlador y las rutas correspondientes
    const controlador = new usuarioController(modelo);

    const usuarioRouter = Router();

    //usuarioRouter.get("/",controlador.getAll);
    usuarioRouter.post('/',controlador.register);
    usuarioRouter.post('/login',controlador.login);
    usuarioRouter.put('/:id',auth,controlador.update);

    return usuarioRouter;
}