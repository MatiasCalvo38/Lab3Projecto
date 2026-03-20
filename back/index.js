import express from 'express';

import { Enrutador } from './routes/contactoRoutes.js';
import { Contacto } from './models/contacto.js';

import { Usuario } from './models/usuario.js';
import { creadorUsuarios } from './routes/usuarioRoutes.js';

const app = express();

app.use(express.json());

const PORT = 1234;

app.use("/",Enrutador(Contacto))

app.use("/usuarios",creadorUsuarios(Usuario))

// ---------- Puerto ----------

app.listen(PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})