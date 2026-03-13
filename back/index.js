import express from 'express';
import { contactoRouter } from './routes/contactoRoutes.js';
import { usuarios } from './datos/usuarios.js';
import { validarUsuario, validarUsuarioParcial } from './helpers/zodUsuarios.js';

const app = express();

app.use(express.json());

const PORT = 1234;

app.use("/",contactoRouter)

let listaUsuarios = usuarios

// ---------- Usuarios ----------

app.get('/usuarios',(req, res)=>{ //Endpoint GET
    res.json(listaUsuarios);
});

app.get('/usuarios/:id',(req,res)=>{ //Endpoint GET ID
    const id = parseInt(req.params.id);
    const usuario = listaUsuarios.find(u=>u.id === id)
    if(usuario){
        res.json(usuario);
    }else{
        res.status(404).json({error:'Usuario no encontrado'});
    }
});

app.delete('/usuarios/:id',(req,res)=>{ //Endpoint DELETE
    const id = Number(req.params.id)
    listaUsuarios = listaUsuarios.filter(u=>u.id !== id);
    if(listaUsuarios){
        res.json(listaUsuarios);
    }else{
        res.status(404).end();
    }
});

app.post('/usuarios',(req,res)=>{ // Endpoint POST
    const usuario = validarUsuario(req.body);

    if(usuario.error){
        return res.status(400).json('Validacion incorrecta')
    }

    const nuevoUsuario = {
        ...usuario.data,
    };

    listaUsuarios = [...listaUsuarios,nuevoUsuario];
    res.json(nuevoUsuario);
});

app.put('/usuarios/:id',(req,res) =>{ // Endpoint UPDATE
    const id = Number(req.params.id);
    const usuarioValido = validarUsuarioParcial(req.body);

    if(usuarioValido.error){
        return res.status(400).json('Validacion incorrecta');
    }

    const usuarioIndex = listaUsuarios.findIndex(u=>u.id === id);

    if(usuarioIndex === -1){
        return res.status(404).json('Usuario no encontrado');
    }

    const nuevoUsuario = {
        ...listaUsuarios[usuarioIndex],
        ...usuarioValido.data
    };
    listaUsuarios[usuarioIndex] = nuevoUsuario;
    res.json(nuevoUsuario);
});

// ---------- Puerto ----------

app.listen(PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})