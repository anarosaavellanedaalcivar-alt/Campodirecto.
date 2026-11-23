import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import inventarioRoutes from "./routes/inventario.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import exportacionesRoutes from "./routes/exportaciones.routes.js";
import preciosRoutes from "./routes/precios.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>res.json({nombre:"CampoDirecto API",version:"1.0.0",estado:"activo",mensaje:"Del productor al mundo, sin fronteras."}));

app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/comercio-exterior", exportacionesRoutes);
app.use("/api/precios", preciosRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log(`CampoDirecto API en http://localhost:${PORT}`));
