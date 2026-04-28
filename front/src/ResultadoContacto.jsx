import { AuthContext } from './ProveedorContexto.jsx'
import { useContext,useEffect,useState } from 'react'

const formularioVacio = { // Objeto para representar un formulario vacío, utilizado para resetear el formulario después de agregar un contacto o cancelar
    nombre: '',
    apellido: '',
    email: '',
    empresa: '',
    domicilio: '',
    telefonos: ''
}

export const ResultadoContacto = () => { // Componente para mostrar los contactos del usuario autenticado, con la posibilidad de agregar nuevos contactos a través de un formulario

    const [usuarioAuth, setUsuarioAuth] = useContext(AuthContext)
    const [contactosState,setContactosState] = useState([])
    const [exito,setExito] = useState(false)
    const [error,setError] = useState(null)
    const [cargando,setCargando] = useState(true)
    const [mostrarFormulario,setMostrarFormulario] = useState(false)
    const [formulario, setFormulario] = useState(formularioVacio)
    const [errorFormulario, setErrorFormulario] = useState(null)
    const [guardando, setGuardando] = useState(false)

    useEffect(() => { // Si no hay usuarioAuth todavía, no hacemos nada (esperamos a que el Contexto cargue)
        if (usuarioAuth && usuarioAuth.token) {
            resultados();
        }
    }, [usuarioAuth]); // Se activará cuando usuarioAuth cambie de null a tener los datos

    const resultados=async()=>{ // Función para cargar los contactos desde el servidor
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
                setError(`Error ${peticion.status}: al cargar los contactos`);
                setCargando(false);
            return;
}

            const datos = await peticion.json() // Si la respuesta es 200, leemos los datos y los guardamos en el estado

            setContactosState(datos)
            setCargando(false)
           
        } catch (e) { // Si hay un error de conexión u otro tipo de error, lo capturamos aquí
            console.error("Error capturado en el catch:", e);
            setError("Error de conexion con el servidor") // Si hay un error, reseteamos el formulario
            setCargando(false)
        }
    }

    const handleChange = (e) => { // Función para manejar los cambios en el formulario y actualizar el estado del formulario
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        })
    }

    const handleAgregar = async (e) => { // Función para manejar el envío del formulario y agregar un nuevo contacto
        e.preventDefault()
        setErrorFormulario(null)
        setGuardando(true)

        const nuevoContacto = {
            nombre: formulario.nombre,
            apellido: formulario.apellido,
            email: formulario.email
        }

        if (formulario.empresa){
            nuevoContacto.empresa = formulario.empresa
        }
        if (formulario.domicilio){
            nuevoContacto.domicilio = formulario.domicilio
        }
        if (formulario.telefonos){
            nuevoContacto.telefonos = formulario.telefonos.split(',').map(t => t.trim()).filter(t => t)
        }

        try { // Hacemos la petición al backend para crear el nuevo contacto, incluyendo el token de autenticación en los headers
            const peticion = await fetch('http://localhost:1234/contactos',
                {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuarioAuth.token}`
                },
                body: JSON.stringify(nuevoContacto)
            })

            if (!peticion.ok) { // Si la respuesta no es 200, intentamos leer el mensaje de error del servidor
                setErrorFormulario("No se pudo crear el contacto")
                setGuardando(false)
                return
            }

            await resultados() // Recargamos la lista de contactos para mostrar el nuevo
            setFormulario(formularioVacio) // Reseteamos el formulario
            setMostrarFormulario(false) // Ocultamos el formulario

        } catch (e) { // Si hay un error de conexión u otro tipo de error, lo capturamos aquí
            console.log(e)
            setErrorFormulario("Error de conexion con el servidor")
        }

        setGuardando(false)
    }

    const handleCancelar = () => { // Función para manejar la cancelación del formulario, reseteando el formulario y ocultándolo
        setFormulario(formularioVacio)
        setErrorFormulario(null)
        setMostrarFormulario(false)
    }

  return ( // Renderizado del componente, mostrando un spinner de carga mientras se cargan los contactos, un mensaje de error si hay un error, y la lista de contactos junto con el formulario para agregar nuevos contactos si no hay errores ni estamos cargando
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
                            <div className="d-flex align-items-center gap-2">
                                <span className="badge bg-secondary">{contactosState.length} contactos</span>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setMostrarFormulario(true)}
                                >
                                    + Agregar contacto
                                </button>
                            </div>
                        </div>

                        {mostrarFormulario && (
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h6 className="card-title">Nuevo contacto</h6>
                                    {errorFormulario && (
                                        <div className="alert alert-danger py-2">{errorFormulario}</div>
                                    )}
                                    <form onSubmit={handleAgregar}>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <label className="form-label">Nombre *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="nombre"
                                                    value={formulario.nombre}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Apellido *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="apellido"
                                                    value={formulario.apellido}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Email *</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    value={formulario.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Empresa</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="empresa"
                                                    value={formulario.empresa}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Domicilio</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="domicilio"
                                                    value={formulario.domicilio}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Teléfonos</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="telefonos"
                                                    value={formulario.telefonos}
                                                    onChange={handleChange}
                                                    placeholder="Separados por coma"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3 d-flex gap-2">
                                            <button
                                                type="submit"
                                                className="btn btn-success btn-sm"
                                                disabled={guardando}
                                            >
                                                {guardando ? 'Guardando...' : 'Guardar'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={handleCancelar}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

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