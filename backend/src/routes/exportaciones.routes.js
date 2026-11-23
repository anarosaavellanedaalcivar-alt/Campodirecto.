import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { verificarToken } from "../middleware/auth.js";

const router=Router();
const schema=z.object({tipoOperacion:z.enum(["IMPORTACION","EXPORTACION"]),producto:z.string().min(3),cantidad:z.number().positive(),unidad:z.string(),paisOrigen:z.string(),paisDestino:z.string(),incoterm:z.string(),valorFOB:z.number().nonnegative(),flete:z.number().nonnegative(),seguro:z.number().nonnegative()});

router.get("/embarques",verificarToken,async(req,res,next)=>{
 try{
  const embarques=await prisma.embarque.findMany({orderBy:{createdAt:"desc"}});
  res.json({exito:true,embarques});
 }catch(e){next(e)}
});

router.post("/embarques",verificarToken,async(req,res,next)=>{
 try{
  const datos=schema.parse(req.body);
  const valorCIF=datos.valorFOB+datos.flete+datos.seguro;
  const embarque=await prisma.embarque.create({data:{codigo:`EMB-${Date.now()}`,...datos,valorCIF}});
  res.status(201).json({exito:true,mensaje:"Embarque registrado",embarque});
 }catch(e){next(e)}
});

router.post("/calculadora",verificarToken,async(req,res,next)=>{
 try{
  const {valorFOB=0,flete=0,seguro=0,gastosPortuarios=0,gastosAduaneros=0,tributos=0,otrosCostos=0,precioVenta=0}=req.body;
  const valorCIF=valorFOB+flete+seguro;
  const costoTotal=valorCIF+gastosPortuarios+gastosAduaneros+tributos+otrosCostos;
  const margen=precioVenta-costoTotal;
  const margenPorcentual=costoTotal>0?(margen/costoTotal)*100:0;
  res.json({exito:true,estimacion:{valorFOB,flete,seguro,valorCIF,gastosPortuarios,gastosAduaneros,tributos,otrosCostos,costoTotal,precioVenta,margen,margenPorcentual},advertencia:"Estimación preliminar. No reemplaza una liquidación aduanera oficial."});
 }catch(e){next(e)}
});

export default router;
