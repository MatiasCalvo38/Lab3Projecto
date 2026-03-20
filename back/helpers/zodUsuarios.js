// Ayuda a validar usuarios

import zod from "zod";

const usuariosSchema = zod.object(
    {
        id:zod.number(),
        nombre:zod.string().min(1),
        password:zod.string(1),
        mail:zod.string()
    }
);

export const validarUsuario = (usuario) => {
    return usuariosSchema.safeParse(usuario);
}

export const validarUsuarioParcial = (usuario) => {
    return usuariosSchema.partial().safeParse(usuario);
}