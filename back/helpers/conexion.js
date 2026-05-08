import mongoose from "mongoose";

export const conexion = async () => { // Se encarga de conectar a la base de datos, en este caso a una base de datos local llamada dbFS1, si la conexion es exitosa se muestra un mensaje en consola, si hay un error se muestra el error en consola
    try {
        await mongoose.connect("mongodb://localhost:27017/dbFS1");
        console.log("Conectado a la base de datos");
    } catch (error){
        console.log(error);
    }
}