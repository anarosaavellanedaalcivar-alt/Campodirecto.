# CampoDirecto — Del productor al mundo, sin fronteras

Plataforma empresarial integral para comercialización agrícola nacional e internacional del Ecuador.

## Instalación

### Backend

cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run seed
npm run dev

### Frontend

cd frontend
npm install
npm run dev

## Variables

DATABASE_URL=postgresql://campodirecto:campodirecto@localhost:5432/campodirecto?schema=public
JWT_SECRET=cambia_esta_clave_en_produccion
PORT=4000
VITE_API_URL=http://localhost:4000/api

## Datos demostrativos

Usuario: admin@campodirecto.ec
Contraseña: CampoDirecto2026

Los precios y registros iniciales son datos de demostración y no constituyen cotizaciones reales.
