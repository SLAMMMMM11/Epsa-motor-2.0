-- ============================================================
-- EPSA Motor · esquema de leads
-- Pegar en Supabase → SQL Editor → Run
-- ============================================================
--
-- Una sola tabla para los dos orígenes (cotización y cita). Todo lo que sale
-- de la web hacia WhatsApp queda aquí, y el panel de administración lo lista
-- junto con un filtro por tipo.

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  tipo          text not null check (tipo in ('cotizacion', 'cita')),

  -- datos del cliente
  nombre        text not null,
  telefono      text not null,

  -- comunes a ambos tipos
  modelo        text,
  comentario    text,

  -- solo cotización
  distrito      text,
  forma_compra  text,

  -- solo cita
  sede          text,
  fecha         date,
  hora          text,
  motivo        text,

  -- gestión interna: lo actualiza el asesor desde el panel
  estado        text not null default 'nuevo'
                check (estado in ('nuevo', 'contactado', 'confirmado', 'cerrado', 'perdido')),
  notas_admin   text,

  origen        text not null default 'web',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- El panel ordena por fecha y filtra por estado y tipo.
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_estado_idx     on public.leads (estado);
create index if not exists leads_tipo_idx       on public.leads (tipo);

-- updated_at automático al modificar el estado desde el panel.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row
  execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Seguridad
-- ------------------------------------------------------------
-- RLS activado y SIN políticas: con la clave pública (anon) nadie puede leer
-- ni escribir. Solo la service_role, que se usa desde la función serverless,
-- pasa por encima de RLS. La tabla guarda nombres y teléfonos, así que el
-- criterio es denegar por defecto.

alter table public.leads enable row level security;
