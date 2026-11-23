import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function Dashboard(){
 const {usuario,logout}=useAuth();
 const [productos,setProductos]=useState([]);
 useEffect(()=>{api.get("/productos").then(r=>setProductos(r.data.productos)).catch(()=>setProductos([]));},[]);
 const alertas=productos.filter(p=>p.stockActual<=p.stockMinimo);

 return (
  <div className="min-h-screen bg-[#F7F8F2]">
   <header className="bg-[#174D32] text-white p-5 flex justify-between items-center">
    <div><h1 className="text-xl font-bold">CampoDirecto</h1><p className="text-sm opacity-80">Bienvenido, {usuario?.nombre}</p></div>
    <button onClick={logout} className="bg-[#D5A642] text-[#23301F] px-4 py-2 rounded-full font-semibold">Salir</button>
   </header>
   <nav className="bg-white shadow-sm p-4 flex flex-wrap gap-3">
    <Link className="px-4 py-2 rounded-full bg-[#174D32] text-white" to="/">Dashboard</Link>
    <Link className="px-4 py-2 rounded-full border" to="/productos">Productos</Link>
    <Link className="px-4 py-2 rounded-full border" to="/inventario">Inventario</Link>
    <Link className="px-4 py-2 rounded-full border" to="/ventas">Ventas</Link>
    <Link className="px-4 py-2 rounded-full border" to="/clientes">CRM</Link>
    <Link className="px-4 py-2 rounded-full border" to="/exportaciones">Comercio exterior</Link>
    <Link className="px-4 py-2 rounded-full border" to="/campoia">CampoIA</Link>
   </nav>
   <main className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
     <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500 text-sm">Productos registrados</p><p className="text-3xl font-bold text-[#174D32]">{productos.length}</p></div>
     <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500 text-sm">Alertas de inventario</p><p className="text-3xl font-bold text-[#D5A642]">{alertas.length}</p></div>
     <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500 text-sm">Productos exportables</p><p className="text-3xl font-bold text-[#36834A]">{productos.filter(p=>p.disponibleExportacion).length}</p></div>
     <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500 text-sm">Rol del usuario</p><p className="text-xl font-bold text-[#174D32]">{usuario?.rol}</p></div>
    </div>
    <div className="bg-white p-6 rounded-2xl shadow">
     <h2 className="text-xl font-bold text-[#174D32] mb-4">Productos con alerta de inventario</h2>
     {alertas.length===0?<p className="text-gray-500">No hay alertas activas.</p>:(
      <table className="w-full text-left"><thead><tr className="text-xs uppercase text-gray-500"><th className="py-2">Producto</th><th className="py-2">SKU</th><th className="py-2">Stock actual</th><th className="py-2">Stock mínimo</th></tr></thead><tbody>{alertas.map(p=>(<tr key={p.id} className="border-t"><td className="py-3">{p.nombre}</td><td className="py-3">{p.sku}</td><td className="py-3">{p.stockActual}</td><td className="py-3">{p.stockMinimo}</td></tr>))}</tbody></table>
     )}
    </div>
   </main>
  </div>
 );
}
