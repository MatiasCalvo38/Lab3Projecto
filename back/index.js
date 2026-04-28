import express from 'express';

import { Enrutador } from './routes/contactoRoutes.js';

import { ContactoModel } from "./models/Contacto_MDB.js"
import { UsuarioModel } from './models/Usuario_MDB.js';

import cors from "cors"
//import { Contacto } from './models/contacto.js';
//import { Usuario } from './models/usuario.js';

import { creadorUsuarios } from './routes/usuarioRoutes.js';

import { auth } from './middlewares/auth.js';

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 1234;

app.use("/contactos", auth, Enrutador(ContactoModel));
app.use("/usuarios", creadorUsuarios(UsuarioModel));

// ---------- Puerto ----------

app.listen(PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})