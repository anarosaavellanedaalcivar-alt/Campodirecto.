import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Inventario(){
 const [inventario,setInventario]=useState([]);
 const [alertas,setAlertas]=useState([]);
 const [form,setForm]=useState({productoId:"",tipo:"ENTRADA",cantidad:1,motivo:"",almacen:""});

 async function cargar(){
  const r=await api.get("/inventario");
  setInventario(r.data.inventario);
  setAlertas(r.data.alertas);
 }

 useEffect(()=>{cargar();},[]);

 async function registrar(e){
  e.preventDefault();
  await api.post("/inventario/movimiento",{...form,cantidad:Number(form.cantidad)});
  setForm({productoId:"",tipo:"ENTRADA",cantidad:1,motivo:"",almacen:""});
  cargar();
 }

 return (
  <div className="p-6">
   <h1 className="text-2xl font-bold text-[#174D32] mb-4">Gestión de inventario</h1>
   <div className="bg-white p-6 rounded-2xl shadow mb-6">
    <h2 className="font-bold text-[#174D32] mb-3">Alertas</h2>
    {alertas.length===0?<p className="text-gray-500">Sin alertas activas.</p>:alertas.map(a=><p key={a.sku} className="text-sm">⚠️ {a.producto}: {a.mensaje}</p>)}
   </div>
   <form onSubmit={registrar} className="bg-white p-6 rounded-2xl shadow max-w-2xl">
    <h2 className="font-bold text-[#174D32] mb-3">Registrar movimiento</h2>
    <select required value={form.productoId} onChange={e=>setForm({...form,productoId:e.target.value})} className="w-full border rounded-xl p-3 mb-3">
     <option value="">Selecciona producto</option>
     {inventario.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}
    </select>
    <select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})} className="w-full border rounded-xl p-3 mb-3">
     <option>ENTRADA</option><option>SALIDA</option><option>AJUSTE</option><option>MERMA</option>
    </select>
    <input type="number" min="1" value={form.cantidad} onChange={e=>setForm({...form,cantidad:e.target.value})} className="w-full border rounded-xl p-3 mb-3"/>
    <input required placeholder="Motivo" value={form.motivo} onChange={e=>setForm({...form,motivo:e.target.value})} className="w-full border rounded-xl p-3 mb-3"/>
    <input required placeholder="Almacén" value={form.almacen} onChange={e=>setForm({...form,almacen:e.target.value})} className="w-full border rounded-xl p-3 mb-3"/>
    <button className="bg-[#174D32] text-white px-6 py-3 rounded-xl font-semibold">Registrar movimiento</button>
   </form>
  </div>
 );
}
