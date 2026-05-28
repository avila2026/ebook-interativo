// js/integrations.js  (ES module)
// Camada de integração Supabase + Stripe para o ebook "Mounjaro sem Mitos".
//
// PRINCÍPIO: nada acontece enquanto APP_CONFIG não estiver preenchido.
// Sem configuração => o site funciona exatamente como antes (localStorage, tudo liberado).
//
// Responsabilidades:
//   - Autenticação (cadastro / login / logout) via Supabase Auth.
//   - Sincronização do progresso e dos diários (peso/sintomas) entre dispositivos.
//   - Captura de leads (newsletter).
//   - Controle de acesso pago (paywall) com checkout placeholder da Stripe.
//   - Helper opcional de progresso de vídeo (trackVideo).

const CFG = window.APP_CONFIG || {};
const SB = CFG.supabase || {};

// Chaves do localStorage usadas pelo app.js (sincronizadas com a nuvem).
const SYNC_KEYS = {
  completed: 'mounjaro_completed',
  weights: 'mounjaro_weights',
  symptoms: 'mounjaro_symptoms'
};

let supabase = null;
let currentUser = null;
let hasAccess = false;
let bootstrapped = false;

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function lsSetSilent(key, value) {
  // Grava sem disparar o nosso patch de sync (evita loop de upload).
  _rawSetItem.call(localStorage, key, JSON.stringify(value));
}
function dedupeArray(arr) {
  const seen = new Set();
  const out = [];
  for (const item of arr || []) {
    const k = typeof item === 'object' ? JSON.stringify(item) : String(item);
    if (!seen.has(k)) { seen.add(k); out.push(item); }
  }
  return out;
}
function emit(name, detail) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

// Guarda a referência original do setItem para o patch de sincronização.
const _rawSetItem = localStorage.setItem;

// ---------------------------------------------------------------------------
// Inicialização do cliente Supabase (somente se configurado)
// ---------------------------------------------------------------------------
async function initSupabase() {
  if (!SB.enabled) return false;
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    supabase = createClient(SB.url, SB.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return true;
  } catch (err) {
    console.warn('[integrations] Falha ao carregar Supabase:', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Sincronização de dados (KV simples: cada chave é um blob jsonb)
// ---------------------------------------------------------------------------
function patchLocalStorageSync() {
  const tracked = Object.values(SYNC_KEYS);
  localStorage.setItem = function (key, value) {
    _rawSetItem.apply(this, arguments);
    if (currentUser && tracked.includes(key)) {
      scheduleUpload(key);
    }
  };
}

const uploadTimers = {};
function scheduleUpload(localKey) {
  clearTimeout(uploadTimers[localKey]);
  uploadTimers[localKey] = setTimeout(() => uploadKey(localKey), 800);
}

async function uploadKey(localKey) {
  if (!supabase || !currentUser) return;
  const value = lsGet(localKey);
  if (value == null) return;
  const stateKey = localKey.replace('mounjaro_', ''); // completed | weights | symptoms
  const { error } = await supabase.from('user_state').upsert(
    { user_id: currentUser.id, key: stateKey, value, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,key' }
  );
  if (error) console.warn('[integrations] upload', stateKey, error.message);
}

// Puxa dados da nuvem e faz merge (união) com o que está localmente.
async function syncFromCloud() {
  if (!supabase || !currentUser) return;
  const { data, error } = await supabase
    .from('user_state')
    .select('key, value')
    .eq('user_id', currentUser.id);
  if (error) { console.warn('[integrations] syncFromCloud', error.message); return; }

  const cloud = {};
  (data || []).forEach(row => { cloud[row.key] = row.value; });

  let changed = false;
  for (const [stateKey, localKey] of Object.entries(SYNC_KEYS)) {
    const local = lsGet(localKey) || [];
    const remote = cloud[stateKey] || [];
    const merged = dedupeArray([...remote, ...local]);
    lsSetSilent(localKey, merged);
    // Reenvia o merge para a nuvem se o local tinha algo a mais.
    if (merged.length !== remote.length) { uploadKey(localKey); }
    changed = true;
  }
  if (changed) emit('ebook:datasynced', {});
}

// ---------------------------------------------------------------------------
// Controle de acesso pago
// ---------------------------------------------------------------------------
async function refreshAccess() {
  if (!supabase || !currentUser) { hasAccess = false; return; }
  const { data, error } = await supabase
    .from('purchases')
    .select('lifetime_access, status')
    .eq('user_id', currentUser.id)
    .maybeSingle();
  if (error) { console.warn('[integrations] refreshAccess', error.message); hasAccess = false; return; }
  hasAccess = Boolean(data && data.lifetime_access && data.status === 'paid');
  emit('ebook:accesschanged', { hasAccess });
}

function isPremiumChapter(chapterId) {
  return Array.isArray(CFG.premiumChapters) && CFG.premiumChapters.includes(chapterId);
}

// Mostra/oculta o paywall sobre a área de leitura conforme o capítulo atual.
function enforcePaywall(chapterId) {
  if (!SB.enabled) return; // sem Supabase, nada é bloqueado
  const article = document.getElementById('ebookArticle');
  if (!article) return;
  removePaywall();
  if (isPremiumChapter(chapterId) && !hasAccess) {
    renderPaywall(article);
  }
}

function removePaywall() {
  document.querySelectorAll('.paywall-overlay').forEach(el => el.remove());
}

function renderPaywall(article) {
  const stripe = CFG.stripe || {};
  const overlay = document.createElement('div');
  overlay.className = 'paywall-overlay';
  overlay.innerHTML = `
    <div class="paywall-card">
      <div class="paywall-icon">🔒</div>
      <h2>Conteúdo exclusivo</h2>
      <p>Este capítulo faz parte da versão completa do <strong>Mounjaro sem Mitos</strong>.
         Garanta acesso vitalício a todos os capítulos, ferramentas e atualizações.</p>
      <div class="paywall-price">${stripe.priceLabel || ''}</div>
      <button type="button" class="btn-paywall-buy" id="btnPaywallBuy">
        ${stripe.enabled ? 'Comprar acesso' : 'Em breve'}
      </button>
      ${currentUser ? '' : '<p class="paywall-note">Já comprou? <a href="login.html?redirect=index.html" id="paywallLogin">Entre na sua conta</a>.</p>'}
    </div>`;
  article.appendChild(overlay);

  const buyBtn = overlay.querySelector('#btnPaywallBuy');
  buyBtn.disabled = !stripe.enabled;
  buyBtn.addEventListener('click', startCheckout);

  const loginLink = overlay.querySelector('#paywallLogin');
  loginLink?.addEventListener('click', (e) => {
    e.preventDefault();
    offlineForced = false;
    gatewayUI.show();
  });
}

// ---------------------------------------------------------------------------
// Pagamentos (Stripe) — placeholder via Payment Link
// ---------------------------------------------------------------------------
function startCheckout() {
  const stripe = CFG.stripe || {};
  if (!stripe.enabled || !stripe.paymentLink) {
    alert('O checkout ainda não foi configurado.');
    return;
  }
  // Modo placeholder: redireciona para o Payment Link hospedado pela Stripe.
  // O e-mail (se logado) é pré-preenchido e usado pelo webhook para liberar acesso.
  const url = new URL(stripe.paymentLink);
  if (currentUser?.email) url.searchParams.set('prefilled_email', currentUser.email);
  if (currentUser?.id) url.searchParams.set('client_reference_id', currentUser.id);
  window.location.href = url.toString();
}

// ---------------------------------------------------------------------------
// Captura de leads
// ---------------------------------------------------------------------------
async function captureLead(email, name, source = 'newsletter') {
  if (!supabase) return { ok: false, error: 'Não foi possível inscrever agora. Tente em breve.' };
  const { error } = await supabase.from('leads').insert({ email, name: name || null, source });
  if (error) {
    const msg = error.message || '';
    const friendly = msg.includes('schema') || msg.includes('table') || msg.includes('relation')
      ? 'Serviço temporariamente indisponível. Tente em breve.'
      : traduzErro(msg);
    return { ok: false, error: friendly };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Helper opcional: progresso de vídeo (granular, por content_id)
// ---------------------------------------------------------------------------
function trackVideo(videoEl, contentId) {
  if (!videoEl || !contentId) return;
  let last = 0;
  videoEl.addEventListener('timeupdate', () => {
    const now = videoEl.currentTime;
    if (now - last >= 5) { // grava no máximo a cada 5s
      last = now;
      saveProgress(contentId, now, false);
    }
  });
  videoEl.addEventListener('ended', () => saveProgress(contentId, videoEl.duration || 0, true));
  // Retoma de onde parou.
  loadProgress(contentId).then(p => { if (p?.progress) videoEl.currentTime = p.progress; });
}

async function saveProgress(contentId, progress, completed) {
  if (!supabase || !currentUser) return;
  await supabase.from('user_progress').upsert(
    { user_id: currentUser.id, content_id: contentId, progress, completed, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,content_id' }
  );
}
async function loadProgress(contentId) {
  if (!supabase || !currentUser) return null;
  const { data } = await supabase.from('user_progress')
    .select('progress, completed').eq('user_id', currentUser.id)
    .eq('content_id', contentId).maybeSingle();
  return data;
}

// ---------------------------------------------------------------------------
// UI de autenticação (Botão no cabeçalho + Form de lead + Gateway Integrado)
// ---------------------------------------------------------------------------

let offlineForced = false;

// ── Controladores do Gateway Integrado ──────────────────────────────────────
const gatewayUI = {
  gw: null,
  splash: null,
  card: null,
  offlineFooter: null,
  toastTimer: null,

  init() {
    this.gw = document.getElementById('appAuthGateway');
    if (!this.gw) return;

    this.splash = document.getElementById('gatewaySplash');
    this.card = document.getElementById('gatewayCard');
    this.offlineFooter = document.getElementById('gatewayOfflineFooter');

    // Exibe o rodapé offline após 3 segundos no splash caso queira ignorar
    setTimeout(() => {
      if (this.gw && !this.gw.classList.contains('fade-out') && this.card.classList.contains('hidden')) {
        if (this.offlineFooter) this.offlineFooter.removeAttribute('hidden');
      }
    }, 2800);

    // Setup abas
    const tabs = document.getElementById('gatewayTabs');
    tabs?.addEventListener('click', (e) => {
      const btn = e.target.closest('.gateway-tab-btn');
      if (btn?.dataset.panel) this.showPanel(btn.dataset.panel);
    });

    // Links de navegação interna
    document.getElementById('gatewayForgotLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      const loginEmail = document.getElementById('gatewayLoginEmail')?.value.trim();
      if (loginEmail && document.getElementById('gatewayResetEmail')) {
        document.getElementById('gatewayResetEmail').value = loginEmail;
      }
      this.showPanel('reset');
    });

    document.getElementById('gatewayForgotLink')?.addEventListener('touch', (e) => {
      e.preventDefault();
      const loginEmail = document.getElementById('gatewayLoginEmail')?.value.trim();
      if (loginEmail && document.getElementById('gatewayResetEmail')) {
        document.getElementById('gatewayResetEmail').value = loginEmail;
      }
      this.showPanel('reset');
    });

    document.getElementById('gatewayBtnResetBack')?.addEventListener('click', () => {
      this.showPanel('login');
    });

    // Entrada offline forçada
    document.getElementById('gatewayOfflineLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      offlineForced = true;
      this.hide();
      this.showToast('Entrou em modo offline. O progresso será salvo localmente.');
    });

    // Password toggles
    document.querySelectorAll('.gateway-toggle-pass').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        if (!input) return;
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        btn.textContent = isText ? '👁' : '🙈';
        btn.setAttribute('aria-label', isText ? 'Mostrar senha' : 'Ocultar senha');
      });
    });

    // Form Submits
    this.setupFormLogin();
    this.setupFormSignup();
    this.setupFormReset();
  },

  showPanel(name) {
    const panels = {
      login: document.getElementById('gatewayPanelLogin'),
      signup: document.getElementById('gatewayPanelSignup'),
      reset: document.getElementById('gatewayPanelReset')
    };

    Object.entries(panels).forEach(([key, el]) => {
      if (el) el.classList.toggle('active', key === name);
    });

    // Atualiza botões das abas
    document.querySelectorAll('.gateway-tab-btn').forEach(btn => {
      const active = btn.dataset.panel === name;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    // Foca no primeiro input
    const firstInput = panels[name]?.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 80);
  },

  showToast(text, duration = 3500) {
    const el = document.getElementById('gatewayToast');
    if (!el) return;
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.classList.remove('show'), duration);
  },

  setLoading(btn, on) {
    if (!btn) return;
    btn.disabled = on;
    if (on) btn.classList.add('loading');
    else btn.classList.remove('loading');
  },

  showMsg(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = `gateway-msg show ${type}`;
  },

  clearMsg(el) {
    if (!el) return;
    el.className = 'gateway-msg';
    el.textContent = '';
  },

  setupFormLogin() {
    const form = document.getElementById('gatewayFormLogin');
    const msg = document.getElementById('gatewayMsgLogin');
    const btn = document.getElementById('gatewayBtnLogin');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.clearMsg(msg);
      if (!supabase) { this.showMsg(msg, 'Erro: Supabase não inicializado.', 'error'); return; }

      const email = document.getElementById('gatewayLoginEmail').value.trim();
      const password = document.getElementById('gatewayLoginPassword').value;

      if (!email || !password) {
        this.showMsg(msg, 'Preencha todos os campos.', 'error');
        return;
      }

      this.setLoading(btn, true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      this.setLoading(btn, false);

      if (error) {
        this.showMsg(msg, traduzErro(error.message), 'error');
        return;
      }
      this.showToast('Login realizado com sucesso!');
    });
  },

  setupFormSignup() {
    const form = document.getElementById('gatewayFormSignup');
    const msg = document.getElementById('gatewayMsgSignup');
    const btn = document.getElementById('gatewayBtnSignup');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.clearMsg(msg);
      if (!supabase) { this.showMsg(msg, 'Erro: Supabase não inicializado.', 'error'); return; }

      const email = document.getElementById('gatewaySignupEmail').value.trim();
      const pass = document.getElementById('gatewaySignupPassword').value;
      const confirm = document.getElementById('gatewaySignupConfirm').value;

      if (!email || !pass || !confirm) {
        this.showMsg(msg, 'Preencha todos os campos.', 'error');
        return;
      }
      if (pass.length < 6) {
        this.showMsg(msg, 'A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
      }
      if (pass !== confirm) {
        this.showMsg(msg, 'As senhas não coincidem.', 'error');
        return;
      }

      this.setLoading(btn, true);
      const { data, error } = await supabase.auth.signUp({ email, password: pass });
      this.setLoading(btn, false);

      if (error) {
        this.showMsg(msg, traduzErro(error.message), 'error');
        return;
      }

      if (!data.session) {
        this.showMsg(msg, '✅ Conta criada! Verifique seu e-mail para confirmar o cadastro.', 'success');
      } else {
        this.showToast('Conta criada e logada com sucesso!');
      }
    });
  },

  setupFormReset() {
    const form = document.getElementById('gatewayFormReset');
    const msg = document.getElementById('gatewayMsgReset');
    const btn = document.getElementById('gatewayBtnReset');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.clearMsg(msg);
      if (!supabase) { this.showMsg(msg, 'Erro: Supabase não inicializado.', 'error'); return; }

      const email = document.getElementById('gatewayResetEmail').value.trim();
      if (!email) {
        this.showMsg(msg, 'Digite seu e-mail.', 'error');
        return;
      }

      this.setLoading(btn, true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname
      });
      this.setLoading(btn, false);

      if (error) {
        this.showMsg(msg, traduzErro(error.message), 'error');
        return;
      }
      this.showMsg(msg, '📬 Se o e-mail estiver cadastrado, enviamos um link de redefinição.', 'success');
    });
  },

  showLoginCard() {
    if (this.splash) this.splash.classList.add('hidden');
    if (this.card) this.card.classList.remove('hidden');
    if (this.offlineFooter) this.offlineFooter.removeAttribute('hidden');
    this.showPanel('login');
  },

  hide() {
    if (this.gw) {
      this.gw.classList.add('fade-out');
      setTimeout(() => {
        if (this.gw.classList.contains('fade-out')) {
          this.gw.style.display = 'none';
        }
      }, 550);
    }
  },

  show() {
    if (this.gw) {
      this.gw.style.display = 'flex';
      // Força um reflow para a animação disparar
      this.gw.offsetHeight;
      this.gw.classList.remove('fade-out');
      this.showLoginCard();
    }
  }
};

function injectAuthButton() {
  const nav = document.querySelector('.utility-nav');
  if (!nav || document.getElementById('btnAuth')) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-utility';
  btn.id = 'btnAuth';
  btn.setAttribute('aria-label', 'Conta');
  btn.innerHTML = '<span>👤</span> Entrar';
  btn.addEventListener('click', () => {
    if (currentUser) {
      openAccountMenu();
    } else {
      offlineForced = false;
      gatewayUI.show();
    }
  });
  nav.appendChild(btn);
}

function updateAuthButton() {
  const btn = document.getElementById('btnAuth');
  if (!btn) return;
  if (currentUser) {
    const label = currentUser.email ? currentUser.email.split('@')[0] : 'Conta';
    btn.innerHTML = `<span>👤</span> ${label}`;
  } else {
    btn.innerHTML = '<span>👤</span> Entrar';
  }
}

function openAccountMenu() {
  if (confirm('Deseja sair da sua conta?')) signOut();
}

// Form de captura de lead injetado no rodapé da sidebar.
function injectLeadForm() {
  const footer = document.querySelector('.sidebar-footer');
  if (!footer || document.getElementById('leadForm')) return;
  const wrap = document.createElement('div');
  wrap.className = 'lead-capture';
  wrap.innerHTML = `
    <p class="lead-title">📬 Receba novidades</p>
    <form id="leadForm">
      <input type="email" id="leadEmail" placeholder="seu@email.com" autocomplete="email" required>
      <!-- Honeypot anti-spam: invisível para humanos, bots tendem a preencher. -->
      <input type="text" id="leadCompany" name="company" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;">
      <button type="submit">Quero receber</button>
      <p class="lead-msg" id="leadMsg" hidden></p>
    </form>`;
  footer.prepend(wrap);

  const form = wrap.querySelector('#leadForm');
  const msg = wrap.querySelector('#leadMsg');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Honeypot preenchido => provável bot. Finge sucesso e não grava nada.
    if (wrap.querySelector('#leadCompany').value) {
      msg.hidden = false;
      msg.textContent = 'Inscrição confirmada! 🎉';
      msg.style.color = 'var(--accent, #10b981)';
      form.reset();
      return;
    }
    const email = wrap.querySelector('#leadEmail').value.trim();
    if (!EMAIL_RE.test(email)) {
      msg.hidden = false;
      msg.textContent = 'Informe um e-mail válido.';
      msg.style.color = '#f87171';
      return;
    }
    const res = await captureLead(email, null, 'sidebar');
    msg.hidden = false;
    msg.textContent = res.ok ? 'Inscrição confirmada! 🎉' : (res.error || 'Não foi possível inscrever agora.');
    msg.style.color = res.ok ? 'var(--accent, #10b981)' : '#f87171';
    if (res.ok) form.reset();
  });
}

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { ok: false, error: traduzErro(error.message) };
  return { ok: true, needsConfirmation: !data.session };
}
async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: traduzErro(error.message) };
  return { ok: true };
}
async function signOut() {
  if (supabase) {
    await supabase.auth.signOut();
  }
  // Segurança em dispositivos compartilhados: remove a chave da OpenAI ao sair.
  try { localStorage.removeItem('mounjaro_openai_apikey'); } catch {}
}

// Apaga deste navegador os dados pessoais/sensíveis guardados localmente
// (diário de peso, sintomas, progresso e a chave da OpenAI). Útil em dispositivos
// compartilhados. Não afeta os dados já sincronizados na conta do usuário.
function clearLocalData() {
  const keys = [
    SYNC_KEYS.completed, SYNC_KEYS.weights, SYNC_KEYS.symptoms,
    'mounjaro_openai_apikey'
  ];
  keys.forEach(k => { try { localStorage.removeItem(k); } catch {} });
  emit('ebook:localdatacleared', {});
}

function traduzErro(msg) {
  const m = (msg || '').toLowerCase();
  if (m.includes('invalid login') || m.includes('invalid credentials')) return 'E-mail ou senha incorretos.';
  if (m.includes('already registered') || m.includes('already exists') || m.includes('user already')) return 'Este e-mail já está cadastrado.';
  if (m.includes('password')) return 'A senha deve ter pelo menos 6 caracteres.';
  if (m.includes('email')) return 'Informe um e-mail válido.';
  if (m.includes('rate limit')) return 'Muitas tentativas. Aguarde um momento e tente novamente.';
  return msg;
}

async function onAuthChange(user) {
  currentUser = user;
  updateAuthButton();
  if (user) {
    await Promise.all([syncFromCloud(), refreshAccess()]);
    gatewayUI.hide();
    offlineForced = false;
  } else {
    hasAccess = false;
    // Não bloqueamos a leitura: o conteúdo abre direto. O login fica disponível
    // sob demanda pelo botão "Entrar" no cabeçalho (ou pelo paywall de capítulos pagos).
    gatewayUI.hide();
  }
  // Reavalia o paywall do capítulo atual.
  enforcePaywall(window.__ebookApp?.currentChapter?.());
}

async function ensureProfile() {
  if (!supabase || !currentUser) return;
  await supabase.from('profiles').upsert(
    { id: currentUser.id, email: currentUser.email },
    { onConflict: 'id' }
  );
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
async function bootstrap() {
  if (bootstrapped) return;
  bootstrapped = true;

  // Inicializa a UI do gateway
  gatewayUI.init();

  if (!SB.enabled) {
    // Modo dormante: integrações desligadas. Site segue 100% funcional.
    console.info('[integrations] Supabase não configurado — modo offline/localStorage.');
    gatewayUI.hide();
    return;
  }

  const ok = await initSupabase();
  if (!ok) {
    gatewayUI.hide();
    return;
  }

  patchLocalStorageSync();
  injectAuthButton();
  injectLeadForm();

  // Estado de sessão atual + ouvinte de mudanças.
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    await onAuthChange(session.user);
  } else {
    await onAuthChange(null);
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    onAuthChange(session?.user || null);
  });

  // Reavalia o paywall sempre que o app trocar de capítulo.
  document.addEventListener('ebook:chapterloaded', (e) => {
    enforcePaywall(e.detail?.chapterId);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

// API pública para uso opcional
window.Integrations = {
  get user() { return currentUser; },
  get hasAccess() { return hasAccess; },
  signOut,
  clearLocalData,
  captureLead,
  trackVideo,
  startCheckout,
  showGateway: () => {
    offlineForced = false;
    gatewayUI.show();
  }
};
