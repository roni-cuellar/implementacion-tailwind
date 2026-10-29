import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes.jsx'
import './styles/global.css'
import './styles/inicio.css'
import './styles/aplicacion.css'
import './styles/tailwind.css'

function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>
}
export default App
