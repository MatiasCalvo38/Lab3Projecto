import { AuthContext } from './ProveedorContexto.jsx'
import { useContext,useEffect,useState } from 'react'

export const ResultadoContacto = () => {

    const [usuarioAuth, setUsuarioAuth] = useContext(AuthContext)
    const [contactosState,setContactosState] = useState([])
    const [exito,setExito] = useState(false)
    const [error,setError]=useState(null)
    const [cargando,setCargando]=useState(true)

    useEffect(() => { // Si no hay usuarioAuth todavía, no hacemos nada (esperamos a que el Contexto cargue)
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
            setError("Error de conexion con el servidor") // Si hay un error, reseteamos el formulario
            setCargando(false)
        }
    }

    /*const cerrarSesion = () => {
        localStorage.removeItem("usuario");
        setUsuarioAuth(null);
        navigate("/login");
    }*/

  return (
    <>
        <div className="container mt-4">
            {cargando && (
                <div className="d-flex justify-content-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            )}

                {error && <div className="alert alert-danger">{error}</div>}

                {!cargando && !error && (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Contactos</h5>
                            <span className="badge bg-secondary">{contactosState.length} contactos</span>
                        </div>

                        {contactosState.length === 0 ? (
                            <div className="alert alert-info">No hay contactos para mostrar.</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover align-middle">
                                    <thead className="table-primary">
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>Email</th>
                                            <th>Empresa</th>
                                            <th>Teléfonos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contactosState.map((contacto) => (
                                            <tr key={contacto._id}>
                                                <td>{contacto.nombre}</td>
                                                <td>{contacto.apellido}</td>
                                                <td>{contacto.email}</td>
                                                <td>{contacto.empresa || '-'}</td>
                                                <td>{contacto.telefonos?.join(', ') || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
        </div>
    
    </>
  )
}