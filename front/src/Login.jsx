import React, { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "./ProveedorContexto.jsx";

export const Login = () => {
  const [formulario, setFormulario] = useState({});
  const [exito, setExito] = useState(false);
  const [usuarioAuth, setUsuarioAuth] = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const recogerForm = (e) => { // Recoge los datos del formulario y los guarda en el estado formulario, luego llama a la funcion buscar para enviar los datos al servidor
    e.preventDefault();

    const usuario = {
      nick: e.target.usuario.value,
      password: e.target.password.value,
    };
    setFormulario(usuario);
    buscar(usuario);
  };

  const buscar = async (usuario) => { // Envia los datos del formulario al servidor para verificar si el usuario existe y la contraseña es correcta, si es correcto guarda el usuario en el localStorage y en el contexto de autenticacion y redirige a la pagina de contactos, si no es correcto muestra un mensaje de error
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

  return ( // Formulario de login, si el usuario esta autenticado redirige a la pagina de contactos, si no esta autenticado muestra el formulario de login
    <div className="py-5 d-flex justify-content-center">
      <div className="card shadow" style={{ width: '400px' }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4">Iniciar sesión</h2>
          <form onSubmit={recogerForm}>
            <div className="mb-3">
              <label htmlFor="usuario" className="form-label">Usuario</label>
              <input type="text" className="form-control" id="usuario" name="usuario" placeholder="Usuario" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input type="password" className="form-control" name="password" id="password" placeholder="Contraseña" />
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">Ingresar</button>
          </form>
          <p className="text-center mt-3 mb-0">
            <NavLink to="/registro">¿No tenés cuenta? Registrate</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};