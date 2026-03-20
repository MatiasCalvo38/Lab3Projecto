import { Router } from "express";
import { usuarioController } from "../controllers/usuarioController.js";

export const creadorUsuarios = (modelo) => {
    const controlador = new usuarioController(modelo);

    const usuarioRouter = Router();

    //usuarioRouter.get("/",controlador.getAll);
    usuarioRouter.post("/",controlador.register);
    usuarioRouter.post('/login',controlador.login);

    return usuarioRouter;
}