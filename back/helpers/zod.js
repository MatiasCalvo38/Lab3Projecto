// Ayuda a validar al crear un contacto

import zod from "zod";

const contactosSchema = zod.object( // Esquema de contacto
    {
        //id: zod.number().optional(),
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

export const validarContacto = (contacto)=>{ // Valida un contacto segun el esquema definido, devuelve un objeto con la propiedad error si la validacion falla, o la propiedad data con el contacto validado si la validacion es exitosa
    return contactosSchema.safeParse(contacto);
}

export const validarParcial = (contacto)=>{ // Valida un contacto segun el esquema definido, pero permite que falten propiedades, devuelve un objeto con la propiedad error si la validacion falla, o la propiedad data con el contacto validado si la validacion es exitosa
    return contactosSchema.partial().safeParse(contacto);
}