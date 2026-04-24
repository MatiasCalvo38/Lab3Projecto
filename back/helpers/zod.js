// Ayuda a validar al crear un contacto

import zod from "zod";

const contactosSchema = zod.object( // Esquema de contacto
    {
        id: zod.number(),
        nombre: zod.string(),
        apellido: zod.string(),
        email: zod.string(),
        empresa: zod.string().optional(),
        domicilio: zod.string().optional(),
        telefonos: zod.array(zod.string()).optional(),
        propietario: zod.string().optional(),
        esPublico: zod.boolean().optional(),
        esVisible: zod.boolean().optional(),
        password: zod.string().optional()
    }
);

export const validarContacto = (contacto)=>{
    return contactosSchema.safeParse(contacto);
}

export const validarParcial = (contacto)=>{
    return contactosSchema.partial().safeParse(contacto);
}