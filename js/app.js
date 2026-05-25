// js/app.js
// Controlador Geral do Ebook Web Interativo - Mounjaro sem Mitos

document.addEventListener('DOMContentLoaded', () => {
  // Estado Global da Aplicação
  const state = {
    currentChapter: 'introducao',
    completedChapters: JSON.parse(localStorage.getItem('mounjaro_completed')) || [],
    fontSizeLevel: 0, // 0 = Padrão, 1 = Média, 2 = Grande
    quiz: {
      currentQuestionIndex: 0,
      score: 0,
      userAnswers: []
    }
  };

  // Elementos da UI
  const sidebar = document.getElementById('appSidebar');
  const mainContent = document.getElementById('mainContent');
  const ebookArticle = document.getElementById('ebookArticle');
  const headerTitle = document.getElementById('headerChapterTitle');
  const headerSubtitle = document.getElementById('headerChapterSubtitle');
  const globalProgress = document.getElementById('globalProgress');
  const progressPercentage = document.getElementById('progressPercentage');
  
  const btnPrev = document.getElementById('btnPrevChapter');
  const btnNext = document.getElementById('btnNextChapter');
  const prevTitle = document.getElementById('prevChapterName');
  const nextTitle = document.getElementById('nextChapterName');

  const btnToggleSidebar = document.getElementById('btnToggleSidebar');
  const btnToggleFontSize = document.getElementById('btnToggleFontSize');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const btnInstall = document.getElementById('btnInstall');

  // Escapa caracteres HTML para uso seguro em atributos e innerHTML
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Inicialização
  init();

  function init() {
    setupEventListeners();
    setupPWA();
    loadChapter(state.currentChapter);
    updateProgressUI();
    exposeIntegrationHooks();
  }

  // Pontos de integração mínimos para a camada Supabase (js/integrations.js).
  // Mantém o app desacoplado: se integrations.js não carregar, nada muda.
  function exposeIntegrationHooks() {
    window.__ebookApp = {
      currentChapter: () => state.currentChapter,
      reloadCurrent: () => loadChapter(state.currentChapter)
    };
    // Quando dados são sincronizados da nuvem, recarrega o estado de progresso.
    document.addEventListener('ebook:datasynced', () => {
      state.completedChapters = JSON.parse(localStorage.getItem('mounjaro_completed')) || [];
      updateProgressUI();
      if (state.currentChapter === 'recursos-interativos') loadChapter(state.currentChapter);
    });
  }

  // Registro do Service Worker e prompt de instalação (PWA)
  function setupPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').catch((err) => {
          console.warn('Falha ao registrar o Service Worker:', err);
        });
      });
    }

    let deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (btnInstall) btnInstall.hidden = false;
    });

    if (btnInstall) {
      btnInstall.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        btnInstall.hidden = true;
      });
    }

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      if (btnInstall) btnInstall.hidden = true;
    });
  }

  // Abre/fecha a sidebar no mobile, sincronizando backdrop e trava de rolagem.
  function setSidebarOpen(open) {
    sidebar.classList.toggle('sidebar--open', open);
    sidebarBackdrop.hidden = !open;
    document.body.classList.toggle('no-scroll', open);
    btnToggleSidebar.setAttribute('aria-expanded', String(open));
  }

  // Configura Ouvintes de Eventos Globais
  function setupEventListeners() {
    // Cliques na Sidebar
    document.querySelectorAll('.chapter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chapterId = btn.getAttribute('data-chapter');
        loadChapter(chapterId);

        // No celular, fechar a sidebar após clicar
        if (window.innerWidth <= 1024) {
          setSidebarOpen(false);
        }
      });
    });

    // Navegação Inferior
    btnPrev.addEventListener('click', () => navigateChapters(-1));
    btnNext.addEventListener('click', () => navigateChapters(1));

    // Alternar Sidebar (Mobile)
    btnToggleSidebar.addEventListener('click', () => {
      setSidebarOpen(!sidebar.classList.contains('sidebar--open'));
    });

    // Fechar a sidebar ao tocar no backdrop
    sidebarBackdrop.addEventListener('click', () => setSidebarOpen(false));

    // Fechar a sidebar com a tecla Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('sidebar--open')) {
        setSidebarOpen(false);
      }
    });

    // Ajuste de Tamanho de Fonte
    btnToggleFontSize.addEventListener('click', () => {
      state.fontSizeLevel = (state.fontSizeLevel + 1) % 3;
      const sizes = ['16px', '18px', '20px'];
      const articlesSizes = ['1.1rem', '1.25rem', '1.4rem'];
      
      document.documentElement.style.fontSize = sizes[state.fontSizeLevel];
      ebookArticle.style.fontSize = articlesSizes[state.fontSizeLevel];
    });
  }

  // Carrega e renderiza o conteúdo de um capítulo
  function loadChapter(chapterId) {
    state.currentChapter = chapterId;
    
    // Rola para o topo do contêiner de leitura
    mainContent.scrollTop = 0;

    // Atualiza classes ativas na Sidebar
    document.querySelectorAll('.chapter-btn').forEach(btn => {
      if (btn.getAttribute('data-chapter') === chapterId) {
        btn.classList.add('active');
        // Marcar o capítulo atual e os anteriores como lidos automaticamente (fator gamificação)
        markAsCompleted(chapterId);
      } else {
        btn.classList.remove('active');
      }
    });

    // Caso seja a seção de Ferramentas / Laboratório Interativo
    if (chapterId === 'recursos-interativos') {
      renderInteractiveLab();
      updateNavigationButtons();
      document.dispatchEvent(new CustomEvent('ebook:chapterloaded', { detail: { chapterId } }));
      return;
    }

    // Busca o capítulo nos dados
    const chapter = EBOOK_DATA.chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    // Cabeçalho
    headerTitle.textContent = chapter.title;
    headerSubtitle.textContent = chapter.subtitle;

    // Renderiza artigo
    let html = `
      <h1>${chapter.title}</h1>
      <p class="article-subtitle">${chapter.subtitle}</p>
      ${chapter.content}
    `;

    ebookArticle.innerHTML = html;
    
    // Injeta imagem real baseada nos Placeholders
    resolveImagePlaceholders();

    // Adiciona popups de glossário dinâmicos
    applyDynamicGlossary();

    // Atualiza botões de navegação
    updateNavigationButtons();

    // Salva estado de progresso
    updateProgressUI();

    // Notifica integrações (ex.: paywall) sobre a troca de capítulo.
    document.dispatchEvent(new CustomEvent('ebook:chapterloaded', { detail: { chapterId } }));
  }

  // Transforma placeholders de imagem em tags <img> reais do diretório
  function resolveImagePlaceholders() {
    const imageMap = {
      'mounjaro_cover':     'assets/images/mounjaro_box.jpg',
      'ai_medicine':        'assets/images/copilot_3d.gif',
      'mounjaro_box':       'assets/images/mounjaro_box.jpg',
      'mounjaro_device':    'assets/images/mounjaro_device.jpg',
      'molecule_structure': 'assets/images/molecule_structure.png',
      'mounjaro_hand':      'assets/images/mounjaro_hand.jpg',
      'copilot_3d':         'assets/images/copilot_3d.gif',
      'health_cover':       'assets/images/mounjaro_box.jpg',
      'active_lifestyle':   'assets/images/mounjaro_hand.jpg',
      'healthy_food':       'assets/images/mounjaro_device.jpg',
      'happy_future':       'assets/images/copilot_3d.gif',
    };

    const boxes = ebookArticle.querySelectorAll('.visual-placeholder.image-box');
    boxes.forEach(box => {
      const imgKey = box.getAttribute('data-image');
      const imgPath = imageMap[imgKey];

      if (imgPath) {
        const captionEl = box.querySelector('.image-caption');
        const altText = captionEl ? captionEl.textContent.trim() : imgKey;
        const caption = box.innerHTML;
        box.innerHTML = `<img src="${imgPath}" alt="${altText}" loading="lazy">${caption}`;
      }
    });
  }

  // Escaneia o texto e adiciona explicações de termos médicos ao passar o mouse (Glossário dinâmico)
  function applyDynamicGlossary() {
    const textNodes = [];
    const walk = document.createTreeWalker(ebookArticle, NodeFilter.SHOW_TEXT, null, false);
    let node;
    
    while(node = walk.nextNode()) {
      // Ignorar textos dentro de elementos interativos, tags de imagem, cabeçalhos ou links de botões
      const parent = node.parentNode;
      if (parent.tagName === 'A' || parent.tagName === 'BUTTON' || parent.classList.contains('glossary-term') || parent.tagName === 'H1' || parent.tagName === 'H2' || parent.tagName === 'H3') {
        continue;
      }
      textNodes.push(node);
    }

    textNodes.forEach(node => {
      let text = node.nodeValue;
      let replaced = false;

      // Percorre os termos do glossário
      Object.keys(EBOOK_DATA.glossary).forEach(term => {
        const regex = new RegExp(`\\b(${term})\\b`, 'gi');
        if (regex.test(text)) {
          const definition = escapeHtml(EBOOK_DATA.glossary[term]);
          text = text.replace(regex, `<span class="glossary-term" data-tooltip="${definition}">$1</span>`);
          replaced = true;
        }
      });

      if (replaced) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        
        // Substitui o nó de texto pelos novos nós HTML
        while (tempDiv.firstChild) {
          node.parentNode.insertBefore(tempDiv.firstChild, node);
        }
        node.parentNode.removeChild(node);
      }
    });
  }

  // Gerencia botões de navegação inferior
  function navigateChapters(direction) {
    const list = [...EBOOK_DATA.chapters.map(c => c.id), 'recursos-interativos'];
    const idx = list.indexOf(state.currentChapter);
    const newIdx = idx + direction;
    
    if (newIdx >= 0 && newIdx < list.length) {
      loadChapter(list[newIdx]);
    }
  }

  function updateNavigationButtons() {
    const list = [...EBOOK_DATA.chapters.map(c => c.id), 'recursos-interativos'];
    const idx = list.indexOf(state.currentChapter);

    // Prev Button
    if (idx > 0) {
      btnPrev.style.visibility = 'visible';
      const prevId = list[idx - 1];
      const prevChapter = EBOOK_DATA.chapters.find(c => c.id === prevId);
      prevTitle.textContent = prevChapter ? prevChapter.title : '🛠️ Ferramentas';
    } else {
      btnPrev.style.visibility = 'hidden';
    }

    // Next Button
    if (idx < list.length - 1) {
      btnNext.style.visibility = 'visible';
      const nextId = list[idx + 1];
      const nextChapter = EBOOK_DATA.chapters.find(c => c.id === nextId);
      nextTitle.textContent = nextChapter ? nextChapter.title : '🛠️ Lab Interativo';
    } else {
      btnNext.style.visibility = 'hidden';
    }
  }

  // Progresso de Leitura Gamificado
  function markAsCompleted(chapterId) {
    if (chapterId !== 'recursos-interativos' && !state.completedChapters.includes(chapterId)) {
      state.completedChapters.push(chapterId);
      localStorage.setItem('mounjaro_completed', JSON.stringify(state.completedChapters));
      
      // Marca na Sidebar
      const btn = document.querySelector(`.chapter-btn[data-chapter="${chapterId}"]`);
      if (btn) btn.classList.add('completed');
    }
  }

  function updateProgressUI() {
    const totalContentChapters = EBOOK_DATA.chapters.length; // Exclui recursos-interativos
    const completedCount = state.completedChapters.length;
    const percent = Math.round((completedCount / totalContentChapters) * 100);
    
    globalProgress.style.width = `${percent}%`;
    progressPercentage.textContent = `${percent}%`;

    // Garante que os botões já lidos fiquem marcados visualmente
    state.completedChapters.forEach(cId => {
      const btn = document.querySelector(`.chapter-btn[data-chapter="${cId}"]`);
      if (btn) btn.classList.add('completed');
    });
  }

  // ==========================================
  // RENDERIZADOR DO LABORATÓRIO INTERATIVO
  // ==========================================
  function renderInteractiveLab() {
    headerTitle.textContent = "Laboratório Interativo";
    headerSubtitle.textContent = "Testes, simuladores, diários e comparadores";

    let html = `
      <h1>🛠️ Laboratório Interativo</h1>
      <p class="article-subtitle">Explore ferramentas inteligentes para dominar a saúde metabólica</p>
      <p>Desenvolvemos esta área prática para consolidar seu aprendizado teórico. Utilize as abas abaixo para interagir com o corpo humano, simular tratamentos e registrar sua própria jornada de saúde.</p>
      
      <!-- ABAS DOS COMPONENTES -->
      <div class="tabs-nav" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
        <button class="btn-utility active-tab" data-tab="tab-bodymap">🧠 Mapa Corporal</button>
        <button class="btn-utility" data-tab="tab-compare">⚖️ Comparador</button>
        <button class="btn-utility" data-tab="tab-effects">💊 Efeitos Colaterais</button>
        <button class="btn-utility" data-tab="tab-screening">📋 Triagem Médica</button>
        <button class="btn-utility" data-tab="tab-quiz">✏️ Quiz</button>
        <button class="btn-utility" data-tab="tab-diaries">📓 Diários Locais</button>
        <button class="btn-utility" data-tab="tab-simulator">💉 Simulador KwikPen</button>
      </div>

      <!-- CONTEÚDO DAS ABAS -->
      <div class="tab-content" id="tabContentBox">
        <!-- Injetado dinamicamente -->
      </div>
    `;

    ebookArticle.innerHTML = html;

    // Configura navegação interna de abas
    const tabs = ebookArticle.querySelectorAll('.tabs-nav button');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active-tab');
          t.style.background = 'var(--bg-tertiary)';
          t.style.color = 'var(--text-main)';
        });
        tab.classList.add('active-tab');
        tab.style.background = 'var(--primary)';
        tab.style.color = 'var(--text-inverse)';
        
        const tabName = tab.getAttribute('data-tab');
        loadTabContent(tabName);
      });
    });

    // Carrega a primeira aba por padrão
    loadTabContent('tab-bodymap');
  }

  function loadTabContent(tabName) {
    const container = document.getElementById('tabContentBox');
    
    switch (tabName) {
      case 'tab-bodymap':
        renderBodyMap(container);
        break;
      case 'tab-compare':
        renderCompareTable(container);
        break;
      case 'tab-effects':
        renderEffectsFlipCards(container);
        break;
      case 'tab-screening':
        renderScreeningChecklist(container);
        break;
      case 'tab-quiz':
        renderQuizComponent(container);
        break;
      case 'tab-diaries':
        renderDiariesComponent(container);
        break;
      case 'tab-simulator':
        renderKwikPenSimulator(container);
        break;
    }
  }

  // 1. MAPA CORPORAL CLICÁVEL — Holograma 3D Interativo
  function renderBodyMap(container) {
    // Cada sistema vive nas coordenadas do SVG (viewBox 0 0 200 490): o ponto
    // clicável, o órgão que acende dentro do corpo e o conteúdo do painel.
    const systems = [
      {
        id: 'brain', emoji: '🧠', label: 'Cérebro', cx: 100, cy: 46,
        organ: { cx: 100, cy: 46, rx: 15, ry: 16 },
        title: '🧠 Sistema Nervoso (Cérebro)',
        body: `<p>A tirzepatida age no <strong>hipotálamo</strong>, o centro que regula fome e gasto energético.</p>
          <ul>
            <li><strong>Saciedade aumentada:</strong> sensação de plenitude com porções menores.</li>
            <li><strong>Menos "cravings":</strong> reduz a fome por ansiedade ou tédio.</li>
          </ul>`
      },
      {
        id: 'heart', emoji: '🫀', label: 'Coração', cx: 90, cy: 120,
        organ: { cx: 90, cy: 120, rx: 12, ry: 13 },
        title: '🫀 Sistema Cardiovascular',
        body: `<p>Ao reduzir peso e inflamação, alivia a sobrecarga sobre o coração e os vasos.</p>
          <ul>
            <li><strong>Pressão arterial:</strong> tendência de queda junto com a perda de peso.</li>
            <li><strong>Risco cardiovascular:</strong> estudos apontam melhora de marcadores metabólicos.</li>
          </ul>`
      },
      {
        id: 'pancreas', emoji: '🧪', label: 'Pâncreas', cx: 116, cy: 150,
        organ: { cx: 112, cy: 150, rx: 15, ry: 8 },
        title: '🧪 Pâncreas e Insulina',
        body: `<p>Estimula a secreção hormonal de forma <strong>glicose-dependente</strong> (só quando você come).</p>
          <ul>
            <li><strong>Insulina:</strong> GIP + GLP-1 induzem secreção no momento certo.</li>
            <li><strong>Glucagon:</strong> reduz, diminuindo a produção hepática de glicose.</li>
          </ul>`
      },
      {
        id: 'stomach', emoji: '🍕', label: 'Estômago', cx: 84, cy: 174,
        organ: { cx: 86, cy: 174, rx: 13, ry: 13 },
        title: '🍕 Sistema Digestivo (Estômago)',
        body: `<p>Por mimetizar o GLP-1, o medicamento retarda o esvaziamento gástrico.</p>
          <ul>
            <li><strong>Digestão lenta:</strong> a comida fica mais tempo no estômago.</li>
            <li><strong>Sem picos glicêmicos:</strong> a glicose entra no sangue de forma dosada.</li>
          </ul>`
      },
      {
        id: 'glycemia', emoji: '🩸', label: 'Glicemia', cx: 100, cy: 214,
        organ: { cx: 100, cy: 212, rx: 22, ry: 11 },
        title: '🩸 Controle Glicêmico Sistêmico',
        body: `<p>O efeito combinado mantém a <strong>glicose estável</strong> ao longo do dia.</p>
          <ul>
            <li><strong>HbA1c:</strong> redução consistente no diabetes tipo 2.</li>
            <li><strong>Resistência à insulina:</strong> melhora com a perda de gordura visceral.</li>
          </ul>`
      }
    ];

    const organMarkup = systems.map(s => `
      <ellipse class="organ-glow" data-organ="${s.id}"
        cx="${s.organ.cx}" cy="${s.organ.cy}" rx="${s.organ.rx}" ry="${s.organ.ry}"></ellipse>`).join('');

    const hotspotMarkup = systems.map(s => `
      <g class="holo-hotspot" data-spot="${s.id}" role="button" tabindex="0"
         aria-label="Ver ação no sistema: ${s.label}">
        <title>${s.label}</title>
        <circle class="hs-ring"  cx="${s.cx}" cy="${s.cy}" r="13"></circle>
        <circle class="hs-dot"   cx="${s.cx}" cy="${s.cy}" r="11"></circle>
        <text class="hs-emoji" x="${s.cx}" y="${s.cy}" text-anchor="middle"
              dominant-baseline="central">${s.emoji}</text>
      </g>`).join('');

    container.innerHTML = `
      <div class="bodymap-container fade-in">
        <div class="bodymap-visual" id="bodyMapStage">
          <div class="holo-grid"></div>
          <svg class="body-svg" viewBox="0 0 200 490" xmlns="http://www.w3.org/2000/svg"
               role="img" aria-label="Modelo holográfico interativo do corpo humano">
            <defs>
              <linearGradient id="holoFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stop-color="#22d3ee" stop-opacity="0.30"/>
                <stop offset="55%"  stop-color="#10b981" stop-opacity="0.16"/>
                <stop offset="100%" stop-color="#0ea5b7" stop-opacity="0.06"/>
              </linearGradient>
              <linearGradient id="holoStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"  stop-color="#67e8f9"/>
                <stop offset="100%" stop-color="#34d399"/>
              </linearGradient>
              <radialGradient id="organGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%"  stop-color="#a5f3fc" stop-opacity="0.95"/>
                <stop offset="100%" stop-color="#22d3ee" stop-opacity="0.1"/>
              </radialGradient>
              <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stop-color="#a5f3fc" stop-opacity="0"/>
                <stop offset="50%"  stop-color="#67e8f9" stop-opacity="0.55"/>
                <stop offset="100%" stop-color="#a5f3fc" stop-opacity="0"/>
              </linearGradient>
              <filter id="neonGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <clipPath id="bodyClip">
                <ellipse cx="100" cy="46" rx="24" ry="28"/>
                <path d="M88,68 L112,68 L110,86 L90,86 Z"/>
                <path d="M100,86 C122,86 138,96 138,118 C137,150 132,176 128,200 C126,214 126,230 132,250 C120,258 108,260 100,260 C92,260 80,258 68,250 C74,230 74,214 72,200 C68,176 63,150 62,118 C62,96 78,86 100,86 Z"/>
                <path d="M134,104 C146,108 152,130 152,160 C152,186 150,206 146,230 C145,238 138,238 136,230 C132,206 128,182 126,150 C125,128 126,110 134,104 Z"/>
                <path d="M66,104 C54,108 48,130 48,160 C48,186 50,206 54,230 C55,238 62,238 64,230 C68,206 72,182 74,150 C75,128 74,110 66,104 Z"/>
                <path d="M101,258 L126,262 C128,304 126,362 121,420 C120,444 118,460 113,462 C108,463 105,458 104,448 C102,402 101,332 101,258 Z"/>
                <path d="M99,258 L74,262 C72,304 74,362 79,420 C80,444 82,460 87,462 C92,463 95,458 96,448 C98,402 99,332 99,258 Z"/>
              </clipPath>
            </defs>

            <!-- Base de projeção holográfica -->
            <g class="holo-base">
              <ellipse class="base-ring base-ring-3" cx="100" cy="476" rx="78" ry="13"/>
              <ellipse class="base-ring base-ring-2" cx="100" cy="476" rx="58" ry="9"/>
              <ellipse class="base-ring base-ring-1" cx="100" cy="476" rx="36" ry="6"/>
            </g>

            <!-- Figura humana -->
            <g class="body-figure" filter="url(#neonGlow)">
              <g class="figure-fill" fill="url(#holoFill)" stroke="url(#holoStroke)" stroke-width="1.6" stroke-linejoin="round">
                <ellipse cx="100" cy="46" rx="24" ry="28"/>
                <path d="M88,68 L112,68 L110,86 L90,86 Z"/>
                <path d="M100,86 C122,86 138,96 138,118 C137,150 132,176 128,200 C126,214 126,230 132,250 C120,258 108,260 100,260 C92,260 80,258 68,250 C74,230 74,214 72,200 C68,176 63,150 62,118 C62,96 78,86 100,86 Z"/>
                <path d="M134,104 C146,108 152,130 152,160 C152,186 150,206 146,230 C145,238 138,238 136,230 C132,206 128,182 126,150 C125,128 126,110 134,104 Z"/>
                <path d="M66,104 C54,108 48,130 48,160 C48,186 50,206 54,230 C55,238 62,238 64,230 C68,206 72,182 74,150 C75,128 74,110 66,104 Z"/>
                <path d="M101,258 L126,262 C128,304 126,362 121,420 C120,444 118,460 113,462 C108,463 105,458 104,448 C102,402 101,332 101,258 Z"/>
                <path d="M99,258 L74,262 C72,304 74,362 79,420 C80,444 82,460 87,462 C92,463 95,458 96,448 C98,402 99,332 99,258 Z"/>
              </g>
              <!-- Órgãos que acendem ao serem selecionados -->
              <g class="organ-layer" fill="url(#organGrad)">
                ${organMarkup}
              </g>
              <!-- Linhas de malha (sensação 3D / wireframe anatômico) -->
              <g class="figure-mesh" fill="none" stroke="#67e8f9" stroke-width="0.8" opacity="0.45">
                <line x1="100" y1="92" x2="100" y2="256"/>
                <path d="M70,120 Q100,134 130,120"/>
                <path d="M68,150 Q100,166 132,150"/>
                <path d="M70,182 Q100,196 130,182"/>
                <path d="M74,214 Q100,226 126,214"/>
                <line x1="62" y1="112" x2="138" y2="112"/>
              </g>
            </g>

            <!-- Linha de varredura (scanner holográfico), recortada ao corpo -->
            <g clip-path="url(#bodyClip)">
              <rect class="scan-bar" x="36" y="0" width="128" height="46" fill="url(#scanGrad)"/>
            </g>

            <!-- Hotspots clicáveis -->
            ${hotspotMarkup}
          </svg>
          <span class="holo-hint" id="holoHint">🖱️ Arraste para girar • toque nos pontos</span>
        </div>

        <div class="bodymap-info">
          <div class="explore-meter">
            <span>Sistemas explorados</span>
            <strong id="exploreCount">0/${systems.length}</strong>
            <div class="explore-bar"><i id="exploreFill"></i></div>
          </div>
          <div id="bodyMapInfoPanel">
            <div class="bodymap-placeholder-text">
              <p>Toque nos <strong>pontos luminosos</strong> do holograma para ver como o Mounjaro atua em cada órgão. Arraste o corpo para girá-lo em 3D.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const stage = container.querySelector('#bodyMapStage');
    const svg = container.querySelector('.body-svg');
    const hint = container.querySelector('#holoHint');
    const hotspots = container.querySelectorAll('.holo-hotspot');
    const organs = container.querySelectorAll('.organ-glow');
    const infoPanel = container.querySelector('#bodyMapInfoPanel');
    const countEl = container.querySelector('#exploreCount');
    const fillEl = container.querySelector('#exploreFill');
    const explored = new Set();

    function activate(id) {
      const sys = systems.find(s => s.id === id);
      if (!sys) return;

      hotspots.forEach(h => h.classList.toggle('active', h.dataset.spot === id));
      organs.forEach(o => o.classList.toggle('on', o.dataset.organ === id));

      // Painel com card animado.
      infoPanel.innerHTML = `<div class="organ-card" role="status">
        <h4>${sys.title}</h4>${sys.body}</div>`;

      // Medidor de exploração.
      if (!explored.has(id)) {
        explored.add(id);
        countEl.textContent = `${explored.size}/${systems.length}`;
        fillEl.style.width = `${(explored.size / systems.length) * 100}%`;
        if (explored.size === systems.length) {
          countEl.textContent += ' ✓';
          const done = document.createElement('p');
          done.className = 'explore-done';
          done.textContent = '🎉 Você explorou todos os sistemas!';
          infoPanel.appendChild(done);
        }
      }
    }

    hotspots.forEach(spot => {
      spot.addEventListener('click', () => activate(spot.dataset.spot));
      spot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(spot.dataset.spot); }
      });
    });

    // Arrastar para girar o holograma em 3D (pointer events).
    let dragging = false, moved = false, startX = 0, rot = 0, resumeTimer = null;
    function onDown(e) {
      dragging = true; moved = false; startX = e.clientX;
      clearTimeout(resumeTimer);
    }
    function onMove(e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) < 4 && !moved) return;
      moved = true;
      svg.classList.add('manual');
      if (hint) hint.classList.add('hidden');
      rot = Math.max(-78, Math.min(78, dx * 0.55));
      svg.style.transform = `rotateY(${rot}deg)`;
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      if (moved) {
        // Volta a girar sozinho após alguns segundos parado.
        resumeTimer = setTimeout(() => {
          svg.style.transform = '';
          svg.classList.remove('manual');
        }, 4000);
      }
    }
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointerleave', onUp);
    stage.addEventListener('pointercancel', onUp);
  }

  // 2. COMPARADOR DE REMÉDIOS
  function renderCompareTable(container) {
    let rows = EBOOK_DATA.comparison.map(drug => `
      <tr>
        <td class="comparator-drug-name">
          ${drug.name}
          <span class="comparator-drug-active">${drug.active}</span>
        </td>
        <td style="color: var(--text-muted);">${drug.class}</td>
        <td>${drug.frequency}</td>
        <td><span class="badge-efficacy">${drug.weightLoss}</span></td>
        <td style="font-size: 0.8rem; max-width: 250px;">${drug.mainEfects}</td>
        <td><span class="badge-status">${drug.status}</span></td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="comparator-wrapper fade-in">
        <table class="comparator-table">
          <thead>
            <tr>
              <th>Medicamento / Sal</th>
              <th>Classe Farmacológica</th>
              <th>Administração</th>
              <th>Perda Ponderal Média</th>
              <th>Efeitos Colaterais</th>
              <th>Status Anvisa</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  // 3. CARTÕES DE EFEITOS COLATERAIS (FLIP CARDS)
  function renderEffectsFlipCards(container) {
    let cards = EBOOK_DATA.adverseEffects.map(item => `
      <div class="effect-card-3d">
        <div class="effect-card-inner">
          <div class="effect-card-front">
            <h4>${item.symptom}</h4>
            <span class="frequency-badge">${item.frequency}</span>
            <span class="flip-hint">Clique para virar ↺</span>
          </div>
          <div class="effect-card-back">
            <h5>💡 Como Manejar este Sintoma:</h5>
            <p>${item.tip}</p>
          </div>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <p style="margin-bottom: 1.5rem;">Entenda as principais reações de adaptação do seu trato gastrointestinal e aprenda as recomendações clínicas para atenuar as náuseas e constipações.</p>
      <div class="effects-grid fade-in">
        ${cards}
      </div>
    `;

    // Adiciona evento de clique para navegadores que não suportam hover 3D nativo ou mobile
    container.querySelectorAll('.effect-card-3d').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  }

  // 4. TRIAGEM DE CONTRAINDICAÇÕES (CHECKLIST)
  function renderScreeningChecklist(container) {
    let checkboxes = EBOOK_DATA.contraindications.map(item => `
      <label class="checklist-item" for="chk-${item.id}">
        <input type="checkbox" id="chk-${item.id}" data-id="${item.id}">
        <span class="checklist-item-text">${item.text}</span>
      </label>
    `).join('');

    container.innerHTML = `
      <div class="checklist-container fade-in">
        <h5>📋 Auto-Triagem Médica Educativa</h5>
        <p class="checklist-intro">Selecione abaixo caso possua algum dos fatores clínicos listados. Nossa ferramenta processará se existem riscos conhecidos de segurança no uso de tirzepatida.</p>
        
        <div class="checklist-grid">
          ${checkboxes}
        </div>

        <div class="checklist-result-box" id="screeningResultBox">
          <!-- Resultado dinâmico -->
        </div>

        <!-- Checklist para Endocrinologista (Perguntas) -->
        <div class="doctor-consultation-box" style="margin-top: 3rem;">
          <h5>🏥 Checklist: Perguntas Chave para seu Endocrinologista</h5>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Copie ou anote estas dúvidas para garantir uma primeira consulta segura e informada:</p>
          <ul class="consult-list">
            <li class="consult-item">"Quais exames de sangue e imagem (tireoide, rins) o senhor recomenda fazer antes de iniciar?"</li>
            <li class="consult-item">"Qual será o nosso protocolo de suporte caso eu sofra com náuseas ou prisão de ventre intensas?"</li>
            <li class="consult-item">"Como estruturaremos o consumo de proteínas para que eu não perca massa muscular magra?"</li>
            <li class="consult-item">"Caso eu atinja meu peso saudável, qual será o nosso plano de desmame ou manutenção de longo prazo?"</li>
          </ul>
        </div>
      </div>
    `;

    const resultBox = document.getElementById('screeningResultBox');
    const inputs = container.querySelectorAll('.checklist-grid input[type="checkbox"]');

    function checkScreening() {
      const selected = Array.from(inputs).filter(i => i.checked);
      
      if (selected.length === 0) {
        resultBox.className = "checklist-result-box safe";
        resultBox.innerHTML = `
          <strong>✓ Triagem Concluída:</strong> Nenhum fator de risco severo direto foi selecionado. Você parece apto a discutir a prescrição com seu endocrinologista. Lembre-se que exames de sangue detalhados continuam indispensáveis!
        `;
      } else {
        resultBox.className = "checklist-result-box warning";
        resultBox.innerHTML = `
          <strong>⚠️ Alerta de Segurança:</strong> Você marcou ${selected.length} fator(es) que exigem atenção médica ou contraindicam absolutamente o uso (ex: histórico familiar de CMT, gestação). Discuta obrigatoriamente estes pontos específicos com seu especialista médico antes de qualquer atitude.
        `;
      }
    }

    inputs.forEach(input => {
      input.addEventListener('change', checkScreening);
    });

    // Roda uma primeira vez
    checkScreening();
  }

  // 5. INTERACTIVE QUIZ
  function renderQuizComponent(container) {
    state.quiz.currentQuestionIndex = 0;
    state.quiz.score = 0;
    state.quiz.userAnswers = [];
    
    showQuizQuestion(container);
  }

  function showQuizQuestion(container) {
    const isFinished = state.quiz.currentQuestionIndex >= EBOOK_DATA.quiz.length;
    
    if (isFinished) {
      renderQuizResults(container);
      return;
    }

    const currentQuestion = EBOOK_DATA.quiz[state.quiz.currentQuestionIndex];
    let optionsHtml = currentQuestion.options.map((opt, i) => `
      <button class="quiz-option-btn" data-index="${i}">
        <span style="font-weight: 700; margin-right: 0.75rem; color: var(--accent);">${String.fromCharCode(65 + i)})</span>
        ${opt}
      </button>
    `).join('');

    container.innerHTML = `
      <div class="quiz-box fade-in">
        <div class="quiz-header">
          <span class="quiz-progress-text">Pergunta ${state.quiz.currentQuestionIndex + 1} de ${EBOOK_DATA.quiz.length}</span>
          <span class="quiz-score-badge">Pontos: ${state.quiz.score} / ${EBOOK_DATA.quiz.length}</span>
        </div>

        <div class="quiz-question-text">
          ${currentQuestion.question}
        </div>

        <div class="quiz-options-container" id="quizOptionsBox">
          ${optionsHtml}
        </div>

        <div id="quizExplanationBox"></div>

        <div class="quiz-footer">
          <button class="btn-quiz-next" id="btnQuizNext" disabled>Avançar Pergunta</button>
        </div>
      </div>
    `;

    const optionBtns = container.querySelectorAll('.quiz-option-btn');
    const btnNextQuiz = document.getElementById('btnQuizNext');
    const explanationBox = document.getElementById('quizExplanationBox');
    let answered = false;

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;

        const selectedIndex = parseInt(btn.getAttribute('data-index'));
        const correctIndex = currentQuestion.correct;
        
        // Verifica Resposta
        if (selectedIndex === correctIndex) {
          btn.classList.add('correct');
          state.quiz.score++;
        } else {
          btn.classList.add('incorrect');
          // Mostra a correta
          optionBtns[correctIndex].classList.add('correct');
        }

        // Mostra explicação
        explanationBox.className = "quiz-explanation-box";
        explanationBox.innerHTML = `
          <strong>Explicação Científica:</strong> ${currentQuestion.explanation}
        `;

        // Habilita avançar
        btnNextQuiz.removeAttribute('disabled');
        
        // Salva resposta do usuário
        state.quiz.userAnswers.push(selectedIndex);
      });
    });

    btnNextQuiz.addEventListener('click', () => {
      state.quiz.currentQuestionIndex++;
      showQuizQuestion(container);
    });
  }

  function renderQuizResults(container) {
    const pct = Math.round((state.quiz.score / EBOOK_DATA.quiz.length) * 100);
    let icon = '🎓';
    let title = 'Estudioso Metabólico';
    let message = 'Excelente leitura! Você compreendeu perfeitamente o funcionamento fisiológico e os cuidados essenciais com a tirzepatida.';

    if (pct < 60) {
      icon = '📚';
      title = 'Hora de Revisar!';
      message = 'Você errou algumas questões fundamentais de segurança e contraindicação. Recomendamos reler os Capítulos 5, 6 e 11 para garantir um aprendizado seguro!';
    }

    container.innerHTML = `
      <div class="quiz-box text-center fade-in">
        <div class="quiz-results-screen">
          <div class="quiz-results-icon">${icon}</div>
          <h4 class="quiz-results-title">${title}</h4>
          <p class="quiz-results-score">Você acertou ${state.quiz.score} de ${EBOOK_DATA.quiz.length} perguntas (${pct}%)</p>
          <p class="quiz-results-feedback">${message}</p>
          <button class="btn-quiz-reset" id="btnQuizRestart">Refazer Quiz</button>
        </div>
      </div>
    `;

    document.getElementById('btnQuizRestart').addEventListener('click', () => {
      renderQuizComponent(container);
    });
  }

  // 6. DIÁRIOS INTERATIVOS (LOCAL STORAGE)
  function renderDiariesComponent(container) {
    container.innerHTML = `
      <p style="margin-bottom: 1.5rem;">Estes diários rodam localmente. Nenhuma informação é enviada a servidores externos — seus dados ficam protegidos no seu próprio navegador.</p>
      
      <div class="diary-container fade-in">
        <!-- Diário de Peso -->
        <div class="diary-form-panel">
          <h5 style="color: #fff; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">📉 Registro de Peso Corporal</h5>
          
          <form id="weightForm" class="diary-form-panel">
            <div class="diary-form-group">
              <label for="weightInput">Peso Atual (kg)</label>
              <input type="number" step="0.1" id="weightInput" class="diary-input" required placeholder="Ex: 84.5">
            </div>
            <button type="submit" class="diary-btn-submit">Salvar Peso</button>
          </form>

          <div class="diary-logs-panel" id="weightLogsContainer">
            <div class="diary-logs-heading">
              <span>Registros Salvos</span>
              <button class="btn-clear-logs" id="btnClearWeightLogs">Limpar tudo</button>
            </div>
            <div class="diary-empty-state" id="weightEmptyText">Nenhum peso registrado ainda.</div>
            <div id="weightLogsList" style="display: flex; flex-direction: column;"></div>
          </div>
        </div>

        <!-- Diário de Sintomas -->
        <div class="diary-form-panel">
          <h5 style="color: #fff; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">🤢 Controle de Efeitos Colaterais</h5>
          
          <form id="symptomForm" class="diary-form-panel">
            <div class="diary-form-group">
              <label for="symptomSelect">Sintoma Sentido</label>
              <select id="symptomSelect" class="diary-input" style="background-color: var(--bg-primary);">
                <option value="Náuseas">Náuseas</option>
                <option value="Constipação">Prisão de ventre (Constipação)</option>
                <option value="Diarreia">Diarreia</option>
                <option value="Refluxo / Azia">Refluxo ou Azia</option>
                <option value="Dor Abdominal">Dor Abdominal</option>
                <option value="Cansaço">Cansaço / Fadiga</option>
              </select>
            </div>
            
            <div class="diary-form-group">
              <label for="symptomIntensity">Intensidade (1 a 5)</label>
              <select id="symptomIntensity" class="diary-input" style="background-color: var(--bg-primary);">
                <option value="Leve (1)">Leve (1)</option>
                <option value="Moderada (3)">Moderada (3)</option>
                <option value="Forte (5)">Forte (5)</option>
              </select>
            </div>

            <button type="submit" class="diary-btn-submit" style="background: var(--accent);">Registrar Sintoma</button>
          </form>

          <div class="diary-logs-panel" id="symptomLogsContainer">
            <div class="diary-logs-heading">
              <span>Alertas Registrados</span>
              <button class="btn-clear-logs" id="btnClearSymptomLogs">Limpar tudo</button>
            </div>
            <div class="diary-empty-state" id="symptomEmptyText">Nenhum sintoma registrado ainda.</div>
            <div id="symptomLogsList" style="display: flex; flex-direction: column;"></div>
          </div>
        </div>
      </div>
    `;

    setupDiariesLogic(container);
  }

  function setupDiariesLogic(_container) {
    const weightForm = document.getElementById('weightForm');
    const weightInput = document.getElementById('weightInput');
    const weightLogsList = document.getElementById('weightLogsList');
    const weightEmptyText = document.getElementById('weightEmptyText');
    const btnClearWeight = document.getElementById('btnClearWeightLogs');

    const symptomForm = document.getElementById('symptomForm');
    const symptomSelect = document.getElementById('symptomSelect');
    const symptomIntensity = document.getElementById('symptomIntensity');
    const symptomLogsList = document.getElementById('symptomLogsList');
    const symptomEmptyText = document.getElementById('symptomEmptyText');
    const btnClearSymptom = document.getElementById('btnClearSymptomLogs');

    // Funções auxiliares LocalStorage
    function getWeightLogs() {
      return JSON.parse(localStorage.getItem('mounjaro_weights')) || [];
    }

    function getSymptomLogs() {
      return JSON.parse(localStorage.getItem('mounjaro_symptoms')) || [];
    }

    function renderWeightList() {
      const logs = getWeightLogs();
      if (logs.length === 0) {
        weightEmptyText.style.display = 'block';
        weightLogsList.innerHTML = '';
        return;
      }
      weightEmptyText.style.display = 'none';
      weightLogsList.innerHTML = logs.map(log => `
        <div class="log-item-row">
          <span class="log-item-date">${log.date}</span>
          <span class="log-item-value">${log.val} kg</span>
        </div>
      `).join('');
    }

    function renderSymptomList() {
      const logs = getSymptomLogs();
      if (logs.length === 0) {
        symptomEmptyText.style.display = 'block';
        symptomLogsList.innerHTML = '';
        return;
      }
      symptomEmptyText.style.display = 'none';
      symptomLogsList.innerHTML = logs.map(log => `
        <div class="log-item-row">
          <span class="log-item-date">${log.date}</span>
          <span style="font-weight:600; color:#fff;">${log.name}</span>
          <span class="log-item-tag">${log.intensity}</span>
        </div>
      `).join('');
    }

    // Handlers
    weightForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = parseFloat(weightInput.value);
      if (isNaN(val)) return;

      const logs = getWeightLogs();
      const now = new Date();
      const dateStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')} - ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
      
      logs.unshift({ date: dateStr, val: val }); // Adiciona no início
      localStorage.setItem('mounjaro_weights', JSON.stringify(logs));
      
      weightInput.value = '';
      renderWeightList();
    });

    symptomForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = symptomSelect.value;
      const intensity = symptomIntensity.value;

      const logs = getSymptomLogs();
      const now = new Date();
      const dateStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')} - ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

      logs.unshift({ date: dateStr, name: name, intensity: intensity });
      localStorage.setItem('mounjaro_symptoms', JSON.stringify(logs));
      
      renderSymptomList();
    });

    btnClearWeight.addEventListener('click', () => {
      if (confirm('Deseja realmente limpar todos os registros de peso?')) {
        localStorage.removeItem('mounjaro_weights');
        renderWeightList();
      }
    });

    btnClearSymptom.addEventListener('click', () => {
      if (confirm('Deseja realmente limpar todos os registros de sintomas?')) {
        localStorage.removeItem('mounjaro_symptoms');
        renderSymptomList();
      }
    });

    // Primeira carga das listas de diário
    renderWeightList();
    renderSymptomList();
  }

  // ==========================================
  // 7. SIMULADOR DO MOUNJARO KWIKPEN (BÔNUS REFERENCIAL)
  // ==========================================
  function renderKwikPenSimulator(container) {
    let simState = {
      step: 1,
      washed: false,
      inspected: false,
      wiped: false,
      needleOn: false,
      primedClicks: false,
      primeReleased: false,
      doseSelected: false,
      siteSelected: '',
      injected: false,
      finished: false
    };

    renderStep();

    function renderStep() {
      container.innerHTML = `
        <div class="simulator-box fade-in" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 2rem; border-radius: 16px; box-shadow: var(--shadow-lg); margin-top: 1rem;">
          <div class="sim-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem;">
            <h5 style="color: #fff; font-family: var(--font-title); font-size: 1.1rem; margin: 0;">💉 Simulador de Aplicação KwikPen</h5>
            <span style="font-size: 0.75rem; color: var(--accent); font-weight: 700; text-transform: uppercase;">Passo ${simState.step} de 6</span>
          </div>

          <!-- Barra de Progresso do Passo -->
          <div class="sim-step-bar" style="display: flex; gap: 0.35rem; margin-bottom: 2rem;">
            ${[1, 2, 3, 4, 5, 6].map(i => `
              <div style="flex-grow: 1; height: 5px; border-radius: 2px; background: ${i < simState.step ? 'var(--primary)' : i === simState.step ? 'var(--accent)' : 'var(--bg-tertiary)'}; box-shadow: ${i === simState.step ? '0 0 8px var(--accent-glow)' : 'none'}; transition: var(--transition-fast);"></div>
            `).join('')}
          </div>

          <div class="sim-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
            
            <!-- Painel Interativo Esquerdo (Visualização da Caneta / Instruções) -->
            <div class="sim-visual-panel" style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px; padding: 2rem; height: 260px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; position: relative;">
              ${getVisualRepresentation()}
            </div>

            <!-- Painel de Ações Direito -->
            <div class="sim-actions-panel" style="display: flex; flex-direction: column; gap: 1rem; min-height: 260px; justify-content: space-between;">
              <div class="sim-instructions">
                <h6 style="font-family: var(--font-title); font-size: 1rem; color: #fff; margin-bottom: 0.5rem;" id="simStepTitle"></h6>
                <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;" id="simStepDesc"></p>
              </div>

              <div class="sim-interactive-buttons" style="display: flex; flex-direction: column; gap: 0.75rem;" id="simButtonsBox">
                <!-- Botões gerados por JS -->
              </div>

              <div class="sim-nav-buttons" style="display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: auto;">
                <button class="btn-utility" id="btnSimNext" style="background: var(--primary); color: var(--text-inverse); border: none; font-weight: 700;" disabled>Próximo Passo</button>
              </div>
            </div>

          </div>
        </div>
      `;

      setupStepEvents();
    }

    // Retorna a representação gráfica de cada etapa
    function getVisualRepresentation() {
      switch (simState.step) {
        case 1:
          return `
            <span style="font-size: 3.5rem;">🧼</span>
            <div style="margin-top: 1rem; font-family: var(--font-title); font-weight: 600; color: #fff;">Área de Preparação</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 5px;">Mãos higienizadas: ${simState.washed ? '✅' : '❌'} | Caneta inspecionada: ${simState.inspected ? '✅' : '❌'}</div>
          `;
        case 2:
          return `
            <span style="font-size: 3.5rem;">📌</span>
            <div style="margin-top: 1rem; font-family: var(--font-title); font-weight: 600; color: #fff;">Acoplamento da Agulha</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 5px;">Lacre limpo: ${simState.wiped ? '✅' : '❌'} | Agulha colocada: ${simState.needleOn ? '✅' : '❌'}</div>
          `;
        case 3:
          return `
            <div class="pen-priming-view" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
              <div style="font-size: 2.5rem; animation: float-bubble 2s ease-in-out infinite;">💧</div>
              <div style="font-family: var(--font-title); font-weight: 700; font-size: 1rem; color: #fff;">Purgar Caneta (Remover Ar)</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">
                Janela de Dose: <span style="background: var(--bg-tertiary); font-family: monospace; padding: 2px 8px; border-radius: 4px; color: var(--accent); font-weight: 700;">${simState.primedClicks ? 'Prime [╎]' : '0'}</span>
              </div>
              <div id="primingProgressBox" style="width: 150px; background: var(--bg-tertiary); height: 6px; border-radius: 3px; display: none; margin-top: 5px; overflow: hidden;">
                <div id="primingProgressBar" style="width: 0%; height: 100%; background: var(--primary); transition: width 0.1s linear;"></div>
              </div>
            </div>
          `;
        case 4:
          return `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
              <span style="font-size: 3.5rem;">⚙️</span>
              <div style="font-family: var(--font-title); font-weight: 600; color: #fff;">Seleção de Dosagem</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">
                Visor de Dose: <span style="background: var(--bg-tertiary); font-family: monospace; font-size: 1.1rem; padding: 4px 12px; border-radius: 4px; color: ${simState.doseSelected ? 'var(--primary-light)' : 'var(--text-muted)'}; font-weight: 700; border: 1px solid var(--border-color);">${simState.doseSelected ? '1 [Dose Cheia]' : '0'}</span>
              </div>
            </div>
          `;
        case 5:
          return `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; width: 100%;">
              <span id="injectionSimIcon" style="font-size: 3rem; transition: transform 0.5s ease;">💉</span>
              <div style="font-family: var(--font-title); font-weight: 600; color: #fff;">Aplicação no Corpo</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">
                Local: <span style="color: var(--accent); font-weight:700;">${simState.siteSelected || 'Não escolhido'}</span>
              </div>
              <div id="injectionProgressBox" style="width: 150px; background: var(--bg-tertiary); height: 6px; border-radius: 3px; display: none; margin-top: 5px; overflow: hidden;">
                <div id="injectionProgressBar" style="width: 0%; height: 100%; background: var(--accent); transition: width 0.1s linear;"></div>
              </div>
            </div>
          `;
        case 6:
          return `
            <span style="font-size: 3.5rem;">🗑️</span>
            <div style="margin-top: 1rem; font-family: var(--font-title); font-weight: 600; color: #fff;">Descarte Clínico Seguro</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 5px;">Agulha retirada: ${simState.needleRemoved ? '✅' : '❌'} | Tampa recolocada: ${simState.penCapped ? '✅' : '❌'}</div>
          `;
      }
    }

    // Configuração dos Textos e Ouvintes de Evento do Passo
    function setupStepEvents() {
      const title = document.getElementById('simStepTitle');
      const desc = document.getElementById('simStepDesc');
      const box = document.getElementById('simButtonsBox');
      const btnNext = document.getElementById('btnSimNext');

      btnNext.addEventListener('click', () => {
        if (simState.step < 6) {
          simState.step++;
          renderStep();
        } else {
          renderFinalScreen();
        }
      });

      switch (simState.step) {
        case 1:
          title.textContent = "Etapa 1: Higienização e Inspeção";
          desc.textContent = "Antes de começar, é vital inspecionar a caneta. O líquido do Mounjaro deve ser incolor ou levemente amarelado, sem partículas ou turvação. Lave as mãos com água e sabão.";
          
          box.innerHTML = `
            <button class="quiz-option-btn" id="btnWash" style="justify-content: center; ${simState.washed ? 'background: var(--primary-glow); border-color: var(--primary);' : ''}">🧼 Lavar as Mãos</button>
            <button class="quiz-option-btn" id="btnInspect" style="justify-content: center; ${simState.inspected ? 'background: var(--primary-glow); border-color: var(--primary);' : ''}">🔍 Inspecionar Líquido & Validade</button>
          `;

          const btnWash = document.getElementById('btnWash');
          const btnInspect = document.getElementById('btnInspect');

          btnWash.addEventListener('click', () => {
            simState.washed = true;
            btnWash.style.background = 'var(--primary-glow)';
            btnWash.style.borderColor = 'var(--primary)';
            checkStep1();
          });

          btnInspect.addEventListener('click', () => {
            simState.inspected = true;
            btnInspect.style.background = 'var(--primary-glow)';
            btnInspect.style.borderColor = 'var(--primary)';
            checkStep1();
          });

          function checkStep1() {
            if (simState.washed && simState.inspected) {
              btnNext.removeAttribute('disabled');
            }
          }
          break;

        case 2:
          title.textContent = "Etapa 2: Preparação do Lacre e Agulha";
          desc.textContent = "Retire a tampa da caneta. Use um algodão embebido em álcool para desinfetar o selo de borracha vermelho na ponta da caneta. Remova o selo protetor de papel de uma agulha nova e rosqueie-a firmemente.";
          
          box.innerHTML = `
            <button class="quiz-option-btn" id="btnWipe" style="justify-content: center; ${simState.wiped ? 'background: var(--primary-glow); border-color: var(--primary);' : ''}">🧼 Limpar Selo Vermelho com Álcool</button>
            <button class="quiz-option-btn" id="btnNeedle" style="justify-content: center; ${simState.needleOn ? 'background: var(--primary-glow); border-color: var(--primary);' : ''}" ${simState.wiped ? '' : 'disabled'}>📌 Rosquear Nova Agulha Estéril</button>
          `;

          const btnWipe = document.getElementById('btnWipe');
          const btnNeedle = document.getElementById('btnNeedle');

          btnWipe.addEventListener('click', () => {
            simState.wiped = true;
            btnWipe.style.background = 'var(--primary-glow)';
            btnWipe.style.borderColor = 'var(--primary)';
            btnNeedle.removeAttribute('disabled');
            checkStep2();
          });

          btnNeedle.addEventListener('click', () => {
            simState.needleOn = true;
            btnNeedle.style.background = 'var(--primary-glow)';
            btnNeedle.style.borderColor = 'var(--primary)';
            checkStep2();
          });

          function checkStep2() {
            if (simState.wiped && simState.needleOn) {
              btnNext.removeAttribute('disabled');
            }
          }
          break;

        case 3:
          title.textContent = "Etapa 3: Purga da Caneta (Priming)";
          desc.textContent = "Antes de cada injeção, purgue a caneta para remover bolhas de ar. Gire o botão de dose até ouvir DOIS cliques (símbolo de purga na janela). Depois, aponte a agulha para cima, dê leves toques e mantenha o botão pressionado por 5 segundos.";
          
          box.innerHTML = `
            <button class="quiz-option-btn" id="btnPrimeTurn" style="justify-content: center; ${simState.primedClicks ? 'background: var(--primary-glow); border-color: var(--primary);' : ''}">⚙️ Girar Botão (Ouvir 2 cliques)</button>
            <button class="quiz-option-btn" id="btnPrimePush" style="justify-content: center;" ${simState.primedClicks ? '' : 'disabled'}>💧 Pressione e Segure por 5s</button>
          `;

          const btnPrimeTurn = document.getElementById('btnPrimeTurn');
          const btnPrimePush = document.getElementById('btnPrimePush');

          btnPrimeTurn.addEventListener('click', () => {
            simState.primedClicks = true;
            btnPrimeTurn.style.background = 'var(--primary-glow)';
            btnPrimeTurn.style.borderColor = 'var(--primary)';
            btnPrimePush.removeAttribute('disabled');
            // Força re-renderizar para atualizar o visor da caneta
            const visual = container.querySelector('.sim-visual-panel');
            visual.innerHTML = getVisualRepresentation();
          });

          btnPrimePush.addEventListener('mousedown', startPrimingProgress);
          btnPrimePush.addEventListener('touchstart', startPrimingProgress);

          let primeTimer = null;
          function startPrimingProgress() {
            const progressBox = document.getElementById('primingProgressBox');
            const progressBar = document.getElementById('primingProgressBar');
            
            progressBox.style.display = 'block';
            btnPrimePush.textContent = "Segurando...";
            
            let count = 0;
            progressBar.style.width = '0%';
            
            clearInterval(primeTimer);
            primeTimer = setInterval(() => {
              count += 2;
              progressBar.style.width = `${count}%`;
              
              if (count >= 100) {
                clearInterval(primeTimer);
                simState.primeReleased = true;
                btnPrimePush.textContent = "✓ Purga Efetuada!";
                btnPrimePush.style.background = 'var(--primary-glow)';
                btnPrimePush.style.borderColor = 'var(--primary)';
                btnPrimePush.setAttribute('disabled', 'true');
                btnNext.removeAttribute('disabled');
                
                // Atualiza visual mostrando a gotícula de teste
                const visual = container.querySelector('.sim-visual-panel');
                visual.innerHTML = `
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                    <div style="font-size: 3rem; animation: float-bubble 1s ease-in-out infinite;">💧</div>
                    <div style="font-family: var(--font-title); font-weight: 700; color: var(--primary-light);">Purgado com Sucesso!</div>
                    <p style="font-size: 0.75rem; color: var(--text-muted); max-width: 200px;">Uma pequena quantidade de líquido saiu pela agulha. A caneta está livre de bolhas.</p>
                  </div>
                `;
              }
            }, 100);
          }
          
          // Se soltar antes do tempo
          function cancelPriming() {
            if (!simState.primeReleased) {
              clearInterval(primeTimer);
              const progressBar = document.getElementById('primingProgressBar');
              if (progressBar) progressBar.style.width = '0%';
              btnPrimePush.textContent = "💧 Pressione e Segure por 5s";
            }
          }
          btnPrimePush.addEventListener('mouseup', cancelPriming);
          btnPrimePush.addEventListener('mouseleave', cancelPriming);
          btnPrimePush.addEventListener('touchend', cancelPriming);
          break;

        case 4:
          title.textContent = "Etapa 4: Seleção da Dose Clínica";
          desc.textContent = "Com a caneta purgada, gire o botão de dose no sentido horário até travar completamente. A janela de dosagem mudará para exibir o número '1', indicando que uma dose inteira de tirzepatida foi carregada.";
          
          box.innerHTML = `
            <button class="quiz-option-btn" id="btnSelectDose" style="justify-content: center; ${simState.doseSelected ? 'background: var(--primary-glow); border-color: var(--primary);' : ''}">⚙️ Girar Botão até o Limite (Exibir '1')</button>
          `;

          const btnSelectDose = document.getElementById('btnSelectDose');
          btnSelectDose.addEventListener('click', () => {
            simState.doseSelected = true;
            btnSelectDose.style.background = 'var(--primary-glow)';
            btnSelectDose.style.borderColor = 'var(--primary)';
            btnSelectDose.setAttribute('disabled', 'true');
            btnNext.removeAttribute('disabled');
            
            // Re-renderiza o painel visual
            const visual = container.querySelector('.sim-visual-panel');
            visual.innerHTML = getVisualRepresentation();
          });
          break;

        case 5:
          title.textContent = "Etapa 5: Escolha do Local e Injeção";
          desc.textContent = "Escolha um local de aplicação (Abdômen, Coxa ou Braço) e higienize a pele. Insira a agulha verticalmente sob a pele. Mantenha o botão de injeção pressionado e conte lentamente até 5 para injetar todo o líquido.";
          
          box.innerHTML = `
            <div style="display: flex; gap: 0.5rem; width: 100%;">
              <button class="btn-utility" id="btnSiteAbdomen" style="flex-grow:1; font-size:0.75rem; justify-content:center;">Abdômen</button>
              <button class="btn-utility" id="btnSiteThigh" style="flex-grow:1; font-size:0.75rem; justify-content:center;">Coxa</button>
              <button class="btn-utility" id="btnSiteArm" style="flex-grow:1; font-size:0.75rem; justify-content:center;">Braço</button>
            </div>
            <button class="quiz-option-btn" id="btnInjectPush" style="justify-content: center;" disabled>💉 Pressionar e Segurar Injeção por 5s</button>
          `;

          const btnSiteAbdomen = document.getElementById('btnSiteAbdomen');
          const btnSiteThigh = document.getElementById('btnSiteThigh');
          const btnSiteArm = document.getElementById('btnSiteArm');
          const btnInjectPush = document.getElementById('btnInjectPush');

          function selectSite(siteName, btnActive) {
            simState.siteSelected = siteName;
            [btnSiteAbdomen, btnSiteThigh, btnSiteArm].forEach(b => {
              b.style.background = 'var(--bg-tertiary)';
              b.style.borderColor = 'var(--border-color)';
            });
            btnActive.style.background = 'var(--accent-glow)';
            btnActive.style.borderColor = 'var(--accent)';
            
            btnInjectPush.removeAttribute('disabled');
            
            // Atualiza visual
            const visual = container.querySelector('.sim-visual-panel');
            visual.innerHTML = getVisualRepresentation();
          }

          btnSiteAbdomen.addEventListener('click', () => selectSite('Abdômen (5cm do umbigo)', btnSiteAbdomen));
          btnSiteThigh.addEventListener('click', () => selectSite('Coxa Subcutâneo', btnSiteThigh));
          btnSiteArm.addEventListener('click', () => selectSite('Posterior do Braço', btnSiteArm));

          btnInjectPush.addEventListener('mousedown', startInjectionProgress);
          btnInjectPush.addEventListener('touchstart', startInjectionProgress);

          let injectTimer = null;
          function startInjectionProgress() {
            const progressBox = document.getElementById('injectionProgressBox');
            const progressBar = document.getElementById('injectionProgressBar');
            const injectIcon = document.getElementById('injectionSimIcon');
            
            progressBox.style.display = 'block';
            btnInjectPush.textContent = "Injetando dose...";
            if (injectIcon) injectIcon.style.transform = 'translateY(15px) scale(0.9)';
            
            let count = 0;
            progressBar.style.width = '0%';
            
            clearInterval(injectTimer);
            injectTimer = setInterval(() => {
              count += 2;
              progressBar.style.width = `${count}%`;
              
              if (count >= 100) {
                clearInterval(injectTimer);
                simState.injected = true;
                btnInjectPush.textContent = "✓ Injeção Concluída!";
                btnInjectPush.style.background = 'var(--primary-glow)';
                btnInjectPush.style.borderColor = 'var(--primary)';
                btnInjectPush.setAttribute('disabled', 'true');
                
                [btnSiteAbdomen, btnSiteThigh, btnSiteArm].forEach(b => b.setAttribute('disabled', 'true'));
                btnNext.removeAttribute('disabled');
                
                // Mostra visor zerado (finalizado)
                const visual = container.querySelector('.sim-visual-panel');
                visual.innerHTML = `
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 3.5rem;">✨</span>
                    <div style="font-family: var(--font-title); font-weight: 700; color: var(--primary-light);">Dose Aplicada!</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Janela de Dose: <span style="background: var(--bg-tertiary); font-family: monospace; font-weight: 700; padding: 2px 8px; color: #fff;">0</span></div>
                  </div>
                `;
              }
            }, 100);
          }

          function cancelInjection() {
            if (!simState.injected) {
              clearInterval(injectTimer);
              const progressBar = document.getElementById('injectionProgressBar');
              if (progressBar) progressBar.style.width = '0%';
              btnInjectPush.textContent = "💉 Pressionar e Segurar Injeção por 5s";
              const injectIcon = document.getElementById('injectionSimIcon');
              if (injectIcon) injectIcon.style.transform = 'translateY(0) scale(1)';
            }
          }

          btnInjectPush.addEventListener('mouseup', cancelInjection);
          btnInjectPush.addEventListener('mouseleave', cancelInjection);
          btnInjectPush.addEventListener('touchend', cancelInjection);
          break;

        case 6:
          title.textContent = "Etapa 6: Descarte Seguro e Guarda";
          desc.textContent = "Ao puxar a agulha, você pode ver uma pequena gota de sangue (pressione sem esfregar com algodão). Encaixe com cuidado o protetor externo na agulha, rosqueie no sentido anti-horário para tirá-la e jogue em recipiente perfurocortante. Recoloque a tampa da caneta.";
          
          box.innerHTML = `
            <button class="quiz-option-btn" id="btnDispose" style="justify-content: center; ${simState.needleRemoved ? 'background: var(--primary-glow); border-color: var(--primary);' : ''}">🗑️ Remover e Descartar Agulha</button>
            <button class="quiz-option-btn" id="btnCap" style="justify-content: center; ${simState.penCapped ? 'background: var(--primary-glow); border-color: var(--primary);' : ''}" ${simState.needleRemoved ? '' : 'disabled'}>⚙️ Recolocar a Tampa da Caneta</button>
          `;

          const btnDispose = document.getElementById('btnDispose');
          const btnCap = document.getElementById('btnCap');

          btnDispose.addEventListener('click', () => {
            simState.needleRemoved = true;
            btnDispose.style.background = 'var(--primary-glow)';
            btnDispose.style.borderColor = 'var(--primary)';
            btnCap.removeAttribute('disabled');
            checkStep6();
          });

          btnCap.addEventListener('click', () => {
            simState.penCapped = true;
            btnCap.style.background = 'var(--primary-glow)';
            btnCap.style.borderColor = 'var(--primary)';
            checkStep6();
          });

          function checkStep6() {
            if (simState.needleRemoved && simState.penCapped) {
              btnNext.removeAttribute('disabled');
              btnNext.textContent = "Concluir Simulação";
            }
          }
          break;
      }
    }

    function renderFinalScreen() {
      container.innerHTML = `
        <div class="simulator-box text-center fade-in" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 3rem; border-radius: 16px; box-shadow: var(--shadow-lg); margin-top: 1rem; text-align: center;">
          <span style="font-size: 3.5rem;">🎉</span>
          <h4 style="font-family: var(--font-title); font-size: 1.75rem; font-weight: 800; color: #fff; margin-top: 1rem; margin-bottom: 0.5rem;">Simulação Concluída!</h4>
          <p style="font-size: 1.1rem; color: var(--primary-light); font-weight: 600; margin-bottom: 1.5rem;">Você aprendeu o protocolo de administração clínica da caneta KwikPen.</p>
          <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 500px; margin: 0 auto 2rem auto; line-height: 1.6;">
            Parabéns! Você completou com excelência as 6 etapas fundamentais: higienização das mãos, desinfecção do lacre, purga de ar, seleção de dosagem, injeção subcutânea controlada de 5 segundos e descarte estéril. Este aprendizado é vital para evitar desperdícios ou subdosagem em um tratamento real.
          </p>
          <button class="btn-quiz-reset" id="btnRestartSim">Refazer Simulação</button>
        </div>
      `;

      document.getElementById('btnRestartSim').addEventListener('click', () => {
        renderKwikPenSimulator(container);
      });
    }
  }

});
