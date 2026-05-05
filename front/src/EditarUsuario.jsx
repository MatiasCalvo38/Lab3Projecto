import { useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './ProveedorContexto.jsx'

export const EditarUsuario = () => {

    const [usuarioAuth,setUsuarioAuth] = useContext(AuthContext);
    const navigate = useNavigate();
    const [error,setError] = useState(null);
    const [exito,setExito] = useState(false);

    if(!usuarioAuth){
        navigate('/login');
        return null;
    }

    const recogerForm = (e) => {
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

    const actualizarUsuario = async(datos) => {
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

  return (
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
