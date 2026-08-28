-- Esquema adaptado a la base de datos real del proyecto (tablas usuarios /
-- movimientos, definidas por el equipo de backend). Ejecutar completo en:
-- Supabase Dashboard > SQL Editor > New query > Run.
--
-- Esta base NO usa Supabase Auth (usuarios.id es int8, no uuid: es un login
-- 100% propio contra la tabla `usuarios`). Por eso TODO el acceso desde la
-- app pasa por funciones (RPC) con SECURITY DEFINER:
--   - Las tablas quedan con Row Level Security activado y SIN políticas,
--     así nadie puede leer/escribir la tabla directo con la anon key.
--   - Las funciones sí pueden (corren con privilegios del dueño), y son la
--     única puerta de entrada: login_usuario, registrar_usuario,
--     obtener_movimientos, crear_movimiento, editar_movimiento,
--     eliminar_movimiento, obtener_usuario.
--   - La contraseña se guarda con hash (pgcrypto) y se verifica en el
--     servidor; nunca se compara en texto plano desde el móvil.
--
-- Si `usuarios.contrasenia` ya tiene datos en texto plano, hay que
-- rehashearlos antes de usar login_usuario (ver el bloque comentado al
-- final de este archivo).

-- En Supabase, pgcrypto normalmente ya vive en el schema "extensions"
-- (no "public"), por eso las funciones que usan crypt()/gen_salt() abajo
-- fijan search_path = public, extensions.
create extension if not exists pgcrypto with schema extensions;

alter table public.usuarios enable row level security;
alter table public.movimientos enable row level security;
-- Sin "create policy": por defecto, RLS deniega todo acceso directo desde
-- PostgREST (anon/authenticated). Solo las funciones de abajo pueden pasar.

-- ============================================================
-- Registro
-- ============================================================
create or replace function public.registrar_usuario(
  p_nombre text,
  p_email text,
  p_password text
)
returns table (id bigint, nombre text, email text, rol text, saldo double precision)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_id bigint;
begin
  if exists (select 1 from usuarios u where u.email = p_email) then
    raise exception 'Ya existe una cuenta con este correo';
  end if;

  insert into usuarios (nombre, email, contrasenia, rol, saldo)
  values (p_nombre, p_email, crypt(p_password, gen_salt('bf')), 'CLIENTE', 0)
  returning usuarios.id into v_id;

  return query
    select u.id, u.nombre::text, u.email::text, u.rol::text, u.saldo
    from usuarios u
    where u.id = v_id;
end;
$$;

-- ============================================================
-- Login
-- ============================================================
create or replace function public.login_usuario(
  p_email text,
  p_password text
)
returns table (id bigint, nombre text, email text, rol text, saldo double precision)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  return query
    select u.id, u.nombre::text, u.email::text, u.rol::text, u.saldo
    from usuarios u
    where u.email = p_email
      and u.contrasenia = crypt(p_password, u.contrasenia);
end;
$$;

-- ============================================================
-- Perfil / saldo actual (para refrescar Home tras cada operación)
-- ============================================================
create or replace function public.obtener_usuario(p_usuario_id bigint)
returns table (id bigint, nombre text, email text, rol text, saldo double precision)
language sql
security definer
set search_path = public
as $$
  select u.id, u.nombre::text, u.email::text, u.rol::text, u.saldo
  from usuarios u
  where u.id = p_usuario_id;
$$;

-- ============================================================
-- Movimientos
-- ============================================================
create or replace function public.obtener_movimientos(p_usuario_id bigint)
returns setof movimientos
language sql
security definer
set search_path = public
as $$
  select *
  from movimientos
  where id_usuario = p_usuario_id
  order by fecha desc, id desc;
$$;

create or replace function public.obtener_movimiento(p_movimiento_id bigint, p_usuario_id bigint)
returns movimientos
language sql
security definer
set search_path = public
as $$
  select *
  from movimientos
  where id = p_movimiento_id
    and id_usuario = p_usuario_id;
$$;

create or replace function public.crear_movimiento(
  p_usuario_id bigint,
  p_tipo text,
  p_monto numeric,
  p_descripcion text
)
returns movimientos
language plpgsql
security definer
set search_path = public
as $$
declare
  v_mov movimientos;
  v_saldo_actual double precision;
begin
  if p_tipo not in ('DEPOSITO', 'RETIRO') then
    raise exception 'Tipo de movimiento inválido';
  end if;
  if p_monto <= 0 then
    raise exception 'El monto debe ser mayor que cero';
  end if;

  select saldo into v_saldo_actual from usuarios where id = p_usuario_id;
  if v_saldo_actual is null then
    raise exception 'Usuario no encontrado';
  end if;
  if p_tipo = 'RETIRO' and v_saldo_actual < p_monto then
    raise exception 'Saldo insuficiente. Disponible: $%', to_char(v_saldo_actual, 'FM999999990.00');
  end if;

  insert into movimientos (descripcion, fecha, monto, tipo, id_usuario)
  values (p_descripcion, current_date, p_monto, p_tipo, p_usuario_id)
  returning * into v_mov;

  update usuarios
  set saldo = saldo + (case when p_tipo = 'DEPOSITO' then p_monto else -p_monto end)
  where id = p_usuario_id;

  return v_mov;
end;
$$;

create or replace function public.editar_movimiento(
  p_movimiento_id bigint,
  p_usuario_id bigint,
  p_tipo text,
  p_monto numeric,
  p_descripcion text
)
returns movimientos
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old movimientos;
  v_new movimientos;
  v_saldo_actual double precision;
  v_saldo_sin_movimiento double precision;
begin
  if p_tipo not in ('DEPOSITO', 'RETIRO') then
    raise exception 'Tipo de movimiento inválido';
  end if;
  if p_monto <= 0 then
    raise exception 'El monto debe ser mayor que cero';
  end if;

  select * into v_old
  from movimientos
  where id = p_movimiento_id and id_usuario = p_usuario_id;

  if v_old.id is null then
    raise exception 'Movimiento no encontrado';
  end if;

  select saldo into v_saldo_actual from usuarios where id = p_usuario_id;

  -- Saldo si se deshace el efecto del movimiento original.
  v_saldo_sin_movimiento := v_saldo_actual -
    (case when v_old.tipo = 'DEPOSITO' then v_old.monto else -v_old.monto end);

  if p_tipo = 'RETIRO' and v_saldo_sin_movimiento < p_monto then
    raise exception 'Saldo insuficiente. Disponible: $%', to_char(v_saldo_sin_movimiento, 'FM999999990.00');
  end if;

  update movimientos
  set tipo = p_tipo, monto = p_monto, descripcion = p_descripcion
  where id = p_movimiento_id
  returning * into v_new;

  update usuarios
  set saldo = v_saldo_sin_movimiento + (case when p_tipo = 'DEPOSITO' then p_monto else -p_monto end)
  where id = p_usuario_id;

  return v_new;
end;
$$;

create or replace function public.eliminar_movimiento(
  p_movimiento_id bigint,
  p_usuario_id bigint
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old movimientos;
begin
  select * into v_old
  from movimientos
  where id = p_movimiento_id and id_usuario = p_usuario_id;

  if v_old.id is null then
    raise exception 'Movimiento no encontrado';
  end if;

  delete from movimientos where id = p_movimiento_id;

  update usuarios
  set saldo = saldo - (case when v_old.tipo = 'DEPOSITO' then v_old.monto else -v_old.monto end)
  where id = p_usuario_id;
end;
$$;

-- ============================================================
-- Permisos: la anon key solo puede EJECUTAR estas funciones,
-- nunca leer/escribir las tablas directamente (RLS sin políticas lo impide).
-- ============================================================
grant execute on function
  public.registrar_usuario(text, text, text),
  public.login_usuario(text, text),
  public.obtener_usuario(bigint),
  public.obtener_movimientos(bigint),
  public.obtener_movimiento(bigint, bigint),
  public.crear_movimiento(bigint, text, numeric, text),
  public.editar_movimiento(bigint, bigint, text, numeric, text),
  public.eliminar_movimiento(bigint, bigint)
to anon, authenticated;

-- ============================================================
-- SOLO SI `usuarios.contrasenia` ya tiene valores en texto plano:
-- ejecutar UNA vez para rehashearlos, luego borrar/ignorar este bloque.
-- ============================================================
-- update usuarios set contrasenia = crypt(contrasenia, gen_salt('bf'));
