# Integrações — Supabase + Cakto

Guia para ativar **login/cadastro**, **sincronização de progresso**, **captura de leads**
e **acesso pago** no ebook. Enquanto nada for configurado, o site funciona normalmente
(progresso salvo no navegador, todo o conteúdo liberado).

---

## 1. Visão geral

| Recurso | Tecnologia | Estado |
|---|---|---|
| Login / Cadastro | Supabase Auth | ✅ pronto |
| Sincronizar progresso e diários | Supabase (`user_state`) | ✅ pronto |
| Progresso de vídeo | Supabase (`user_progress`) | ✅ pronto (helper) |
| Captura de leads | Supabase (`leads`) | ✅ pronto |
| Acesso pago (paywall) | Supabase (`purchases`) | ✅ pronto |
| Checkout de pagamento | Cakto (link de pagamento) | ✅ pronto |
| Liberação automática | Edge Function `cakto-webhook` | ✅ pronto |

Todas as chaves ficam em **`js/config.js`**. Não há nenhuma chave secreta no front —
apenas a URL do projeto e a chave `anon` (pública e protegida por RLS).

---

## 2. Configurar o Supabase

1. Crie um projeto em <https://supabase.com> (plano gratuito serve).
2. Em **Project Settings → API**, copie:
   - **Project URL** → `supabase.url`
   - **anon public** → `supabase.anonKey`
3. Cole em `js/config.js`:
   ```js
   supabase: {
     url: 'https://xxxxxxxx.supabase.co',
     anonKey: 'eyJhbGci...'
   }
   ```
4. Abra **SQL Editor**, cole o conteúdo de [`supabase/schema.sql`](../supabase/schema.sql) e rode.
   Isso cria as tabelas `profiles`, `user_state`, `user_progress`, `leads`, `purchases`
   já com Row Level Security.
5. Em **Authentication → Providers**, mantenha **Email** habilitado.
   - Para testar rápido, desative "Confirm email" em **Authentication → Sign In / Up**.

Pronto: o botão **👤 Entrar** aparece no topo, o progresso passa a sincronizar entre
dispositivos e o formulário de newsletter na barra lateral começa a gravar leads.

---

## 3. Acesso pago (paywall)

1. Defina quais capítulos são exclusivos em `js/config.js`:
   ```js
   premiumChapters: ['capitulo-9', 'capitulo-10', 'recursos-interativos']
   ```
2. Quem não tem acesso vê um **paywall** sobre o capítulo, com botão de compra.
3. O acesso é concedido gravando `purchases.lifetime_access = true` para o usuário.
   - **Teste manual** (sem Cakto): no SQL Editor, rode o exemplo comentado no fim de
     `schema.sql` com o `UUID` do usuário (veja em **Authentication → Users**).
   - **Produção**: o webhook da Cakto grava isso automaticamente (passo 4).

> Segurança: o navegador **só lê** a tabela `purchases`. A liberação é sempre feita
> pelo webhook com a `service_role`, então ninguém libera acesso pelo cliente.

---

## 4. Cakto (checkout + liberação automática)

### Configurar o link de pagamento
1. Crie um produto em <https://app.cakto.com.br> e gere um **link de pagamento**.
2. Cole em `js/config.js`:
   ```js
   cakto: {
     paymentLink: 'https://pay.cakto.com.br/xxxxxxxx',
     priceLabel: 'R$ 49,90'
   }
   ```
3. O botão "Comprar acesso" passa a redirecionar para o checkout da Cakto.
   O front anexa `?email=<email>` (pré-preenche o checkout) e `?ref=<user.id>`
   (referência externa que o webhook usa para casar a compra com o usuário).

### Liberação automática de acesso (webhook)

1. Rode no SQL Editor a migration `supabase/migrations/add_cakto_columns.sql`
   para adicionar a coluna `cakto_transaction_id` em `purchases`.
2. Configure o segredo do webhook e faça o deploy da Edge Function:
   ```bash
   supabase secrets set CAKTO_WEBHOOK_SECRET=um_token_aleatorio_forte
   supabase functions deploy cakto-webhook --no-verify-jwt
   ```
3. No painel da Cakto, cadastre um **postback / webhook** apontando para:
   ```
   https://<seu-projeto>.supabase.co/functions/v1/cakto-webhook?secret=um_token_aleatorio_forte
   ```
   ouvindo o evento de **compra aprovada** (`purchase.approved`).

O código do webhook está em [`supabase/functions/cakto-webhook/index.ts`](../supabase/functions/cakto-webhook/index.ts).

---

## 5. Adicionar vídeos com progresso

Coloque o arquivo em `assets/videos/` e use a tag `<video>` dentro do conteúdo
de um capítulo (em `js/data.js`):

```html
<div class="video-container">
  <video id="video-tirzepatida-01" controls playsinline preload="metadata"
         poster="assets/videos/thumb.jpg">
    <source src="assets/videos/explicacao-tirzepatida.mp4" type="video/mp4">
  </video>
</div>
```

Para salvar/retomar o progresso por usuário, registre o vídeo após o capítulo carregar:

```js
document.addEventListener('ebook:chapterloaded', () => {
  const v = document.getElementById('video-tirzepatida-01');
  if (v && window.Integrations) window.Integrations.trackVideo(v, 'video-tirzepatida-01');
});
```

O helper grava em `user_progress` (a cada 5s e ao terminar) e retoma de onde parou.

---

## 6. Content Security Policy

A CSP em `index.html` já libera os domínios necessários: `esm.sh` (SDK),
`*.supabase.co` (API/Auth/Realtime) e `pay.cakto.com.br` (frame opcional do checkout).
O redirecionamento de saída para a Cakto não exige liberação extra.
Se trocar de CDN ou domínio, ajuste a meta tag `Content-Security-Policy`.

---

## 7. Checklist rápido

- [ ] `supabase.url` e `supabase.anonKey` preenchidos em `js/config.js`
- [ ] `schema.sql` executado no SQL Editor
- [ ] Provedor de e-mail habilitado no Auth
- [ ] (Opcional) `premiumChapters` definidos
- [ ] (Opcional) `cakto.paymentLink` preenchido
- [ ] (Opcional) migration `add_cakto_columns.sql` executada
- [ ] (Opcional) Edge Function `cakto-webhook` deployada e cadastrada na Cakto
