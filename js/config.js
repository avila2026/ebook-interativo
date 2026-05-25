// js/config.js
// Configuração central das integrações (Supabase + Stripe).
//
// COMO ATIVAR:
// 1. Crie um projeto em https://supabase.com e cole a URL e a chave "anon public".
// 2. (Opcional, para vender acesso) Crie um Payment Link no Stripe e cole abaixo.
// 3. Rode o SQL em supabase/schema.sql no editor SQL do Supabase.
//
// Enquanto os campos abaixo estiverem vazios, as integrações ficam DESLIGADAS
// e o ebook funciona normalmente (progresso/diários no localStorage, tudo liberado).
// Não coloque aqui NENHUMA chave secreta — apenas chaves públicas (anon / publishable).

window.APP_CONFIG = {
  supabase: {
    url: 'https://qrjhgcibcwclcjrgrlgp.supabase.co',
    anonKey: ''     // chave "anon public" (segura para o navegador, protegida por RLS)
  },

  stripe: {
    // Modo placeholder: ao preencher um Payment Link, o botão de compra passa a
    // redirecionar para o checkout hospedado da Stripe. Sem backend necessário.
    publishableKey: '',   // pk_live_... ou pk_test_... (opcional, p/ Stripe.js no futuro)
    paymentLink: '',      // ex.: https://buy.stripe.com/xxxxxxxx
    priceLabel: 'R$ 49,90' // texto exibido no paywall
  },

  // Capítulos que exigem acesso pago. Vazio = nada bloqueado.
  // Só passa a valer quando o Supabase estiver configurado.
  premiumChapters: [],

  // Domínios externos usados (mantidos em sincronia com a CSP do index.html).
  // Apenas informativo/documental.
  allowedOrigins: {
    supabase: 'https://*.supabase.co',
    stripe: 'https://js.stripe.com'
  }
};

// Flags derivadas (não editar).
window.APP_CONFIG.supabase.enabled = Boolean(
  window.APP_CONFIG.supabase.url && window.APP_CONFIG.supabase.anonKey
);
window.APP_CONFIG.stripe.enabled = Boolean(window.APP_CONFIG.stripe.paymentLink);
