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

  // #paywallLogin is an <a href="login.html"> — no JS handler needed.
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
  if (!supabase) return { ok: false, error: 'Supabase não configurado' };
  const { error } = await supabase.from('leads').insert({ email, name: name || null, source });
  if (error) return { ok: false, error: error.message };
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
// UI de autenticação (modal + botão no cabeçalho + form de lead)
// ---------------------------------------------------------------------------
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
    if (currentUser) openAccountMenu();
    else window.location.href = 'login.html?redirect=index.html';
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

function buildModalShell() {
  let modal = document.getElementById('authModal');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'authModal';
  modal.className = 'auth-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="auth-backdrop" data-close="1"></div>
    <div class="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="authTitle">
      <button type="button" class="auth-close" data-close="1" aria-label="Fechar">×</button>
      <h2 id="authTitle">Entrar</h2>
      <p class="auth-sub">Acesse seu progresso em qualquer dispositivo.</p>
      <form id="authForm" novalidate>
        <label>E-mail
          <input type="email" id="authEmail" autocomplete="email" required>
        </label>
        <label>Senha
          <input type="password" id="authPassword" autocomplete="current-password" minlength="6" required>
        </label>
        <p class="auth-error" id="authError" hidden></p>
        <button type="submit" class="btn-auth-submit" id="authSubmit">Entrar</button>
      </form>
      <p class="auth-switch">
        <span id="authSwitchText">Ainda não tem conta?</span>
        <a href="#" id="authSwitchLink">Cadastre-se</a>
      </p>
    </div>`;
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target.dataset.close) closeAuthModal();
  });

  let mode = 'login';
  const form = modal.querySelector('#authForm');
  const title = modal.querySelector('#authTitle');
  const submit = modal.querySelector('#authSubmit');
  const switchText = modal.querySelector('#authSwitchText');
  const switchLink = modal.querySelector('#authSwitchLink');
  const errorEl = modal.querySelector('#authError');

  function setMode(next) {
    mode = next;
    const login = mode === 'login';
    title.textContent = login ? 'Entrar' : 'Criar conta';
    submit.textContent = login ? 'Entrar' : 'Cadastrar';
    switchText.textContent = login ? 'Ainda não tem conta?' : 'Já tem conta?';
    switchLink.textContent = login ? 'Cadastre-se' : 'Entrar';
    errorEl.hidden = true;
  }
  switchLink.addEventListener('click', (e) => { e.preventDefault(); setMode(mode === 'login' ? 'signup' : 'login'); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    submit.disabled = true;
    const email = modal.querySelector('#authEmail').value.trim();
    const password = modal.querySelector('#authPassword').value;
    const res = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password);
    submit.disabled = false;
    if (!res.ok) {
      errorEl.textContent = res.error || 'Algo deu errado. Tente novamente.';
      errorEl.hidden = false;
      return;
    }
    if (mode === 'signup' && res.needsConfirmation) {
      errorEl.style.color = 'var(--accent, #10b981)';
      errorEl.textContent = 'Conta criada! Confirme pelo e-mail enviado para continuar.';
      errorEl.hidden = false;
      return;
    }
    closeAuthModal();
  });

  modal._setMode = setMode;
  return modal;
}

function openAuthModal() {
  const modal = buildModalShell();
  modal._setMode('login');
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  setTimeout(() => modal.querySelector('#authEmail')?.focus(), 50);
}
function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.hidden = true;
  document.body.classList.remove('no-scroll');
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
      <button type="submit">Quero receber</button>
      <p class="lead-msg" id="leadMsg" hidden></p>
    </form>`;
  footer.prepend(wrap);

  const form = wrap.querySelector('#leadForm');
  const msg = wrap.querySelector('#leadMsg');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = wrap.querySelector('#leadEmail').value.trim();
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
  await supabase.auth.signOut();
}

function traduzErro(msg) {
  const m = (msg || '').toLowerCase();
  if (m.includes('invalid login')) return 'E-mail ou senha incorretos.';
  if (m.includes('already registered') || m.includes('already exists')) return 'Este e-mail já está cadastrado.';
  if (m.includes('password')) return 'A senha deve ter pelo menos 6 caracteres.';
  if (m.includes('email')) return 'Informe um e-mail válido.';
  return msg;
}

async function onAuthChange(user) {
  currentUser = user;
  updateAuthButton();
  if (user) {
    await Promise.all([syncFromCloud(), refreshAccess()]);
  } else {
    hasAccess = false;
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

  if (!SB.enabled) {
    // Modo dormante: integrações desligadas. Site segue 100% funcional.
    console.info('[integrations] Supabase não configurado — modo offline/localStorage.');
    return;
  }

  const ok = await initSupabase();
  if (!ok) return;

  patchLocalStorageSync();
  injectAuthButton();
  injectLeadForm();

  // Estado de sessão atual + ouvinte de mudanças.
  const { data: { session } } = await supabase.auth.getSession();
  await onAuthChange(session?.user || null);
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

// API pública para uso opcional (ex.: vídeos dentro de capítulos).
window.Integrations = {
  get user() { return currentUser; },
  get hasAccess() { return hasAccess; },
  openAuthModal,
  signOut,
  captureLead,
  trackVideo,
  startCheckout
};
