import { createContext, useContext, useState } from "react";
import api from "../lib/api";
const AuthContext=createContext();

export function AuthProvider({children}){
 const [usuario,setUsuario]=useState(JSON.parse(localStorage.getItem("campodirecto_usuario")||"null"));
 async function login(email,password){
  const r=await api.post("/auth/login",{email,password});
  localStorage.setItem("campodirecto_token",r.data.token);
  localStorage.setItem("campodirecto_usuario",JSON.stringify(r.data.usuario));
  setUsuario(r.data.usuario);
  return r.data;
 }
 function logout(){
  localStorage.removeItem("campodirecto_token");
  localStorage.removeItem("campodirecto_usuario");
  setUsuario(null);
 }
 return <AuthContext.Provider value={{usuario,login,logout}}>{children}</AuthContext.Provider>;
}

export function useAuth(){return useContext(AuthContext)}
