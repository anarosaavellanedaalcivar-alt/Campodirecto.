import jwt from "jsonwebtoken";

export function verificarToken(req,res,next){
  const header=req.headers.authorization;
  if(!header || !header.startsWith("Bearer ")) return res.status(401).json({exito:false,mensaje:"Token no proporcionado"});
  try{
    req.usuario=jwt.verify(header.split(" ")[1],process.env.JWT_SECRET);
    next();
  }catch{
    return res.status(401).json({exito:false,mensaje:"Token inválido o expirado"});
  }
}

export function permitirRoles(...roles){
  return (req,res,next)=>{
    if(!roles.includes(req.usuario.rol)) return res.status(403).json({exito:false,mensaje:"No tienes permisos"});
    next();
  };
}
