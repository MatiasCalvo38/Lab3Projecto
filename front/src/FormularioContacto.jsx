import {use, useContext,useEffect,useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from './ProveedorContexto.jsx';

const formularioVacio = {
    nombre: "",
    apellido: "",
    email: "",
    empresa: "",
    domicilio: "",
    telefonos: ""
}

export const FormularioContacto = () => {
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

    const cargarContacto = async() => {
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

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        })
    }

    const buildBody = () => {
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

    const handleSubmit = async(e) => {
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
                setErrorFormulario("Error al guardar contacto");
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

    if(usuarioAuth === null){
        return null;
    }

  return (
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
