import { useContext,useEffect,useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from './ProveedorContexto.jsx';

const formularioVacio = { // Formulario vacio para inicializar el estado del formulario, se utiliza tanto para el formulario de creacion como para el formulario de edicion, en el caso de edicion se reemplaza por los datos del contacto a editar
    nombre: "",
    apellido: "",
    email: "",
    empresa: "",
    domicilio: "",
    telefonos: ""
}

export const FormularioContacto = () => { // Componente de formulario de contacto, se encarga de mostrar el formulario para crear o editar un contacto, si el usuario no esta autenticado redirige al login, si el usuario esta autenticado muestra el formulario con los datos del contacto a editar o con el formulario vacio para crear un nuevo contacto, al enviar el formulario se hace una peticion al backend para crear o actualizar el contacto, si la peticion es correcta se redirige a la pagina de contactos, si la peticion es incorrecta se muestra un mensaje de error
    const [usuarioAuth] = useContext(AuthContext);
    const navigate = useNavigate();
    const {id} = useParams();
    const esEdicion = Boolean(id);
    const [formulario, setFormulario] = useState(formularioVacio);
    const [cargando, setCargando] = useState(esEdicion);
    const [error, setError] = useState(null);
    const [errorFormulario, setErrorFormulario] = useState(null);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if(usuarioAuth === null){
            navigate('/login');
        }
    },[usuarioAuth])

    useEffect(() => {
        if(esEdicion && usuarioAuth){
            cargarContacto();
        }
    },[esEdicion, usuarioAuth])

    const cargarContacto = async() => { // Funcion para cargar los datos del contacto a editar, se encarga de hacer una peticion al backend para obtener los datos del contacto, si la peticion es correcta se actualiza el estado del formulario con los datos del contacto, si la peticion es incorrecta se muestra un mensaje de error
        try {
            const peticion = await fetch(`http://localhost:1234/contactos/${id}`,{
                headers: {'Authorization': usuarioAuth.token}
            })

            if(!peticion.ok){
                setError("Error al cargar contacto");
                setCargando(false);
                return;
            }

            const datos = await peticion.json();

            setFormulario({
                nombre: datos.nombre || "",
                apellido: datos.apellido || "",
                email: datos.email || "",
                empresa: datos.empresa || "",
                domicilio: datos.domicilio || "",
                telefonos: datos.telefonos?.join(", ") || ""
            })

            setCargando(false);

        } catch (e) {
            console.log(e);
            setError("Error de conexión");
            setCargando(false);
        }
    }

    const handleChange = (e) => { // Funcion para manejar el cambio en los campos del formulario, se encarga de actualizar el estado del formulario con los nuevos valores ingresados por el usuario, cada vez que el usuario ingresa un valor en un campo del formulario se llama a esta funcion para actualizar el estado del formulario, el estado del formulario se utiliza para mostrar los valores actuales en los campos del formulario y para enviar los datos al backend al momento de guardar el contacto
        setFormulario({...formulario, [e.target.name]: e.target.value});
    }

    const buildBody = () => { // Funcion para construir el cuerpo de la peticion al backend, se encarga de tomar los datos del formulario y construir un objeto con los datos necesarios para crear o actualizar un contacto, el objeto construido se utiliza como cuerpo de la peticion al backend al momento de guardar el contacto, esta funcion se encarga de transformar los datos del formulario en el formato esperado por el backend, por ejemplo, convierte el campo de telefonos que es una cadena de texto separada por comas en un array de strings, tambien se encarga de eliminar los campos vacios para no enviar datos innecesarios al backend
        const body = {
            nombre: formulario.nombre,
            apellido: formulario.apellido,
            email: formulario.email,
        }

        if(formulario.empresa){
            body.empresa = formulario.empresa;
        }

        if(formulario.domicilio){
            body.domicilio = formulario.domicilio;
        }

        if(formulario.telefonos){
            body.telefonos = formulario.telefonos.split(",").map(t => t.trim()).filter(t => t);
        }

        return body;
    }

    const handleSubmit = async(e) => { // Funcion para manejar el submit del formulario, se encarga de evitar el comportamiento por defecto del formulario, construir el cuerpo de la peticion al backend con los datos del formulario, hacer una peticion al backend para crear o actualizar el contacto, si la peticion es correcta se redirige a la pagina de contactos, si la peticion es incorrecta se muestra un mensaje de error
        e.preventDefault();
        setErrorFormulario(null);
        setGuardando(true);

        const url = esEdicion
            ? `http://localhost:1234/contactos/${id}`
            : 'http://localhost:1234/contactos';

        const method = esEdicion ? 'PUT' : 'POST';

        try {
            const peticion = await fetch(url,{
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': usuarioAuth.token
                },
                body: JSON.stringify(buildBody())
            })

            if(!peticion.ok){
                setErrorFormulario("Error al guardar el contacto");
                setGuardando(false);
                return;
            }

            navigate("/contactos");

        } catch (e) {
            console.log(e);
            setErrorFormulario("Error de conexión con el servidor");
            setGuardando(false);
        }
    }

    if(usuarioAuth === null){ // Si el usuario no esta autenticado, redirigimos al login, esto es una medida de seguridad para evitar que un usuario no autenticado pueda acceder a la pagina de creacion o edicion de contactos, aunque el componente de formulario de contacto ya se encarga de redirigir al login si el usuario no esta autenticado, esta verificacion adicional es para asegurarnos de que en caso de que el componente se renderice antes de que el efecto de redireccionamiento se ejecute, no se muestre el formulario a un usuario no autenticado, en resumen, esta verificacion es una medida de seguridad adicional para evitar que un usuario no autenticado pueda acceder al formulario de contacto
        return null;
    }

  return ( // Renderizamos el formulario para crear o editar un contacto, si el usuario no esta autenticado redirigimos al login, si el usuario esta autenticado mostramos el formulario con los datos del contacto a editar o con el formulario vacio para crear un nuevo contacto, al enviar el formulario se hace una peticion al backend para crear o actualizar el contacto, si la peticion es correcta se redirige a la pagina de contactos, si la peticion es incorrecta se muestra un mensaje de error
    <div className="container mt-4">
        <div className="row justify-content-center">
            <div className="col-md-8">
                <div className="card shadow">
                        <div className="card-body p-4">
                            <h4 className="card-title mb-4">
                                {esEdicion ? 'Editar contacto' : 'Nuevo contacto'}
                            </h4>

                            {cargando && (
                                <div className="d-flex justify-content-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            )}

                            {error && <div className="alert alert-danger">{error}</div>}

                            {!cargando && !error && (
                                <>
                                    {errorFormulario && (
                                        <div className="alert alert-danger py-2">{errorFormulario}</div>
                                    )}
                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
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
                                            <div className="col-md-6">
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
                                            <div className="col-md-6">
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
                                            <div className="col-md-6">
                                                <label className="form-label">Empresa</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="empresa"
                                                    value={formulario.empresa}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Domicilio</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="domicilio"
                                                    value={formulario.domicilio}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-6">
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
                                        <div className="mt-4 d-flex gap-2">
                                            <button
                                                type="submit"
                                                className="btn btn-success"
                                                disabled={guardando}
                                            >
                                                {guardando ? 'Guardando...' : 'Guardar'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => navigate('/contactos')}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                </div>
            </div>
        </div>
    </div>
  )
}
