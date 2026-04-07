import React from 'react'
import { Login } from './login.jsx'
import { Registro } from './Registro.jsx'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { ProveedorContexto } from './ProveedorContexto.jsx'
import { Contactos } from './Contactos.jsx'

export const Rutas = () => {
  return (
    <BrowserRouter>
        <ProveedorContexto>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/registro' element={<Registro />} />
                <Route path='/login' element={<Login />} />
                <Route path='*' element={<h1>Error 404: No encontrado</h1>} />
                <Route path='/contactos' element={<Contactos />} />
            </Routes>
        </ProveedorContexto>
    </BrowserRouter>
  )
}
