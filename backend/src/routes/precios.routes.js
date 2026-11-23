import { Router } from "express";
import { prisma } from "../config/database.js";
const router=Router();

router.get("/",async(req,res,next)=>{
 try{
  const {producto,mercado,pais}=req.query;
  const precios=await prisma.precioMercado.findMany({where:{producto:producto||undefined,mercado:mercado||undefined,pais:pais||undefined},orderBy:{fechaActualizacion:"desc"}});
  res.json({exito:true,precios,advertencia:"Los registros demostrativos no deben usarse como cotizaciones reales."});
 }catch(e){next(e)}
});

export default router;
