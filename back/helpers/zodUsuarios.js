// Ayuda a validar usuarios

import zod from "zod";

const usuariosSchema = zod.object( // Esquema de usuario
    {
        //id:zod.number().min(1),
        nombre:zod.string().min(1),
        password:zod.string(1).min(1),
        mail:zod.string().min(1),
        rol: zod.enum(["admin","usuario"]).optional()
    }
);

export const validarUsuario = (usuario) => { // Valida un usuario segun el esquema definido, devuelve un objeto con la propiedad error si la validacion falla, o la propiedad data con el usuario validado si la validacion es exitosa
    return usuariosSchema.safeParse(usuario);
}

export const validarUsuarioParcial = (usuario) => { // Valida un usuario segun el esquema definido, pero permite que falten propiedades, devuelve un objeto con la propiedad error si la validacion falla, o la propiedad data con el usuario validado si la validacion es exitosa
    return usuariosSchema.partial().safeParse(usuario);
}