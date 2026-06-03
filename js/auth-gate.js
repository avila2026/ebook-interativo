// js/auth-gate.js
// Gateway de autenticação: garante que a página de login seja a PRIMEIRA tela
// acessada pelo usuário. Se o Supabase estiver configurado e não houver uma
// sessão salva neste navegador, redireciona para login.html antes de o ebook
// renderizar. Carregado de forma síncrona no <head> (logo após config.js) para
// evitar "flash" do conteúdo protegido.
(function () {
  try {
    var cfg = window.APP_CONFIG;
    // Só atua quando a autenticação está ligada (Supabase configurado).
    // Em "modo dormante" (sem Supabase), o ebook segue 100% acessível.
    if (!cfg || !cfg.supabase || !cfg.supabase.enabled) return;

    // Procura uma sessão salva pelo Supabase (chave padrão: sb-<ref>-auth-token).
    var hasSession = false;
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && /^sb-.*-auth-token$/.test(k) && localStorage.getItem(k)) {
        hasSession = true;
        break;
      }
    }

    if (!hasSession) {
      window.location.replace('login.html?redirect=index.html');
    }
  } catch (e) {
    // Se o localStorage estiver indisponível, não bloqueia o acesso.
  }
})();
