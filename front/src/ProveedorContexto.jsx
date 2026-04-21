import { createContext,useState,useEffect } from 'react'

export const AuthContext = createContext()

export const ProveedorContexto = (props) => {

    const [usuarioAuth,setUsuarioAuth] = useState(null)

    useEffect( () => {
        const usuario = localStorage.getItem('usuario')

        if(usuario){
            setUsuarioAuth(JSON.parse(usuario))
        }

    },[])
    
  return (
    <AuthContext.Provider value={[usuarioAuth,setUsuarioAuth]}>
        {props.children}
    </AuthContext.Provider>
  )
}