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
    <>
        <h2>Registro</h2>
        <form onSubmit={recogerForm}>
            <label htmlFor="usuario">Usuario:</label>
            <input type="text" id='usuario' name='usuario' placeholder='Usuario'/>
            <label htmlFor="mail">Email</label>
            <input type="email" id='mail' name='mail' placeholder='Email'/>
            <label htmlFor="password">Password:</label>
            <input type="text" name='password' id='password' placeholder='Password'/>
            <input type="submit" value="Registrarse"/>
        </form>
        {error && <p style={{color:"red"}}>{error}</p>}
        <NavLink to="/Login">Ya tenes cuenta? Inicia sesion aquí</NavLink>
    </>
  )
}
