-- Schema inicial derivado del data model borrador en docs/spec.md.
-- No aplicado a ningun proyecto Supabase; correr con `supabase db push`
-- (o `mcp__Supabase__apply_migration`) una vez que exista un proyecto real.

create table if not exists cliente (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  talles jsonb not null default '{}',
  estilo_preferido text[] not null default '{}',
  colores_evitar text[] not null default '{}',
  marcas_favoritas text[] not null default '{}',
  fotos_referencia text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists proyecto (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references cliente(id) on delete cascade,
  ocasion text not null check (ocasion in ('trabajo', 'cita', 'evento_especial', 'casual', 'otro')),
  fecha_evento date not null,
  presupuesto_min numeric(12, 2) not null,
  presupuesto_max numeric(12, 2) not null,
  prioridad text not null check (prioridad in ('precio', 'calidad', 'balance')),
  estado text not null default 'borrador' check (
    estado in ('borrador', 'lookbook', 'refinamiento', 'propuesta', 'autorizacion', 'compra', 'entrega', 'cerrado')
  ),
  created_at timestamptz not null default now(),
  check (presupuesto_max >= presupuesto_min)
);

create table if not exists look (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references proyecto(id) on delete cascade,
  precio_total numeric(12, 2) not null default 0,
  fuente text not null check (fuente in ('ai', 'shopper')),
  estado text not null default 'sugerido' check (
    estado in ('sugerido', 'favorito', 'descartado', 'aprobado')
  ),
  created_at timestamptz not null default now()
);

create table if not exists item (
  id uuid primary key default gen_random_uuid(),
  look_id uuid not null references look(id) on delete cascade,
  producto text not null,
  tienda text not null,
  precio numeric(12, 2) not null,
  url text,
  foto text,
  estado text not null default 'pendiente' check (
    estado in ('pendiente', 'comprado', 'no_disponible')
  ),
  created_at timestamptz not null default now()
);

create table if not exists autorizacion_pago (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references proyecto(id) on delete cascade,
  monto_tope numeric(12, 2) not null,
  medio_pago text not null,
  estado text not null default 'preautorizado' check (
    estado in ('preautorizado', 'capturado', 'liberado')
  ),
  fecha timestamptz not null default now()
);

create table if not exists compra (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references proyecto(id) on delete cascade,
  items_comprados uuid[] not null default '{}',
  monto_real numeric(12, 2) not null,
  comprobantes text[] not null default '{}',
  fecha timestamptz not null default now()
);

create index if not exists idx_proyecto_cliente on proyecto(cliente_id);
create index if not exists idx_look_proyecto on look(proyecto_id);
create index if not exists idx_item_look on item(look_id);
create index if not exists idx_autorizacion_proyecto on autorizacion_pago(proyecto_id);
create index if not exists idx_compra_proyecto on compra(proyecto_id);
