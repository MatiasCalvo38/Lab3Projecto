import {useContext} from 'react'
import { NavLink,useNavigate } from 'react-router-dom'
import { AuthContext } from './ProveedorContexto.jsx'

export const Navbar = () => {

    const [usuarioAuth, setUsuarioAuth] = useContext(AuthContext)
    const navigate = useNavigate()

    const cerrarSesion = () => { // Elimina el usuario del localStorage y del contexto de autenticacion y redirige al login
        localStorage.removeItem("usuario")
        setUsuarioAuth(null)
        navigate("/login")
    }

  return ( // Barra de navegacion, si el usuario esta autenticado muestra su nombre y un boton para cerrar sesion, si no esta autenticado muestra los botones de registro e ingreso
    <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid px-3">
            {usuarioAuth ? (
                <div className="d-flex align-items-center gap-2">
                    <NavLink to="/usuario/editar" className="text-white fw-semibold">{usuarioAuth.nick}</NavLink>
                    <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
                        Salir
                    </button>
                </div>
            ) : (
                <>
                    <NavLink className="navbar-brand fw-bold" to="/">Agenda</NavLink>
                    <div className="d-flex gap-2">
                        <NavLink className="btn btn-outline-light btn-sm" to="/registro">Registrar</NavLink>
                        <NavLink className="btn btn-light btn-sm" to="/login">Ingresar</NavLink>
                    </div>
                </>
            )}
        </div>
    </nav>
  )
}