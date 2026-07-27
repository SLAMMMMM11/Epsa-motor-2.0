-- ============================================================
-- EPSA Motor · leads de la web
-- Pegar en Supabase → SQL Editor → Run
-- ============================================================
--
-- La tabla public.leads ya existía, diseñada para evaluación crediticia
-- (dni, ingreso_mensual, codigo_descuento). Esta migración es ADITIVA: añade
-- lo que necesitan los formularios de la web sin tocar ni borrar nada de lo
-- que ya está. Es idempotente, se puede ejecutar varias veces.

-- ------------------------------------------------------------
-- 1. Columnas nuevas
-- ------------------------------------------------------------
-- tipo distingue el origen del lead: el dock flotante (cotizacion) o el
-- formulario de visita (cita). El panel filtra por este campo.
alter table public.leads add column if not exists tipo         text;

-- Nombre del modelo tal como lo muestra la web. Se guarda como texto y no
-- como referencia a vehiculos porque el catálogo vive en src/data.ts y los
-- dos no coinciden todavía. modelo_interes_id queda disponible para cuando
-- se unifiquen.
alter table public.leads add column if not exists modelo       text;

alter table public.leads add column if not exists comentario   text;

-- Solo cotización
alter table public.leads add column if not exists distrito     text;
alter table public.leads add column if not exists forma_compra text;

-- Solo cita
alter table public.leads add column if not exists sede         text;
alter table public.leads add column if not exists fecha        date;
alter table public.leads add column if not exists hora         text;
alter table public.leads add column if not exists motivo       text;

-- ------------------------------------------------------------
-- 2. Relajar campos del diseño crediticio
-- ------------------------------------------------------------
-- Los formularios de la web no piden DNI ni ingresos: nadie va a dejar su
-- DNI para pedir una cotización. Si estas columnas fueran obligatorias, todo
-- lead de la web sería rechazado.
alter table public.leads alter column dni               drop not null;
alter table public.leads alter column ingreso_mensual   drop not null;
alter table public.leads alter column modelo_interes_id drop not null;
alter table public.leads alter column codigo_descuento  drop not null;

-- ------------------------------------------------------------
-- 3. Índices para el panel de administración
-- ------------------------------------------------------------
create index if not exists leads_fecha_registro_idx on public.leads (fecha_registro desc);
create index if not exists leads_estado_idx         on public.leads (estado);
create index if not exists leads_tipo_idx           on public.leads (tipo);

-- ------------------------------------------------------------
-- 4. Seguridad
-- ------------------------------------------------------------
-- La tabla guarda nombres, teléfonos y DNI. Con RLS activado y sin políticas
-- permisivas, la clave pública (anon) no puede leer ni escribir nada; solo la
-- service_role, que se usa desde la función serverless. Denegar por defecto.
alter table public.leads enable row level security;

-- Comprobación: esta consulta debe devolver 0 filas.
-- Si devuelve alguna, hay una política que abre la tabla y hay que revisarla.
--   select policyname, cmd, roles
--   from pg_policies
--   where schemaname = 'public' and tablename = 'leads';
