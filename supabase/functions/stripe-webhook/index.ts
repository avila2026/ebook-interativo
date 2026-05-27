// supabase/functions/stripe-webhook/index.ts
//
// PLACEHOLDER / ESTRUTURA — Webhook da Stripe que libera o acesso vitalício.
// Só passa a valer quando você criar a conta Stripe e fizer o deploy:
//
//   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
//   supabase functions deploy stripe-webhook --no-verify-jwt
//
// Depois cadastre a URL da função em https://dashboard.stripe.com/webhooks
// ouvindo o evento "checkout.session.completed".
//
// Fluxo: pagamento aprovado -> Stripe chama este webhook -> gravamos
// purchases.lifetime_access = true (acesso_vitalicio) usando a service_role.
// É a ÚNICA forma segura de liberar acesso (o navegador nunca grava aqui).

import Stripe from 'https://esm.sh/stripe@14?target=denonext';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

// service_role: ignora RLS para poder gravar a compra do usuário.
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret);
  } catch (err) {
    return new Response(`Webhook inválido: ${(err as Error).message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // client_reference_id é preenchido pelo front (startCheckout) com o user.id.
    const userId = session.client_reference_id;
    if (userId) {
      const { error } = await supabase.from('purchases').upsert({
        user_id: userId,
        lifetime_access: true,
        status: 'paid',
        stripe_session_id: session.id,
        amount: session.amount_total ?? null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if (error) console.error('Falha ao gravar compra:', error.message);
    } else {
      // Sem usuário logado: registre como lead para reconciliar pelo e-mail depois.
      const email = session.customer_details?.email;
      if (email) await supabase.from('leads').insert({ email, source: 'stripe-checkout' });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
