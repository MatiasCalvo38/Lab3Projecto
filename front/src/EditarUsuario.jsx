import { useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './ProveedorContexto.jsx'

export const EditarUsuario = () => { // Componente de editar usuario, se encarga de mostrar el formulario para editar los datos del usuario, si el usuario no esta autenticado redirige al login, si el usuario esta autenticado muestra el formulario con los datos actuales del usuario, al enviar el formulario se hace una peticion al backend para actualizar los datos del usuario, si la peticion es correcta se actualiza el contexto de autenticacion con los nuevos datos del usuario y se muestra un mensaje de exito, si la peticion es incorrecta se muestra un mensaje de error

    const [usuarioAuth,setUsuarioAuth] = useContext(AuthContext);
    const navigate = useNavigate();
    const [error,setError] = useState(null);
    const [exito,setExito] = useState(false);

    if(!usuarioAuth){
        navigate('/login');
        return null;
    }

    const recogerForm = (e) => { // Funcion para recoger los datos del formulario, se encarga de evitar el comportamiento por defecto del formulario, recoger los datos del formulario y llamar a la funcion de actualizar usuario con los datos recogidos del formulario
        e.preventDefault();
        setError(null);

        const datos = {
            nombre: e.target.nombre.value,
            mail: e.target.mail.value,
        }

        if(e.target.password.value){
            datos.password = e.target.password.value;
        }

        actualizarUsuario(datos);
    }

    const actualizarUsuario = async(datos) => { // Funcion para actualizar los datos del usuario, se encarga de hacer una peticion al backend para actualizar los datos del usuario, si la peticion es correcta se actualiza el contexto de autenticacion con los nuevos datos del usuario y se muestra un mensaje de exito, si la peticion es incorrecta se muestra un mensaje de error
        try {
            const peticion = await fetch(`http://localhost:1234/usuarios/${usuarioAuth.id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': usuarioAuth.token
                },

                body: JSON.stringify(datos)

            })

            if(!peticion.ok){
                setError("Error al actualizar el usuario");
                return;
            }

            const usuarioActualizado = await peticion.json();
            localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
            setUsuarioAuth(usuarioActualizado);
            setExito(true);
            setTimeout(() => navigate('/contactos'), 1500)

        } catch (e) {
            console.log(e);
            setError("Error de conexion con el servidor");
        }
    }

  return ( // Renderizamos el formulario para editar los datos del usuario, el formulario tiene los datos actuales del usuario como valores por defecto, al enviar el formulario se llama a la funcion de recogerForm para recoger los datos del formulario y actualizar los datos del usuario, si hay un error se muestra un mensaje de error, si la actualizacion es exitosa se muestra un mensaje de exito
    <div className="py-5 d-flex justify-content-center">
            <div className="card shadow" style={{ width: '400px' }}>
                <div className="card-body p-4">
                    <h2 className="card-title text-center mb-4">Editar Perfil</h2>
                    <form onSubmit={recogerForm}>
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Usuario</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                name="nombre"
                                defaultValue={usuarioAuth.nombre}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="mail" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="mail"
                                name="mail"
                                defaultValue={usuarioAuth.mail}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Nueva contraseña{' '}
                                <span className="text-muted small">(dejar vacío para no cambiar)</span>
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                placeholder="Nueva contraseña"
                            />
                        </div>
                        {error && <div className="alert alert-danger py-2">{error}</div>}
                        {exito && <div className="alert alert-success py-2">¡Datos actualizados correctamente!</div>}
                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-secondary w-50" onClick={() => navigate('/contactos')}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary w-50">
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  )
}
