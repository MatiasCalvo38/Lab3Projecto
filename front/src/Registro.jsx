import React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

export const Registro = () => {

    const [formulario,setFormulario] = useState({})
    const [exito,setExito] = useState(false)

    const recogerForm = (e) => {
        e.preventDefault()

        let usuario = {
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
                const data = await peticion.json()
                !data?setExito(false):setExito(true) // otra forma del if
        } catch (e) {
            console.log(e)
            setFormulario({}) // Si hay un error, reseteamos el formulario
        }
    }

  return (
    <>
        <form onSubmit={recogerForm}>
            <label htmlFor="usuario">Usuario:</label>
            <input type="text" id='usuario' name='usuario' placeholder='Usuario'/>
            <label htmlFor="mail">Email</label>
            <input type="email" id='mail' name='mail' placeholder='Email'/>
            <label htmlFor="password">Password:</label>
            <input type="text" name='password' id='password' placeholder='Password'/>
            <input type="submit" />
        </form>
    </>
  )
}
