# 🧪 Mounjaro sem Mitos — Ebook Web Interativo

Guia completo e interativo sobre a tirzepatida, emagrecimento saudável e controle do
diabetes tipo 2. PWA instalável, com modo offline, laboratório interativo (quizzes,
simuladores e diários) e integração opcional com Supabase + Stripe.

## 🔗 Acesso (Vercel)

**App em produção:** <https://ebook-interativo-fawn.vercel.app>

## 📦 Estrutura

| Caminho | Descrição |
|---|---|
| `index.html` | Shell do app (PWA) |
| `js/data.js` | Conteúdo do ebook (capítulos, glossário) |
| `js/app.js` | Controlador da interface e do laboratório interativo |
| `js/config.js` | Configuração das integrações (Supabase/Stripe) |
| `js/integrations.js` | Auth, sincronização, leads e paywall |
| `css/` | Estilos (`main.css`, `components.css`) |
| `supabase/` | Esquema SQL e Edge Function da Stripe |
| `service-worker.js` | Cache offline (app shell) |
| `docs/INTEGRACOES.md` | Guia de configuração de Supabase + Stripe |

## 🚀 Rodar localmente

Por ser estático, basta servir a pasta:

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

## 🔐 Integrações (opcional)

Login/cadastro, sincronização de progresso, captura de leads e acesso pago ficam
**desligados** até `js/config.js` ser preenchido — o site funciona normalmente sem isso.
Para ativar, siga [`docs/INTEGRACOES.md`](docs/INTEGRACOES.md).
