-- Migration: adicionar suporte ao webhook da Cakto na tabela `purchases`.
-- Rode este SQL uma vez no SQL Editor do Supabase.
--
-- A coluna `stripe_session_id` é mantida por compatibilidade histórica
-- (pode ficar NULL para compras feitas via Cakto).

alter table public.purchases
  add column if not exists cakto_transaction_id text;

create index if not exists purchases_cakto_transaction_id_idx
  on public.purchases (cakto_transaction_id);
