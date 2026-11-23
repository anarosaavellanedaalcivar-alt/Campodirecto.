import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/database.js";

const router=Router();
const registroSchema=z.object({nombre:z.string().min(3),email:z.string().email(),password:z.string().min(6),rol:z.string().optional()});

router.post("/registro",async(req,res,next)=>{
 try{
  const datos=registroSchema.parse(req.body);
  const existe=await prisma.usuario.findUnique({where:{email:datos.email}});
  if(existe) return res.status(409).json({exito:false,mensaje:"El correo ya está registrado"});
  const password=await bcrypt.hash(datos.password,10);
  const usuario=await prisma.usuario.create({data:{nombre:datos.nombre,email:datos.email,password,rol:datos.rol||"CLIENTE"}});
  res.status(201).json({exito:true,mensaje:"Usuario registrado",usuario:{id:usuario.id,nombre:usuario.nombre,email:usuario.email,rol:usuario.rol}});
 }catch(e){next(e)}
});

router.post("/login",async(req,res,next)=>{
 try{
  const {email,password}=req.body;
  const usuario=await prisma.usuario.findUnique({where:{email}});
  if(!usuario||!usuario.activo) return res.status(401).json({exito:false,mensaje:"Credenciales inválidas"});
  const valido=await bcrypt.compare(password,usuario.password);
  if(!valido) return res.status(401).json({exito:false,mensaje:"Credenciales inválidas"});
  const token=jwt.sign({id:usuario.id,email:usuario.email,rol:usuario.rol},process.env.JWT_SECRET,{expiresIn:"8h"});
  res.json({exito:true,token,usuario:{id:usuario.id,nombre:usuario.nombre,email:usuario.email,rol:usuario.rol}});
 }catch(e){next(e)}
});

export default router;
