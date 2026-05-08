import { Router } from "express";
import { usuarioController } from "../controllers/usuarioController.js";
import { auth } from "../middlewares/auth.js";

export const creadorUsuarios = (modelo) => { // Creador de rutas de usuario, recibe el modelo como parametro para crear el controlador y las rutas correspondientes
    const controlador = new usuarioController(modelo); // Creamos el controlador de usuarios, le pasamos el modelo para que pueda interactuar con la base de datos

    const usuarioRouter = Router(); // Creamos el router de usuarios, es el encargado de manejar las rutas relacionadas con los usuarios, cada ruta llama a un metodo del controlador correspondiente a la accion que se quiere realizar, algunas rutas requieren autenticacion y autorizacion para poder acceder a ellas

    usuarioRouter.post('/',controlador.register);
    usuarioRouter.post('/login',controlador.login);
    usuarioRouter.put('/:id',auth,controlador.update);

    return usuarioRouter;
}