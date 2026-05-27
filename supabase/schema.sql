-- =====================================================================
-- Mounjaro sem Mitos — Esquema do banco (Supabase / PostgreSQL)
-- Rode este arquivo no SQL Editor do Supabase (uma vez).
-- Tudo protegido por Row Level Security (RLS): a chave "anon" do navegador
-- só consegue ler/gravar dados do próprio usuário autenticado.
-- =====================================================================

-- ---------------------------------------------------------------------
-- PERFIS  (1 linha por usuário, criada automaticamente no cadastro)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "perfil_proprio_select" on public.profiles;
create policy "perfil_proprio_select" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "perfil_proprio_upsert" on public.profiles;
create policy "perfil_proprio_upsert" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "perfil_proprio_update" on public.profiles;
create policy "perfil_proprio_update" on public.profiles
  for update using (auth.uid() = id);

-- Cria o perfil automaticamente quando um usuário é registrado no Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- ESTADO DO USUÁRIO  (KV: progresso de leitura, diários de peso/sintomas)
-- key ∈ ('completed', 'weights', 'symptoms') — valores em JSON.
-- ---------------------------------------------------------------------
create table if not exists public.user_state (
  user_id     uuid not null references auth.users(id) on delete cascade,
  key         text not null,
  value       jsonb not null default '[]'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.user_state enable row level security;

drop policy if exists "estado_proprio_all" on public.user_state;
create policy "estado_proprio_all" on public.user_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- PROGRESSO GRANULAR  (vídeos / conteúdos individuais, por content_id)
-- ---------------------------------------------------------------------
create table if not exists public.user_progress (
  user_id     uuid not null references auth.users(id) on delete cascade,
  content_id  text not null,
  progress    numeric not null default 0,   -- segundos assistidos (ou % de leitura)
  completed   boolean not null default false,
  updated_at  timestamptz not null default now(),
  primary key (user_id, content_id)
);

alter table public.user_progress enable row level security;

drop policy if exists "progresso_proprio_all" on public.user_progress;
create policy "progresso_proprio_all" on public.user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- LEADS  (captura de e-mails — qualquer visitante pode se inscrever)
-- Inserção liberada para anon/autenticado; leitura só via painel/admin.
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  name        text,
  source      text default 'site',
  created_at  timestamptz not null default now()
);

alter table public.leads enable row level security;

drop policy if exists "leads_insert_publico" on public.leads;
create policy "leads_insert_publico" on public.leads
  for insert to anon, authenticated with check (true);
-- (Sem policy de SELECT: leads só são visíveis pela service_role / painel Supabase.)

-- ---------------------------------------------------------------------
-- COMPRAS / ACESSO PAGO  (acesso vitalício liberado pelo webhook Stripe)
-- O cliente só PODE LER a própria linha. A gravação é feita pela
-- service_role (Edge Function do webhook), nunca pelo navegador.
-- ---------------------------------------------------------------------
create table if not exists public.purchases (
  user_id            uuid primary key references auth.users(id) on delete cascade,
  product            text default 'ebook-mounjaro',
  lifetime_access    boolean not null default false,   -- acesso_vitalicio
  status             text not null default 'pending',  -- pending | paid | refunded
  stripe_session_id  text,
  amount             integer,                           -- em centavos
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.purchases enable row level security;

drop policy if exists "compra_propria_select" on public.purchases;
create policy "compra_propria_select" on public.purchases
  for select using (auth.uid() = user_id);
-- (Sem insert/update para o cliente: liberação de acesso é responsabilidade do webhook.)

-- =====================================================================
-- TESTE MANUAL (opcional): liberar acesso a um usuário pelo painel.
--   update public.purchases set lifetime_access = true, status = 'paid'
--   where user_id = 'UUID-DO-USUARIO';
-- Se ainda não existir a linha:
--   insert into public.purchases (user_id, lifetime_access, status)
--   values ('UUID-DO-USUARIO', true, 'paid');
-- =====================================================================
