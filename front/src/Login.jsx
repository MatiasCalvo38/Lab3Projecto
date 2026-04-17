import React, { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "./ProveedorContexto.jsx";

export const Login = () => {
  const [formulario, setFormulario] = useState({});
  const [exito, setExito] = useState(false);
  const [usuarioAuth, setUsuarioAuth] = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const recogerForm = (e) => {
    e.preventDefault();

    const usuario = {
      nick: e.target.usuario.value,
      password: e.target.password.value,
    };
    setFormulario(usuario);
    buscar(usuario);
  };

  const buscar = async (usuario) => {
    try {
      const peticion = await fetch("http://localhost:1234/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });
      

      if(!peticion.ok){
        setError("Usuario o contraseña incorrectos");
        return;
      }

      const data=await peticion.json();
      localStorage.setItem("usuario", JSON.stringify(data));
        setUsuarioAuth(data);
        navigate("/contactos");


    } catch (e) {
      console.log(e);
      setFormulario("Error de conexion con el servidor"); //Si hay un error, reseteamos el formulario
    }
  };

  return (
    <>
       <h2>Iniciar Sesion</h2>
      <form onSubmit={recogerForm}>
        <label htmlFor="usuario">Usuario:</label>
        <input type="text" id="usuario" name="usuario" placeholder="Usuario" />
        <label htmlFor="password">Password:</label>
        <input
          type="text"
          name="password"
          id="password"
          placeholder="Password"
        />
        <input type="submit" value="Ingresar"/>
      </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <NavLink to="/registro">No tenes cuenta? Registrate aquí</NavLink>
    </>
  );
};