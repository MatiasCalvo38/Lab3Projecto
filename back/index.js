import express from 'express';

import { Enrutador } from './routes/contactoRoutes.js';

import { ContactoModel } from "./models/Contacto_MDB.js"
import { UsuarioModel } from './models/Usuario_MDB.js';

import cors from "cors"
//import { Contacto } from './models/contacto.js';
//import { Usuario } from './models/usuario.js';

import { creadorUsuarios } from './routes/usuarioRoutes.js';

import { auth } from './middlewares/auth.js';

const app = express(); // Crear una instancia de Express

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(cors()); // Middleware para permitir solicitudes desde cualquier origen (CORS)

const PORT = 1234; // Puerto en el que el servidor escuchará las solicitudes

app.use("/contactos", auth, Enrutador(ContactoModel)); // Middleware para manejar las rutas de contactos, aplicando autenticación a todas las rutas de contactos
app.use("/usuarios", creadorUsuarios(UsuarioModel)); // Middleware para manejar las rutas de usuarios, sin autenticación requerida para estas rutas

// ---------- Puerto ----------

app.listen(PORT,()=>{ // Inicia el servidor y escucha en el puerto especificado, mostrando un mensaje en la consola cuando el servidor está listo para recibir solicitudes
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})