import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Productos(){
 const [productos,setProductos]=useState([]);
 const [busqueda,setBusqueda]=useState("");
 const [categoria,setCategoria]=useState("");
 const [form,setForm]=useState({sku:"",nombre:"",descripcion:"",categoria:"Exportación",unidadMedida:"Kilogramo",precioCompra:0,precioVenta:0,stockActual:0,stockMinimo:0,stockMaximo:0});

 async function cargar(){
  const r=await api.get("/productos",{params:{busqueda,categoria}});
  setProductos(r.data.productos);
 }

 useEffect(()=>{cargar();},[busqueda,categoria]);

 async function crear(e){
  e.preventDefault();
  await api.post("/productos",{...form,precioCompra:Number(form.precioCompra),precioVenta:Number(form.precioVenta),stockActual:Number(form.stockActual),stockMinimo:Number(form.stockMinimo),stockMaximo:Number(form.stockMaximo)});
  setForm({sku:"",nombre:"",descripcion:"",categoria:"Exportación",unidadMedida:"Kilogramo",precioCompra:0,precioVenta:0,stockActual:0,stockMinimo:0,stockMaximo:0});
  cargar();
 }

 return (
  <div className="p-6">
   <h1 className="text-2xl font-bold text-[#174D32] mb-4">Catálogo agrícola</h1>
   <div className="flex flex-wrap gap-3 mb-6">
    <input value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="Buscar producto..." className="border rounded-xl p-3"/>
    <select value={categoria} onChange={e=>setCategoria(e.target.value)} className="border rounded-xl p-3">
     <option value="">Todas las categorías</option>
     <option>Cereales</option><option>Tubérculos</option><option>Legumbres</option><option>Frutas</option><option>Hortalizas</option><option>Exportación</option>
    </select>
   </div>
   <div className="grid md:grid-cols-3 gap-4 mb-8">
    {productos.map(p=>(
     <div key={p.id} className="bg-white rounded-2xl p-5 shadow">
      <h3 className="font-bold text-[#174D32]">{p.nombre}</h3>
      <p className="text-sm text-gray-500">{p.categoria}</p>
      <p className="text-sm text-gray-500 mt-2">{p.descripcion}</p>
      <p className="font-bold text-[#36834A] mt-3">${p.precioVenta} / {p.unidadMedida}</p>
      <p className="text-sm text-gray-500">Stock: {p.stockActual} {p.unidadMedida}</p>
     </div>
    ))}
   </div>
   <form onSubmit={crear} className="bg-white p-6 rounded-2xl shadow max-w-3xl">
    <h2 className="text-xl font-bold text-[#174D32] mb-4">Registrar producto</h2>
    <div className="grid md:grid-cols-2 gap-4">
     <input required placeholder="SKU" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} className="border rounded-xl p-3"/>
     <input required placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} className="border rounded-xl p-3"/>
     <input required placeholder="Descripción" value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} className="border rounded-xl p-3 md:col-span-2"/>
     <input type="number" placeholder="Precio de compra" value={form.precioCompra} onChange={e=>setForm({...form,precioCompra:e.target.value})} className="border rounded-xl p-3"/>
     <input type="number" placeholder="Precio de venta" value={form.precioVenta} onChange={e=>setForm({...form,precioVenta:e.target.value})} className="border rounded-xl p-3"/>
     <input type="number" placeholder="Stock actual" value={form.stockActual} onChange={e=>setForm({...form,stockActual:e.target.value})} className="border rounded-xl p-3"/>
     <input type="number" placeholder="Stock mínimo" value={form.stockMinimo} onChange={e=>setForm({...form,stockMinimo:e.target.value})} className="border rounded-xl p-3"/>
    </div>
    <button className="mt-5 bg-[#174D32] text-white px-6 py-3 rounded-xl font-semibold">Guardar producto</button>
   </form>
  </div>
 );
}
