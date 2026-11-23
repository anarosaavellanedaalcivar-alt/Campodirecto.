import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Clientes(){
 const [clientes,setClientes]=useState([]);
 const [form,setForm]=useState({nombre:"",tipoCliente:"CONSUMIDOR FINAL",pais:"Ecuador",ciudad:"",email:"",telefono:"",clasificacion:"MINORISTA"});

 async function cargar(){
  const r=await api.get("/clientes");
  setClientes(r.data.clientes);
 }

 useEffect(()=>{cargar();},[]);

 async function crear(e){
  e.preventDefault();
  await api.post("/clientes",form);
  setForm({nombre:"",tipoCliente:"CONSUMIDOR FINAL",pais:"Ecuador",ciudad:"",email:"",telefono:"",clasificacion:"MINORISTA"});
  cargar();
 }

 return (
  <div className="p-6">
   <h1 className="text-2xl font-bold text-[#174D32] mb-4">CRM — Gestión de clientes</h1>
   <form onSubmit={crear} className="bg-white p-6 rounded-2xl shadow max-w-2xl mb-6">
    <h2 className="font-bold text-[#174D32] mb-3">Registrar cliente</h2>
    <input required placeholder="Nombre o empresa" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} className="w-full border rounded-xl p-3 mb-3"/>
    <input required type="email" placeholder="Correo" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full border rounded-xl p-3 mb-3"/>
    <input placeholder="Ciudad" value={form.ciudad} onChange={e=>setForm({...form,ciudad:e.target.value})} className="w-full border rounded-xl p-3 mb-3"/>
    <select value={form.tipoCliente} onChange={e=>setForm({...form,tipoCliente:e.target.value})} className="w-full border rounded-xl p-3 mb-3">
     <option>CONSUMIDOR FINAL</option><option>SUPERMERCADO</option><option>RESTAURANTE</option><option>DISTRIBUIDOR</option><option>IMPORTADOR</option>
    </select>
    <button className="bg-[#174D32] text-white px-6 py-3 rounded-xl font-semibold">Guardar cliente</button>
   </form>
   <div className="bg-white p-6 rounded-2xl shadow">
    <h2 className="font-bold text-[#174D32] mb-3">Clientes registrados</h2>
    {clientes.length===0?<p className="text-gray-500">No hay clientes.</p>:clientes.map(c=><p key={c.id} className="border-b py-2 text-sm">{c.nombre} — {c.pais} — {c.tipoCliente}</p>)}
   </div>
  </div>
 );
}
