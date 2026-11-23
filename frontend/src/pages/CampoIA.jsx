import { useState } from "react";

export default function CampoIA(){
 const [mensajes,setMensajes]=useState([{tipo:"bot",texto:"¡Hola! Soy CampoIA. Puedo orientarte sobre productos, exportaciones, precios y oportunidades comerciales."}]);
 const [texto,setTexto]=useState("");

 function enviar(){
  if(!texto.trim())return;
  const t=texto.toLowerCase();
  let respuesta="Puedo ayudarte con productos, precios, exportaciones y oportunidades comerciales.";
  if(t.includes("exportar")) respuesta="Puedes considerar banano, cacao, café, rosas, pitahaya, brócoli, palmito y quinua. Revisa requisitos fitosanitarios, certificaciones, empaque, Incoterms y logística.";
  if(t.includes("cacao")) respuesta="El cacao es un producto exportable relevante. Puedes registrarlo, consultar inventario y crear cotizaciones internacionales.";
  if(t.includes("precio")) respuesta="Los precios deben provenir de fuentes oficiales o APIs verificables. Los datos demostrativos no son cotizaciones reales.";
  setMensajes(m=>[...m,{tipo:"user",texto},{tipo:"bot",texto:respuesta}]);
  setTexto("");
 }

 return (
  <div className="p-6">
   <h1 className="text-2xl font-bold text-[#174D32] mb-4">CampoIA</h1>
   <div className="bg-white p-6 rounded-2xl shadow">
    <div className="h-72 overflow-y-auto bg-[#F7F8F2] rounded-xl p-4 mb-4 space-y-3">
     {mensajes.map((m,i)=>(<div key={i} className={m.tipo==="user"?"text-right":"text-left"}><span className={m.tipo==="user"?"inline-block bg-[#174D32] text-white px-4 py-2 rounded-xl text-sm":"inline-block bg-[#E7F0E8] px-4 py-2 rounded-xl text-sm"}>{m.texto}</span></div>))}
    </div>
    <div className="flex gap-3">
     <input value={texto} onChange={e=>setTexto(e.target.value)} placeholder="Escribe tu pregunta..." className="flex-1 border rounded-xl p-3"/>
     <button onClick={enviar} className="bg-[#174D32] text-white px-6 py-3 rounded-xl font-semibold">Enviar</button>
    </div>
   </div>
  </div>
 );
}
