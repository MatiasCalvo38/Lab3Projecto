import { createContext,useState,useEffect } from 'react'

export const AuthContext = createContext()

// Proveedor de contexto para la autenticacion, se encarga de almacenar la informacion
// del usuario autenticado y de proporcionar una funcion para actualizar esa informacion, ademas 
// de cargar la informacion del usuario desde el localStorage al iniciar la aplicacion
export const ProveedorContexto = (props) => {

    const [usuarioAuth,setUsuarioAuth] = useState(null)

    useEffect( () => {
        const usuario = localStorage.getItem('usuario')

        if(usuario){
            setUsuarioAuth(JSON.parse(usuario))
        }

    },[])
    
    // El valor del contexto es un array con la informacion del usuario autenticado y la funcion 
    // para actualizar esa informacion, esto permite que cualquier componente que consuma el contexto 
    // pueda acceder a la informacion del usuario autenticado y actualizarla si es necesario
  return (
    <AuthContext.Provider value={[usuarioAuth,setUsuarioAuth]}>
        {props.children}
    </AuthContext.Provider>
  )
}