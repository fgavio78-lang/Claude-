# Personal Shopper

Scaffold de una app de "personal shopper": un cliente define ocasión y
presupuesto, recibe sugerencias de looks generadas por AI, el shopper cura
una propuesta final, el cliente preautoriza el pago, y el shopper ejecuta la
compra.

La especificación completa de producto (flujos, pantallas y data model
borrador) está en [`docs/spec.md`](docs/spec.md).

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) como backend (Postgres + Auth)

## Estado actual

Este scaffold cubre la navegación y el layout de las 9 pantallas del flujo,
con datos de ejemplo en `src/lib/mockData.ts` para poder recorrerlo sin un
backend conectado. Todavía no está conectado a un proyecto Supabase real ni
implementa lógica de negocio (generación AI de looks, preautorización real
con Mercado Pago, etc.) — cada pantalla señala con comentarios `TODO` dónde
falta esa integración.

## Estructura

```
docs/spec.md                          Especificación de producto
supabase/migrations/0001_init.sql     Schema SQL derivado del data model
src/types/domain.ts                   Tipos TS del data model
src/lib/supabase/{client,server}.ts   Helpers de cliente Supabase (browser/server)
src/lib/mockData.ts                   Datos de ejemplo para navegar el flujo
src/lib/flow.ts                       Metadata de las 9 pantallas (orden, rutas, actor)
src/components/                       NavBar, indicador de progreso, layout de pantalla
src/app/                              Rutas de las 9 pantallas (App Router)
```

### Rutas

| # | Pantalla | Ruta |
|---|----------|------|
| 1 | Onboarding — Perfil del cliente | `/onboarding` |
| 2 | Nuevo Proyecto — Ocasión + Presupuesto | `/proyectos/nuevo` |
| 3 | Lookbook AI | `/proyectos/[id]/lookbook` |
| 4 | Refinamiento | `/proyectos/[id]/refinamiento` |
| 5 | Propuesta Final | `/proyectos/[id]/propuesta` |
| 6 | Autorización de pago | `/proyectos/[id]/autorizacion` |
| 7 | Ejecución de compra (shopper) | `/shopper/proyectos/[id]/compra` |
| 8 | Confirmación y tracking | `/proyectos/[id]/tracking` |
| 9 | Post-entrega — Feedback | `/proyectos/[id]/feedback` |

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar con credenciales de un proyecto Supabase
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) — el proyecto de ejemplo
`demo` te deja recorrer el flujo completo con datos mock.

## Próximos pasos

- Provisionar un proyecto Supabase real y aplicar `supabase/migrations/0001_init.sql`.
- Reemplazar `mockData.ts` por lecturas/escrituras reales contra Supabase.
- Integrar generación de looks por AI en la pantalla de Lookbook.
- Integrar preautorización de pago (Mercado Pago) en la pantalla de Autorización.
