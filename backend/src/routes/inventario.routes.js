import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { verificarToken, permitirRoles } from "../middleware/auth.js";

const router=Router();
const schema=z.object({productoId:z.string(),tipo:z.enum(["ENTRADA","SALIDA","AJUSTE","MERMA"]),cantidad:z.number().positive(),motivo:z.string().min(3),almacen:z.string().min(3)});

router.get("/",verificarToken,async(req,res,next)=>{
 try{
  const productos=await prisma.producto.findMany({include:{movimientos:{orderBy:{createdAt:"desc"},take:10}}});
  const alertas=productos.filter(p=>p.stockActual<=p.stockMinimo).map(p=>({producto:p.nombre,sku:p.sku,stockActual:p.stockActual,stockMinimo:p.stockMinimo,mensaje:"Stock bajo o agotado"}));
  res.json({exito:true,inventario:productos,alertas});
 }catch(e){next(e)}
});

router.post("/movimiento",verificarToken,permitirRoles("ADMINISTRADOR","GERENTE","INVENTARIO","PRODUCTOR"),async(req,res,next)=>{
 try{
  const datos=schema.parse(req.body);
  const producto=await prisma.producto.findUnique({where:{id:datos.productoId}});
  if(!producto) return res.status(404).json({exito:false,mensaje:"Producto no encontrado"});
  let nuevoStock=producto.stockActual;
  if(datos.tipo==="ENTRADA") nuevoStock+=datos.cantidad;
  if(datos.tipo==="SALIDA"||datos.tipo==="MERMA"){
   if(datos.cantidad>producto.stockActual) return res.status(400).json({exito:false,mensaje:"Cantidad superior al stock disponible"});
   nuevoStock-=datos.cantidad;
  }
  const [movimiento,productoActualizado]=await prisma.$transaction([
   prisma.movimientoInventario.create({data:{...datos,usuarioId:req.usuario.id}}),
   prisma.producto.update({where:{id:producto.id},data:{stockActual:nuevoStock}})
  ]);
  res.status(201).json({exito:true,mensaje:"Movimiento registrado",movimiento,stockActual:productoActualizado.stockActual});
 }catch(e){next(e)}
});

export default router;
