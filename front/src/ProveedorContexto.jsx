import { React,createContext,useState,useEffect } from 'react'

export const AuthContext = createContext()

export const ProveedorContexto = (props) => {

    const [usuarioAuth,setUsuarioAuth] = useState(null)

    useEffect(async () => {
        const usuario = localStorage.getItem('usuario')

        if(!usuario){
            return false
        }

        setUsuarioAuth(JSON.parse(usuario))
    },[])
    
  return (
    <AuthContext.Provider value={[usuarioAuth,setUsuarioAuth]}>
        {props.children}
    </AuthContext.Provider>
  )
}
