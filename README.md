<div align="center">

![Banner](docs/banner.svg)

<br/>

[![Live Demo](https://img.shields.io/badge/▲%20Live%20Demo-ebook--interativo--fawn.vercel.app-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://ebook-interativo-fawn.vercel.app)
[![PWA](https://img.shields.io/badge/PWA-Instalável-10b981?style=for-the-badge&logo=pwa&logoColor=white)](https://ebook-interativo-fawn.vercel.app)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Offline](https://img.shields.io/badge/Offline-Ready-06b6d4?style=for-the-badge)](https://ebook-interativo-fawn.vercel.app)

</div>

---

## Sobre o Projeto

**Mounjaro sem Mitos** é um guia interativo completo sobre a tirzepatida (Mounjaro), emagrecimento saudável e controle do diabetes tipo 2. Desenvolvido como Progressive Web App (PWA) instalável, funciona offline, possui laboratório interativo com holograma 3D e integração opcional com Supabase + Stripe.

> Desmistifique o Mounjaro com ciência, interatividade e design premium.

---

## Funcionalidades

![Features](docs/features.svg)

### Conteúdo
- **14 capítulos** cobrindo mecanismo de ação, benefícios, riscos, contraindicações, estudos clínicos e mais
- **Glossário interativo** com termos médicos e científicos
- Progresso de leitura salvo automaticamente (localStorage + nuvem)
- Navegação entre capítulos com barra de progresso global

### Laboratório Interativo
- **Holograma 3D** do corpo humano com 5 sistemas do organismo (drag-to-rotate)
- **Quizzes** de fixação com feedback imediato
- **Simulador de doses** e calculadora personalizada
- **Diário de peso e sintomas** com gráficos de evolução
- Medidor de exploração e sistema de conquistas

### PWA & Offline
- Instalável no celular e desktop (Android, iOS, Windows, macOS)
- Funciona sem internet após o primeiro acesso
- Service Worker com cache inteligente (app shell + conteúdo)
- Atualização automática em segundo plano

### Auth & Sincronização (Supabase)
- Cadastro e login por e-mail/senha
- Recuperação de senha por e-mail
- Sincronização do progresso entre dispositivos
- Captura de leads (newsletter)
- Row Level Security (RLS) — cada usuário acessa apenas seus próprios dados

---

## Stack Tecnológico

![Tech Stack](docs/tech-stack.svg)

| Camada | Tecnologia | Detalhes |
|--------|-----------|---------|
| Frontend | HTML5 + CSS3 + JS | Vanilla, sem bundler, ES Modules |
| Design | CSS Custom Properties | Tema dark neon holográfico |
| Fontes | Outfit + Inter | Google Fonts |
| PWA | Service Worker + Manifest | Cache v3, offline-first |
| Backend | Supabase | Auth, PostgreSQL, RLS |
| Pagamentos | Stripe | Payment Link (sem backend) |
| Deploy | Vercel | CDN global, deploy estático |

---

## Estrutura do Projeto

```
ebook-interativo/
├── index.html              # Shell do app (PWA)
├── login.html              # Página de login/cadastro dedicada
├── manifest.json           # Configuração PWA
├── service-worker.js       # Cache offline (app shell)
│
├── js/
│   ├── config.js           # Configuração das integrações (Supabase/Stripe)
│   ├── data.js             # Conteúdo do ebook (capítulos, glossário)
│   ├── app.js              # Controlador da interface e laboratório
│   └── integrations.js     # Auth, sync, leads e paywall (ES module)
│
├── css/
│   ├── main.css            # Sistema de design (variáveis, layout, tipografia)
│   └── components.css      # Componentes (cards, modais, holograma, lab)
│
├── assets/
│   ├── icons/              # Ícones PWA (192, 512, maskable, apple-touch)
│   └── images/             # Imagens do ebook
│
├── supabase/
│   ├── schema.sql          # Tabelas + RLS (profiles, user_state, leads, purchases)
│   └── functions/
│       └── stripe-webhook/ # Edge Function: webhook do Stripe → libera acesso
│
└── docs/
    ├── banner.svg          # Banner do README
    ├── features.svg        # Features do README
    ├── tech-stack.svg      # Tech stack do README
    └── INTEGRACOES.md      # Guia de configuração Supabase + Stripe
```

---

## Rodar Localmente

Por ser um site 100% estático, basta servir a pasta com qualquer servidor HTTP:

```bash
# Python (nativo)
python3 -m http.server 8080

# Node.js
npx serve .

# VS Code: extensão Live Server
```

Acesse: `http://localhost:8080`

> **Sem configuração adicional necessária.** O ebook funciona completamente sem Supabase ou Stripe — progresso e diários ficam no localStorage.

---

## Configurar Integrações (Opcional)

### Supabase (Auth + Sincronização)

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Rode o SQL em `supabase/schema.sql` no Editor SQL do Supabase
3. Ative o provider **Email** em Authentication → Providers
4. Edite `js/config.js`:

```javascript
window.APP_CONFIG = {
  supabase: {
    url: 'https://SEU-PROJETO.supabase.co',
    anonKey: 'sb_publishable_...'   // chave pública anon — segura no browser
  },
  // ...
};
```

### Stripe (Acesso Pago — opcional)

1. Crie um **Payment Link** no Stripe Dashboard
2. Em `js/config.js`, preencha:

```javascript
stripe: {
  paymentLink: 'https://buy.stripe.com/xxxxxxxx',
  priceLabel: 'R$ 49,90'
},
premiumChapters: ['capitulo-10', 'capitulo-11', 'capitulo-12']
```

3. Configure o webhook do Stripe apontando para a Edge Function em `supabase/functions/stripe-webhook/`

> Guia completo em [`docs/INTEGRACOES.md`](docs/INTEGRACOES.md)

---

## Login / Auth

A página de login está em [`/login.html`](https://ebook-interativo-fawn.vercel.app/login.html):

- **Entrar** — login com e-mail e senha
- **Criar conta** — cadastro com confirmação de senha
- **Recuperar senha** — link de redefinição por e-mail
- Redireciona automaticamente se já houver sessão ativa
- Design holográfico consistente com o tema do ebook

---

## Segurança

- **Apenas chaves públicas** no frontend (`anonKey` / `publishableKey`) — nunca chaves secretas
- **Row Level Security** ativo em todas as tabelas — usuário só acessa seus próprios dados
- **CSP** restritiva no `index.html` e `login.html` — whitelist de domínios externos
- Gravação em `purchases` feita exclusivamente pela Edge Function com `service_role` (nunca pelo browser)

---

## Licença

Desenvolvido para fins informativos e educativos.  
Conteúdo médico meramente informativo — consulte sempre um profissional de saúde.

---

<div align="center">
  <sub>Mounjaro sem Mitos © 2026 · Feito com ❤️ e muita tirzepatida</sub>
</div>
