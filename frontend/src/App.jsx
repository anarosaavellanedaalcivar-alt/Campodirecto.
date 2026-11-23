import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Inventario from "./pages/Inventario";
import Ventas from "./pages/Ventas";
import Clientes from "./pages/Clientes";
import Exportaciones from "./pages/Exportaciones";
import CampoIA from "./pages/CampoIA";

function Protegida({children}){
 const {usuario}=useAuth();
 return usuario?children:<Navigate to="/login" replace/>;
}

export default function App(){
 return (
  <Routes>
   <Route path="/login" element={<Login/>}/>
   <Route path="/" element={<Protegida><Dashboard/></Protegida}/>
   <Route path="/productos" element={<Protegida><Productos/></Protegida}/>
   <Route path="/inventario" element={<Protegida><Inventario/></Protegida}/>
   <Route path="/ventas" element={<Protegida><Ventas/></Protegida}/>
   <Route path="/clientes" element={<Protegida><Clientes/></Protegida}/>
   <Route path="/exportaciones" element={<Protegida><Exportaciones/></Protegida}/>
   <Route path="/campoia" element={<Protegida><CampoIA/></Protegida}/>
  </Routes>
 );
}
