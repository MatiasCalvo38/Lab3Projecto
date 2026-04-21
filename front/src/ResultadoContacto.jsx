import { AuthContext } from './ProveedorContexto.jsx'
import { useContext,useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const ResultadoContacto = () => {

    const [usuarioAuth]=useContext(AuthContext)
    const [contactosState,setContactosState]=useState([])
    const [error,setError]=useState(null)
    const [cargando,setCargando]=useState(true)
    const navigate = useNavigate()

    useEffect(() => {
    // Si no hay usuarioAuth todavía, no hacemos nada (esperamos a que el Contexto cargue)
        if (usuarioAuth && usuarioAuth.token) {
            resultados();
        }
    }, [usuarioAuth]); // Se activará cuando usuarioAuth cambie de null a tener los datos

    const resultados=async()=>{
        console.log("Iniciando petición a la API..."); // <--- Agrega esto
        try {
            const peticion=await fetch('http://localhost:1234/contactos',
                {
                    method:'GET',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${usuarioAuth.token}`
                    }
                }
            )

            /*if(!peticion.ok)
            {
                setError("Error al cargar los contactos")
                setCargando(false)
                return
            }*/

            if(!peticion.ok) {
            // Esto te dirá si es 401 (No autorizado), 404 (No encontrado), etc.
                console.log("Error status:", peticion.status); 
                const errorData = await peticion.json().catch(() => ({})); // Intenta leer el mensaje del server
                console.log("Mensaje del servidor:", errorData);

                setError(`Error ${peticion.status}: al cargar los contactos`);
                setCargando(false);
            return;
}

            const datos=await peticion.json()
            console.log(datos); // <--- Agrega esto para ver la respuesta de la API

            setContactosState(datos)
            setCargando(false)
           
        } catch (e) {
            console.error("Error capturado en el catch:", e); // <--- Cambia log por error para verlo mejor
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