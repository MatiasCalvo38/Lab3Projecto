import { useContext,useEffect,useState } from 'react'
import { AuthContext } from './ProveedorContexto.jsx'
import { useNavigate } from 'react-router-dom'

export const ResultadoContacto = () => { // Componente para mostrar los contactos del usuario autenticado, con la posibilidad de agregar nuevos contactos a través de un formulario

    const [usuarioAuth, setUsuarioAuth] = useContext(AuthContext)
    const navigate = useNavigate()
    const esAdmin = usuarioAuth?.rol === 'admin'
    const [contactosState,setContactosState] = useState([])
    const [cargando,setCargando] = useState(true)
    const [error,setError] = useState(null)
    
    useEffect(() => { // Si no hay usuarioAuth todavía, no hacemos nada (esperamos a que el Contexto cargue)
        if (usuarioAuth && usuarioAuth.token) {
            resultados();
        }
    }, [usuarioAuth]); // Se activará cuando usuarioAuth cambie de null a tener los datos

    const resultados = async () => { // Función para cargar los contactos desde el servidor
        try { // Hacemos la petición al backend para obtener los contactos, incluyendo el token de autenticación en los headers
            const peticion=await fetch('http://localhost:1234/contactos',
                {
                    method:'GET',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${usuarioAuth.token}`
                    }
                }
            )

            if(!peticion.ok) { // Si la respuesta no es 200, intentamos leer el mensaje de error del servidor
                const errorData = await peticion.json().catch(() => ({})); // Intenta leer el mensaje del server
                setError('Error al cargar los contactos');
                setCargando(false);
                return;
            }

            const datos = await peticion.json() // Si la respuesta es 200, leemos los datos y los guardamos en el estado

            setContactosState(datos)
            setCargando(false)
           
        } catch (e) { // Si hay un error de conexión u otro tipo de error, lo capturamos aquí
            setError("Error de conexion con el servidor") // Si hay un error, reseteamos el formulario
            setCargando(false)
        }
    }

    const handleEliminar = async (id) => { // Función para eliminar un contacto, se encarga de hacer una petición al backend para eliminar el contacto, si la petición es correcta se recargan los contactos, si la petición es incorrecta se muestra un mensaje de error
        if (!window.confirm('¿Eliminar este contacto?')){
            return
        }

        try {
            const peticion = await fetch(`http://localhost:1234/contactos/${id}`, {
                method: 'DELETE',
                headers: {'Authorization': usuarioAuth.token}
            })

            if(!peticion.ok){
                setError('No se pudo eliminar el contacto')
                return
            }

            await resultados()

        } catch (e) {
            console.log(e)
            setError('Error de conexion con el servidor')
        }
    }

    const handleTogglePublico = async (id) => { // Función para cambiar el estado de publico de un contacto, se encarga de hacer una petición al backend para cambiar el estado de publico del contacto, si la petición es correcta se recargan los contactos, si la petición es incorrecta se muestra un mensaje de error
        try {
            const peticion = await fetch(`http://localhost:1234/contactos/${id}/publico`, {
                method: 'PATCH',
                headers: {'Authorization': usuarioAuth.token}
            })

            if(!peticion.ok){
                setError('No se pudo cambiar la visibilidad')
                return
            }

            await resultados()

        } catch (e) {
            console.log(e)
            setError('Error de conexion con el servidor')
        }
    }

    const handleToggleVisible = async (id) => { // Función para cambiar el estado de visible de un contacto, se encarga de hacer una petición al backend para cambiar el estado de visible del contacto, si la petición es correcta se recargan los contactos, si la petición es incorrecta se muestra un mensaje de error
        try {
            const peticion = await fetch(`http://localhost:1234/contactos/${id}/visible`, {
                method: 'PATCH',
                headers: {'Authorization': usuarioAuth.token}
            })

            if(!peticion.ok){
                setError('No se pudo cambiar la visibilidad')
                return
            }

            await resultados()

        } catch (e) {
            console.log(e)
            setError('Error de conexion con el servidor')
        }
    }

    const esMio = (contacto) => contacto.propietario && contacto.propietario.toString() === usuarioAuth.id?.toString() // Función para verificar si un contacto pertenece al usuario autenticado, se encarga de comparar el id del propietario del contacto con el id del usuario autenticado, esta función se utiliza para mostrar u ocultar ciertas acciones en la interfaz dependiendo de si el contacto pertenece al usuario o no

  return ( // Renderizado del componente, mostrando un spinner de carga mientras se cargan los contactos, un mensaje de error si hay un error, y la lista de contactos junto con el formulario para agregar nuevos contactos si no hay errores ni estamos cargando
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
                        <h5 className="mb-0">
                            {esAdmin ? 'Todos los contactos (Administrador)' : 'Contactos'}
                        </h5>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-secondary">{contactosState.length} contactos</span>
                            {!esAdmin && (
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => navigate('/contactos/nuevo')}
                                >
                                    + Agregar contacto
                                </button>
                            )}
                        </div>
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
                                        <th>Estado</th>
                                        <th>Acciones</th>
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
                                            <td>
                                                {esAdmin ? (
                                                    <div className="d-flex gap-1 flex-wrap">
                                                        <span className={`badge ${contacto.esPublico ? 'bg-success' : 'bg-secondary'}`}>
                                                            {contacto.esPublico ? 'Público' : 'Privado'}
                                                        </span>
                                                        {contacto.esPublico && (
                                                            <span className={`badge ${contacto.esVisible ? 'bg-info text-dark' : 'bg-warning text-dark'}`}>
                                                                {contacto.esVisible ? 'Visible' : 'Oculto'}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    esMio(contacto) ? (
                                                        <span className={`badge ${contacto.esPublico ? 'bg-success' : 'bg-secondary'}`}>
                                                            {contacto.esPublico ? 'Público' : 'Privado'}
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-info text-dark">Público</span>
                                                    )
                                                )}
                                            </td>
                                            <td>
                                                {esAdmin ? (
                                                    contacto.esPublico && (
                                                        <button
                                                            className={`btn btn-sm ${contacto.esVisible ? 'btn-outline-warning' : 'btn-outline-info'}`}
                                                            onClick={() => handleToggleVisible(contacto._id)}
                                                            title={contacto.esVisible ? 'Ocultar' : 'Mostrar'}
                                                        >
                                                            {contacto.esVisible ? 'Ocultar' : 'Mostrar'}
                                                        </button>
                                                    )
                                                ) : (
                                                    esMio(contacto) && (
                                                        <div className="d-flex gap-1 flex-wrap">
                                                            <button
                                                                className="btn btn-outline-primary btn-sm"
                                                                onClick={() => navigate(`/contactos/editar/${contacto._id}`)}
                                                                title="Editar"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                className={`btn btn-sm ${contacto.esPublico ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                                                onClick={() => handleTogglePublico(contacto._id)}
                                                                title={contacto.esPublico ? 'Hacer privado' : 'Hacer público'}
                                                            >
                                                                {contacto.esPublico ? 'Privatizar' : 'Publicar'}
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => handleEliminar(contacto._id)}
                                                                title="Eliminar"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
  )
}