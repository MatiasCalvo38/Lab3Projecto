import { AuthContext } from './ProveedorContexto.jsx'
import { Login } from './Login.jsx'
import { useContext,useEffect,useState } from 'react'

export const ResultadoContacto = () => {

    const [usuarioAuth]=useContext(AuthContext)
    const [contactosState,setContactosState]=useState([])
    const [exito,setExito]=useState(false)
    const [error,setError]=useState(null)
    const [cargando,setCargando]=useState(true)

    useEffect(() => {
        resultados()
    }, [])

    const resultados=async()=>{
        try {
            const peticion=await fetch('http://localhost:1234/contactos',
                {
                    method:'GET',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':usuarioAuth.token
                    }
                }
            )

            const datos=await peticion.json()

            setContactosState(datos)
            setCargando(false)

            if(!peticion.ok)
            {
                setError("Error al cargar los contactos")
                setCargando(false)
                return
            }
           
        } catch (e) {
            console.log(e)
            setError("Error de conexion con el servidor")//Si hay un error, reseteamos el formulario
            setCargando(false)
        }
    }

    if(cargando){
        return <p>Cargando contactos...</p>
    }
    if(error){
        return <p style={{color:'red'}}>{error}</p>
    }




  return (
    <>
    <h2>Contactos</h2>
        <ul>
        
        {contactosState.map((contacto)=>(
            <li key={contacto._id}>{contacto.nombre} {contacto.apellido} - {contacto.email}</li>
        ))}
          
        </ul>
    
    </>
  )
}