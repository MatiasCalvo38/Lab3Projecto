import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Rutas } from './Rutas.jsx'

createRoot(document.getElementById('root')).render(
  <Rutas />
)