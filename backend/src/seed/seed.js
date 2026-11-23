import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma=new PrismaClient();

async function main(){
 const password=await bcrypt.hash("CampoDirecto2026",10);
 await prisma.usuario.upsert({where:{email:"admin@campodirecto.ec"},update:{},create:{nombre:"Administrador CampoDirecto",email:"admin@campodirecto.ec",password,rol:"ADMINISTRADOR"}});
 const productor=await prisma.usuario.upsert({where:{email:"productor@campodirecto.ec"},update:{},create:{nombre:"Finca El Cacao Dorado",email:"productor@campodirecto.ec",password,rol:"PRODUCTOR"}});
 const cliente=await prisma.cliente.create({data:{nombre:"Supermercados Andinos",tipoCliente:"SUPERMERCADO",pais:"Ecuador",ciudad:"Quito",email:"compras@andinos.ec",clasificacion:"MAYORISTA"}});
 const cacao=await prisma.producto.create({data:{sku:"CAC-NAC-001",nombre:"Cacao Nacional",descripcion:"Cacao fino de aroma para mercados nacionales e internacionales.",categoria:"Exportación",unidadMedida:"Quintal",precioCompra:2500,precioVenta:2970,stockActual:80,stockMinimo:20,stockMaximo:200,calidad:"Premium fermentado",temporadaCosecha:"Todo el año",disponibleNacional:true,disponibleExportacion:true,productorId:productor.id,codigoQR:"CD-CACAO-2026-001"}});
 await prisma.lote.create({data:{codigoLote:"CD-CACAO-2026-001",productoId:cacao.id,cantidad:80,almacen:"Centro de acopio Guayaquil",trazabilidadQR:"CD-CACAO-2026-001"}});
 await prisma.precioMercado.create({data:{producto:"Cacao seco",mercado:"Mercado mayorista demostrativo",pais:"Ecuador",provincia:"Guayas",unidad:"Quintal",precioMinimo:2850,precioPromedio:2970,precioMaximo:3100,variacion:2.4,fuente:"Datos de demostración CampoDirecto",esDemostrativo:true}});
 await prisma.pedido.create({data:{codigo:"CD-1024",clienteId:cliente.id,tipo:"B2B",estado:"PENDIENTE",total:5940,detalles:{create:[{productoId:cacao.id,cantidad:2,precioUnitario:2970,subtotal:5940}]}}});
 console.log("Datos de demostración creados correctamente.");
}

main().then(()=>prisma.$disconnect()).catch(e=>{console.error(e);prisma.$disconnect();process.exit(1);});
