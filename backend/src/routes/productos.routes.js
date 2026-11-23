import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { verificarToken, permitirRoles } from "../middleware/auth.js";

const router=Router();
const schema=z.object({sku:z.string().min(3),nombre:z.string().min(3),descripcion:z.string().min(5),categoria:z.string(),subcategoria:z.string().optional(),unidadMedida:z.string(),precioCompra:z.number().nonnegative(),precioVenta:z.number().nonnegative(),stockActual:z.number().nonnegative(),stockMinimo:z.number().nonnegative(),stockMaximo:z.number().nonnegative(),calidad:z.string().optional(),temporadaCosecha:z.string().optional(),disponibleNacional:z.boolean().optional(),disponibleExportacion:z.boolean().optional(),imagenUrl:z.string().optional(),productorId:z.string().optional()});

router.get("/",async(req,res,next)=>{
 try{
  const {categoria,busqueda,exportacion}=req.query;
  const productos=await prisma.producto.findMany({where:{categoria:categoria||undefined,nombre:busqueda?{contains:busqueda,mode:"insensitive"}:undefined,disponibleExportacion:exportacion==="true"?true:undefined},include:{productor:{select:{id:true,nombre:true,email:true}}},orderBy:{createdAt:"desc"}});
  res.json({exito:true,productos});
 }catch(e){next(e)}
});

router.get("/:id",async(req,res,next)=>{
 try{
  const producto=await prisma.producto.findUnique({where:{id:req.params.id},include:{productor:true,lotes:true,movimientos:true}});
  if(!producto) return res.status(404).json({exito:false,mensaje:"Producto no encontrado"});
  res.json({exito:true,producto});
 }catch(e){next(e)}
});

router.post("/",verificarToken,permitirRoles("ADMINISTRADOR","GERENTE","PRODUCTOR","EXPORTADOR"),async(req,res,next)=>{
 try{
  const datos=schema.parse(req.body);
  const producto=await prisma.producto.create({data:{...datos,codigoQR:`CD-${datos.sku}-${Date.now()}`}});
  res.status(201).json({exito:true,mensaje:"Producto creado",producto});
 }catch(e){next(e)}
});

router.put("/:id",verificarToken,permitirRoles("ADMINISTRADOR","GERENTE","PRODUCTOR","INVENTARIO"),async(req,res,next)=>{
 try{
  const datos=schema.partial().parse(req.body);
  const producto=await prisma.producto.update({where:{id:req.params.id},data:datos});
  res.json({exito:true,mensaje:"Producto actualizado",producto});
 }catch(e){next(e)}
});

router.delete("/:id",verificarToken,permitirRoles("ADMINISTRADOR","GERENTE"),async(req,res,next)=>{
 try{
  await prisma.producto.delete({where:{id:req.params.id}});
  res.json({exito:true,mensaje:"Producto eliminado"});
 }catch(e){next(e)}
});

export default router;
