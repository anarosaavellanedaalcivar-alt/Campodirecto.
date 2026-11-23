import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Ventas(){
 const [pedidos,setPedidos]=useState([]);
 const [clientes,setClientes]=useState([]);
 const [productos,setProductos]=useState([]);
 const [form,setForm]=useState({clienteId:"",tipo:"NACIONAL",productoId:"",cantidad:1,precioUnitario:0});

 async function cargar(){
  const [p,c,pr]=await Promise.all([api.get("/ventas"),api.get("/clientes"),api.get("/productos")]);
  setPedidos(p.data.pedidos);setClientes(c.data.clientes);setProductos(pr.data.productos);
 }

 useEffect(()=>{cargar();},[]);

 async function crear(e){
  e.preventDefault();
  await api.post("/ventas",{clienteId:form.clienteId,tipo:form.tipo,detalles:[{productoId:form.productoId,cantidad:Number(form.cantidad),precioUnitario:Number(form.precioUnitario)}]});
  setForm({clienteId:"",tipo:"NACIONAL",productoId:"",cantidad:1,precioUnitario:0});
  cargar();
 }

 return (
  <div className="p-6">
   <h1 className="text-2xl font-bold text-[#174D32] mb-4">Gestión de ventas</h1>
   <form onSubmit={crear} className="bg-white p-6 rounded-2xl shadow max-w-2xl mb-6">
    <h2 className="font-bold text-[#174D32] mb-3">Nuevo pedido</h2>
    <select required value={form.clienteId} onChange={e=>setForm({...form,clienteId:e.target.value})} className="w-full border rounded-xl p-3 mb-3">
     <option value="">Selecciona cliente</option>
     {clientes.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
    </select>
    <select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})} className="w-full border rounded-xl p-3 mb-3">
     <option>NACIONAL</option><option>INTERNACIONAL</option><option>B2B</option>
    </select>
    <select required value={form.productoId} onChange={e=>setForm({...form,productoId:e.target.value})} className="w-full border rounded-xl p-3 mb-3">
     <option value="">Selecciona producto</option>
     {productos.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}
    </select>
    <input type="number" min="1" value={form.cantidad} onChange={e=>setForm({...form,cantidad:e.target.value})} className="w-full border rounded-xl p-3 mb-3"/>
    <input type="number" step="0.01" value={form.precioUnitario} onChange={e=>setForm({...form,precioUnitario:e.target.value})} className="w-full border rounded-xl p-3 mb-3" placeholder="Precio unitario"/>
    <button className="bg-[#174D32] text-white px-6 py-3 rounded-xl font-semibold">Registrar pedido</button>
   </form>
   <div className="bg-white p-6 rounded-2xl shadow">
    <h2 className="font-bold text-[#174D32] mb-3">Pedidos registrados</h2>
    {pedidos.length===0?<p className="text-gray-500">No hay pedidos.</p>:pedidos.map(p=>(<p key={p.id} className="text-sm border-b py-2">{p.codigo} — {p.cliente?.nombre} — ${p.total} — {p.estado}</p>))}
   </div>
  </div>
 );
}
