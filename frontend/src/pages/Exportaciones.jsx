import { useState } from "react";
import api from "../lib/api";

export default function Exportaciones(){
 const [form,setForm]=useState({tipoOperacion:"EXPORTACION",producto:"",cantidad:1,unidad:"Tonelada",paisOrigen:"Ecuador",paisDestino:"",incoterm:"FOB",valorFOB:0,flete:0,seguro:0});
 const [resultado,setResultado]=useState(null);

 async function calcular(e){
  e.preventDefault();
  const r=await api.post("/comercio-exterior/calculadora",{valorFOB:Number(form.valorFOB),flete:Number(form.flete),seguro:Number(form.seguro),gastosPortuarios:0,gastosAduaneros:0,tributos:0,otrosCostos:0,precioVenta:0});
  setResultado(r.data.estimacion);
 }

 async function registrar(e){
  e.preventDefault();
  await api.post("/comercio-exterior/embarques",{...form,cantidad:Number(form.cantidad),valorFOB:Number(form.valorFOB),flete:Number(form.flete),seguro:Number(form.seguro)});
  alert("Embarque registrado correctamente.");
 }

 return (
  <div className="p-6">
   <h1 className="text-2xl font-bold text-[#174D32] mb-4">Comercio exterior</h1>
   <form onSubmit={registrar} className="bg-white p-6 rounded-2xl shadow max-w-3xl mb-6">
    <h2 className="font-bold text-[#174D32] mb-3">Registrar embarque</h2>
    <div className="grid md:grid-cols-2 gap-3">
     <input required placeholder="Producto" value={form.producto} onChange={e=>setForm({...form,producto:e.target.value})} className="border rounded-xl p-3"/>
     <input required placeholder="País destino" value={form.paisDestino} onChange={e=>setForm({...form,paisDestino:e.target.value})} className="border rounded-xl p-3"/>
     <input type="number" placeholder="Valor FOB" value={form.valorFOB} onChange={e=>setForm({...form,valorFOB:e.target.value})} className="border rounded-xl p-3"/>
     <input type="number" placeholder="Flete" value={form.flete} onChange={e=>setForm({...form,flete:e.target.value})} className="border rounded-xl p-3"/>
     <input type="number" placeholder="Seguro" value={form.seguro} onChange={e=>setForm({...form,seguro:e.target.value})} className="border rounded-xl p-3"/>
     <select value={form.incoterm} onChange={e=>setForm({...form,incoterm:e.target.value})} className="border rounded-xl p-3"><option>EXW</option><option>FOB</option><option>CIF</option><option>DAP</option><option>DDP</option></select>
    </div>
    <button className="mt-4 bg-[#174D32] text-white px-6 py-3 rounded-xl font-semibold">Registrar embarque</button>
   </form>
   <form onSubmit={calcular} className="bg-white p-6 rounded-2xl shadow max-w-3xl">
    <h2 className="font-bold text-[#174D32] mb-3">Calculadora de comercio exterior</h2>
    <button className="bg-[#D5A642] text-[#23301F] px-6 py-3 rounded-xl font-semibold">Calcular CIF estimado</button>
   </form>
   {resultado && (
    <div className="bg-white p-6 rounded-2xl shadow mt-6">
     <p>Valor CIF: ${resultado.valorCIF}</p>
     <p>Costo total estimado: ${resultado.costoTotal}</p>
     <p className="text-xs text-gray-500">Estimación preliminar; no reemplaza una liquidación aduanera oficial.</p>
    </div>
   )}
  </div>
 );
}
