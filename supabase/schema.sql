-- Esquema de la app móvil bancaria.
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query > Run.
-- La autenticación (usuarios, contraseñas, JWT) la maneja Supabase Auth
-- automáticamente; aquí solo se crea la tabla de movimientos y la función
-- de saldo.

create table if not exists public.movimientos (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tipo text not null check (tipo in ('DEPOSITO', 'RETIRO')),
  monto numeric(12, 2) not null check (monto > 0),
  descripcion text not null,
  fecha timestamptz not null default now()
);

create index if not exists movimientos_user_id_idx on public.movimientos (user_id);

-- Row Level Security: cada usuario solo puede ver/crear/editar/eliminar
-- SUS PROPIOS movimientos. Sin esto, cualquier usuario autenticado podría
-- leer los movimientos de todos los demás.
alter table public.movimientos enable row level security;

create policy "Los usuarios ven sus propios movimientos"
  on public.movimientos for select
  using (auth.uid() = user_id);

create policy "Los usuarios crean sus propios movimientos"
  on public.movimientos for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios actualizan sus propios movimientos"
  on public.movimientos for update
  using (auth.uid() = user_id);

create policy "Los usuarios eliminan sus propios movimientos"
  on public.movimientos for delete
  using (auth.uid() = user_id);

-- Saldo calculado en el servidor (Postgres), nunca de forma independiente
-- en el móvil: depósitos suman, retiros restan, solo del usuario autenticado.
create or replace function public.get_saldo()
returns numeric
language sql
security definer
set search_path = public
as $$
  select coalesce(
    sum(case when tipo = 'DEPOSITO' then monto else -monto end),
    0
  )
  from public.movimientos
  where user_id = auth.uid();
$$;
