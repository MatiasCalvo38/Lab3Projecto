import React from 'react'
import { useState } from 'react'
import { NavLink,useNavigate } from 'react-router-dom'

export const Registro = () => {

    const [formulario,setFormulario] = useState({})
    const [exito,setExito] = useState(false)
    const [error,setError] = useState(null)
    const navigate = useNavigate()

    const recogerForm = (e) => {
        e.preventDefault()

        const usuario = {
            nombre:e.target.usuario.value,
            mail:e.target.mail.value,
            password:e.target.password.value
        }

        setFormulario(usuario)
        guardarUsuario(usuario)
    }

    const guardarUsuario = async(usuario) => {
        try {
            const peticion = await fetch('http://localhost:1234/usuarios',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            })

            if(!peticion.ok){
                setError("Error al registrar usuario")
                return
            }

            navigate("/login")

                const data = await peticion.json()
                !data?setExito(false):setExito(true) // otra forma del if

        } catch (e) {
            console.log(e)
            setFormulario("Error de conexion con el servidor") // Si hay un error, reseteamos el formulario
        }
    }

  return (
    <div className="py-5 d-flex justify-content-center">
            <div className="card shadow" style={{ width: '400px' }}>
                <div className="card-body p-4">
                    <h2 className="card-title text-center mb-4">Registro</h2>
                    <form onSubmit={recogerForm}>
                        <div className="mb-3">
                            <label htmlFor="usuario" className="form-label">Usuario</label>
                            <input type="text" className="form-control" id="usuario" name="usuario" placeholder="Usuario" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="mail" className="form-label">Email</label>
                            <input type="email" className="form-control" name="mail" id="mail" placeholder="E-mail" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input type="password" className="form-control" name="password" id="password" placeholder="Contraseña" />
                        </div>
                        {error && <div className="alert alert-danger py-2">{error}</div>}
                        <button type="submit" className="btn btn-primary w-100">Registrarse</button>
                    </form>
                    <p className="text-center mt-3 mb-0">
                        <NavLink to="/login">¿Ya tenés cuenta? Iniciá sesión</NavLink>
                    </p>
                </div>
            </div>
        </div>
  )
}