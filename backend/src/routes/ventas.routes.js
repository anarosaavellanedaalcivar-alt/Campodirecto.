import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { verificarToken } from "../middleware/auth.js";

const router=Router();
const schema=z.object({clienteId:z.string(),tipo:z.enum(["NACIONAL","INTERNACIONAL","B2B"]),incoterm:z.string().optional(),paisDestino:z.string().optional(),detalles:z.array(z.object({productoId:z.string(),cantidad:z.number().positive(),precioUnitario:z.number().positive()})).min(1)});

router.get("/",verificarToken,async(req,res,next)=>{
 try{
  const pedidos=await prisma.pedido.findMany({include:{cliente:true,detalles:{include:{producto:true}}},orderBy:{createdAt:"desc"}});
  res.json({exito:true,pedidos});
 }catch(e){next(e)}
});

router.post("/",verificarToken,async(req,res,next)=>{
 try{
  const datos=schema.parse(req.body);
  const total=datos.detalles.reduce((s,i)=>s+i.cantidad*i.precioUnitario,0);
  const pedido=await prisma.pedido.create({data:{codigo:`CD-${Date.now()}`,clienteId:datos.clienteId,usuarioId:req.usuario.id,tipo:datos.tipo,incoterm:datos.incoterm,paisDestino:datos.paisDestino,total,detalles:{create:datos.detalles.map(i=>({productoId:i.productoId,cantidad:i.cantidad,precioUnitario:i.precioUnitario,subtotal:i.cantidad*i.precioUnitario}))}},include:{cliente:true,detalles:{include:{producto:true}}}});
  res.status(201).json({exito:true,mensaje:"Pedido registrado",pedido});
 }catch(e){next(e)}
});

export default router;
