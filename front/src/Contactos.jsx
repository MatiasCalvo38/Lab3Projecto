import React, { useContext } from 'react'
import { AuthContext } from './ProveedorContexto.jsx'
import { Login } from './Login.jsx'
import { ResultadoContacto } from './ResultadoContacto.jsx'

export const Contactos = () => { // Componente de contactos, se encarga de mostrar el resultado de la busqueda de contactos, si el usuario no esta autenticado muestra el componente de login, si el usuario esta autenticado muestra el componente de resultado de contactos, para saber si el usuario esta autenticado o no se utiliza el contexto de autenticacion, si el usuario esta autenticado se muestra el componente de resultado de contactos, si el usuario no esta autenticado se muestra el componente de login

    const [usuarioAuth,setUsuarioAuth] = useContext(AuthContext) // Obtenemos el usuario autenticado del contexto de autenticacion, si el usuario esta autenticado se muestra el componente de resultado de contactos, si el usuario no esta autenticado se muestra el componente de login

  return ( // Renderizamos el componente de login si el usuario no esta autenticado, si el usuario esta autenticado renderizamos el componente de resultado de contactos
    <>
        {usuarioAuth == null ? <Login /> : <ResultadoContacto />}
    </>
  )
}