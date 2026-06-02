// supabase/functions/cakto-webhook/index.ts
//
// Webhook (postback) da Cakto que libera acesso vitalício ao ebook.
//
// Deploy:
//   supabase secrets set CAKTO_WEBHOOK_SECRET=um_token_aleatorio_forte
//   supabase functions deploy cakto-webhook --no-verify-jwt
//
// No painel da Cakto, cadastre um postback apontando para:
//   https://<projeto>.supabase.co/functions/v1/cakto-webhook?secret=um_token_aleatorio_forte
//
// Fluxo: compra aprovada -> Cakto chama este webhook -> gravamos
// purchases.lifetime_access = true usando a service_role (única forma segura
// de liberar acesso; o navegador nunca grava aqui).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const WEBHOOK_SECRET = Deno.env.get('CAKTO_WEBHOOK_SECRET') ?? '';

// service_role: ignora RLS para gravar a compra do usuário.
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Status da Cakto que devem liberar o acesso.
const PAID_STATUSES = new Set([
  'paid', 'approved', 'aprovado', 'aprovada',
  'purchase.approved', 'compra_aprovada', 'completed',
]);

function pickStatus(payload: Record<string, unknown>): string {
  const candidates = [
    payload.status, payload.event, payload.type,
    (payload as any).data?.status, (payload as any).transaction?.status,
  ];
  for (const c of candidates) {
    if (typeof c === 'string') return c.toLowerCase();
  }
  return '';
}

function pickRef(payload: Record<string, unknown>): string | null {
  const candidates = [
    payload.ref,
    payload.external_reference,
    payload.client_reference_id,
    (payload as any).data?.ref,
    (payload as any).data?.external_reference,
    (payload as any).customer?.external_reference,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.length > 0) return c;
  }
  return null;
}

function pickEmail(payload: Record<string, unknown>): string | null {
  const candidates = [
    (payload as any).customer?.email,
    (payload as any).buyer?.email,
    (payload as any).data?.customer?.email,
    payload.email,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.includes('@')) return c.toLowerCase();
  }
  return null;
}

function pickTransactionId(payload: Record<string, unknown>): string | null {
  const candidates = [
    payload.transaction_id, payload.id,
    (payload as any).transaction?.id,
    (payload as any).data?.id,
    (payload as any).data?.transaction_id,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' || typeof c === 'number') return String(c);
  }
  return null;
}

// Armazena o valor recebido tal como veio da Cakto, apenas arredondando para
// inteiro. A Cakto envia o valor em centavos (padrão de gateways brasileiros),
// o que casa com o schema da coluna `purchases.amount`. Se a documentação da
// Cakto mudar (passar a enviar reais com casas decimais), ajustar AQUI de forma
// explícita — nunca inferir a unidade pelo tamanho do número (risco grave de
// inconsistência financeira).
function pickAmount(payload: Record<string, unknown>): number | null {
  const candidates = [
    payload.amount, payload.value,
    (payload as any).transaction?.amount,
    (payload as any).data?.amount,
  ];
  for (const c of candidates) {
    if (typeof c === 'number' && Number.isFinite(c)) return Math.round(c);
    if (typeof c === 'string' && c.trim() !== '') {
      const n = Number(c);
      if (Number.isFinite(n)) return Math.round(n);
    }
  }
  return null;
}

Deno.serve(async (req) => {
  // Autenticação simples por token compartilhado (header ou query string).
  const url = new URL(req.url);
  const token = req.headers.get('x-cakto-signature')
    || req.headers.get('x-webhook-secret')
    || url.searchParams.get('secret')
    || '';
  if (!WEBHOOK_SECRET || token !== WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return new Response('Invalid JSON body', { status: 400 });
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const status = pickStatus(payload);
  if (!PAID_STATUSES.has(status)) {
    // Ignora eventos que não confirmam pagamento (refund, pending, etc.).
    return new Response(JSON.stringify({ received: true, ignored: status }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const userId = pickRef(payload);
  const email = pickEmail(payload);
  const transactionId = pickTransactionId(payload);
  const amount = pickAmount(payload);

  if (userId) {
    const { error } = await supabase.from('purchases').upsert({
      user_id: userId,
      lifetime_access: true,
      status: 'paid',
      cakto_transaction_id: transactionId,
      amount,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    if (error) {
      console.error('Falha ao gravar compra:', error.message);
      return new Response(`DB error: ${error.message}`, { status: 500 });
    }
  } else if (email) {
    // Sem user.id (compra feita sem login): registra para reconciliar pelo e-mail.
    await supabase.from('leads').insert({ email, source: 'cakto-checkout' });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
