import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { verificarToken } from "../middleware/auth.js";

const router=Router();
const schema=z.object({nombre:z.string().min(3),tipoCliente:z.string(),pais:z.string(),ciudad:z.string().optional(),email:z.string().email(),telefono:z.string().optional(),contactoComercial:z.string().optional(),preferencias:z.string().optional(),clasificacion:z.string().optional()});

router.get("/",verificarToken,async(req,res,next)=>{
 try{
  const clientes=await prisma.cliente.findMany({include:{pedidos:true,oportunidades:true},orderBy:{createdAt:"desc"}});
  res.json({exito:true,clientes});
 }catch(e){next(e)}
});

router.post("/",verificarToken,async(req,res,next)=>{
 try{
  const datos=schema.parse(req.body);
  const cliente=await prisma.cliente.create({data:{...datos,usuarioId:req.usuario.id}});
  res.status(201).json({exito:true,mensaje:"Cliente registrado",cliente});
 }catch(e){next(e)}
});

export default router;
