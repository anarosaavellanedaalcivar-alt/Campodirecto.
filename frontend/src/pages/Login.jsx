import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login(){
 const {login}=useAuth();
 const navigate=useNavigate();
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [error,setError]=useState("");
 const [cargando,setCargando]=useState(false);

 async function enviar(e){
  e.preventDefault();setCargando(true);setError("");
  try{await login(email,password);navigate("/");}
  catch{setError("Credenciales inválidas o servidor no disponible.");}
  finally{setCargando(false);}
 }

 return (
  <div className="min-h-screen bg-[#174D32] flex items-center justify-center p-6">
   <form onSubmit={enviar} className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
    <div className="text-center mb-8">
     <div className="text-4xl">🌿</div>
     <h1 className="text-2xl font-extrabold text-[#174D32] mt-3">CampoDirecto</h1>
     <p className="text-sm text-gray-500 mt-1">Del productor al mundo, sin fronteras</p>
    </div>
    <label className="block text-sm font-semibold text-[#174D32] mb-1">Correo electrónico</label>
    <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 mb-4" placeholder="admin@campodirecto.ec"/>
    <label className="block text-sm font-semibold text-[#174D32] mb-1">Contraseña</label>
    <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 mb-4" placeholder="••••••••"/>
    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
    <button disabled={cargando} className="w-full bg-[#174D32] text-white py-3 rounded-xl font-semibold hover:bg-[#36834A] transition">{cargando?"Ingresando...":"Iniciar sesión"}</button>
    <p className="text-xs text-gray-500 mt-4 text-center">Usuario demostrativo: admin@campodirecto.ec<br/>Contraseña: CampoDirecto2026</p>
   </form>
  </div>
 );
}
