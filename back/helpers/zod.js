// Ayuda a validar al crear un contacto

import zod from "zod";

const contactosSchema = zod.object(
    {
        id:zod.number(),
        nombre:zod.string(),
        apellido:zod.string(),
        email:zod.string(),
        empresa:zod.string(),
        domicilio:zod.string().optional(),
        telefono:zod.string().optional()
    }
);

export const validarContacto = (contacto)=>{
    return contactosSchema.safeParse(contacto);
}

export const validarParcial = (contacto)=>{
    return contactosSchema.partial().safeParse(contacto);
}