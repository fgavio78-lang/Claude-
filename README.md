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

El flujo completo es funcional de punta a punta usando un estado local en el
navegador (React Context persistido en `localStorage`, ver
`src/lib/store/StoreContext.tsx`) en lugar de un backend real:

- Onboarding y "Nuevo proyecto" guardan datos reales y crean el proyecto.
- El Lookbook genera looks con una heurística local basada en reglas
  (`src/lib/aiMock.ts` + catálogo en `src/lib/catalog.ts`) — **no** es un
  modelo de IA real, es un stand-in determinístico que combina prendas de un
  catálogo fijo según presupuesto/estilo/prioridad.
- Favoritos, descartes, comentarios, regeneración de variantes, elección de
  la propuesta final, preautorización, ejecución de compra ítem por ítem,
  tracking y feedback actualizan ese mismo estado y se reflejan en toda la
  navegación.

Lo que **no** está integrado porque requiere credenciales/cuentas externas
que no están disponibles en este entorno:

- Un proyecto Supabase real (el schema SQL y los helpers de cliente están
  listos en `supabase/` y `src/lib/supabase/`, pero no hay una base de datos
  provisionada — todo vive en `localStorage` por ahora).
- Generación de looks con un modelo de IA real (hoy usa la heurística local
  mencionada arriba).
- Preautorización de pago real con Mercado Pago (la pantalla de autorización
  simula el hold localmente, sin tocar una pasarela de pago).

Cada uno de estos puntos está señalado con comentarios en el código donde
correspondería conectar la integración real.

## Estructura

```
docs/spec.md                          Especificación de producto
supabase/migrations/0001_init.sql     Schema SQL derivado del data model
src/types/domain.ts                   Tipos TS del data model
src/lib/supabase/{client,server}.ts   Helpers de cliente Supabase (browser/server)
src/lib/catalog.ts                    Catálogo local de productos (placeholder)
src/lib/aiMock.ts                     Heurística local que reemplaza a la IA real
src/lib/store/StoreContext.tsx        Estado de la app (Context + localStorage)
src/lib/mockData.ts                   Datos semilla del proyecto de ejemplo "demo"
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

Abrí [http://localhost:3000](http://localhost:3000) y creá un proyecto desde
cero, o segui el proyecto de ejemplo "demo" ya seedeado. El estado persiste
en `localStorage`, así que recargar la página no lo pierde.

## Próximos pasos (requieren credenciales externas)

- Provisionar un proyecto Supabase real, aplicar `supabase/migrations/0001_init.sql`,
  y reemplazar `StoreContext.tsx` por lecturas/escrituras reales contra esa base.
- Integrar generación de looks con un modelo de IA real en lugar de la
  heurística de `aiMock.ts`.
- Integrar preautorización de pago real (Mercado Pago) en la pantalla de
  Autorización, en lugar del mock local.
