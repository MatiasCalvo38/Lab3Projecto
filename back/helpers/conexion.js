import mongoose from "mongoose";

export const conexion = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/dbFS1");
        console.log("Conectado a la base de datos");
    } catch (error){
        console.log(error);
    }
}