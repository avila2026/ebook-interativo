// js/voice-agent.js

class VoiceAgent {
  constructor() {
    this.pc = null;
    this.dc = null;
    this.audioEl = null;
    this.microphoneStream = null;
    this.isActive = false;
    this.btn = null;
  }

  init() {
    // Sempre cria a interface para permitir que o usuário configure dinamicamente
    this.createUI();
  }

  async promptForApiKey() {
    return new Promise((resolve) => {
      // Cria a estrutura do modal
      const modal = document.createElement('div');
      modal.className = 'api-key-modal-overlay';
      modal.innerHTML = `
        <div class="api-key-modal-content">
          <h3>Configurar API Key da OpenAI</h3>
          <p>Para conversar com o Ebook e usar o Narrador com voz hiper-realista, insira sua chave de API da OpenAI (sk-...). Ela será salva localmente no seu navegador e nunca será exposta ou enviada para o GitHub.</p>
          <input type="password" id="modalApiKeyInput" placeholder="sk-proj-..." class="api-key-input" />
          <div class="api-key-modal-actions">
            <button id="btnCancelApiKey" class="btn-cancel">Cancelar</button>
            <button id="btnSaveApiKey" class="btn-save">Salvar e Conectar</button>
          </div>
          <p class="api-key-hint">Você pode obter uma chave em <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener">platform.openai.com</a></p>
        </div>
      `;

      // Estilo dinâmico para o modal
      const style = document.createElement('style');
      style.id = 'api-key-modal-styles';
      style.innerHTML = `
        .api-key-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease forwards;
        }
        .api-key-modal-content {
          background: var(--bg-secondary, #1a1a1a);
          border: 1px solid var(--border-color, rgba(255,255,255,0.1));
          border-radius: 16px;
          padding: 24px;
          max-width: 450px;
          width: 90%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          text-align: center;
          color: var(--text-primary, #ffffff);
          animation: slideUp 0.3s ease forwards;
        }
        .api-key-modal-content h3 {
          margin-top: 0;
          font-family: var(--font-display, inherit);
          font-size: 1.5rem;
          color: var(--primary-light, #10b981);
        }
        .api-key-modal-content p {
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 16px 0;
          color: var(--text-secondary, #b3b3b3);
        }
        .api-key-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color, rgba(255,255,255,0.1));
          background: var(--bg-tertiary, #0d0d0d);
          color: var(--text-primary, #ffffff);
          font-size: 1rem;
          margin-bottom: 20px;
          box-sizing: border-box;
        }
        .api-key-input:focus {
          outline: none;
          border-color: var(--primary-light, #10b981);
        }
        .api-key-modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .btn-cancel, .btn-save {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }
        .btn-cancel {
          background: rgba(255,255,255,0.05);
          color: var(--text-primary, #ffffff);
          border: 1px solid var(--border-color, rgba(255,255,255,0.1));
        }
        .btn-cancel:hover {
          background: rgba(255,255,255,0.1);
        }
        .btn-save {
          background: var(--primary-light, #10b981);
          color: #ffffff;
        }
        .btn-save:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .api-key-hint {
          font-size: 0.8rem !important;
          margin-top: 16px !important;
        }
        .api-key-hint a {
          color: var(--primary-light, #10b981);
          text-decoration: none;
        }
        .api-key-hint a:hover {
          text-decoration: underline;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `;

      if (!document.getElementById('api-key-modal-styles')) {
        document.head.appendChild(style);
      }
      document.body.appendChild(modal);

      const input = modal.querySelector('#modalApiKeyInput');
      input.focus();

      const cleanup = () => {
        modal.remove();
      };

      modal.querySelector('#btnCancelApiKey').addEventListener('click', () => {
        cleanup();
        resolve(null);
      });

      modal.querySelector('#btnSaveApiKey').addEventListener('click', () => {
        const value = input.value.trim();
        cleanup();
        resolve(value || null);
      });

      // Permite salvar com Enter
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const value = input.value.trim();
          cleanup();
          resolve(value || null);
        }
      });
    });
  }

  createUI() {
    // Dock fixo que agrupa o botão de voz e o controle de recolher.
    this.dock = document.createElement('div');
    this.dock.className = 'voice-agent-dock';

    // Controle de recolher/expandir (handle). Quando recolhido, vira o atalho
    // para reabrir o botão; quando expandido, vira o "×" para esconder.
    this.collapseBtn = document.createElement('button');
    this.collapseBtn.type = 'button';
    this.collapseBtn.className = 'btn-voice-collapse';

    this.btn = document.createElement('button');
    this.btn.id = 'btnVoiceAgent';
    this.btn.className = 'btn-voice-agent';
    this.btn.innerHTML = '<span class="icon">🎙️</span><span class="label">Falar com o Ebook</span>';

    this.dock.appendChild(this.btn);
    this.dock.appendChild(this.collapseBtn);
    document.body.appendChild(this.dock);

    // Estado inicial: recolhido por padrão no mobile (sai da frente do conteúdo).
    const saved = localStorage.getItem('mounjaro_voice_collapsed');
    const startCollapsed = saved === null
      ? window.matchMedia('(max-width: 768px)').matches
      : saved === '1';
    this._setCollapsed(startCollapsed);

    this.collapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Não recolhe enquanto estiver em uso, para não esconder o controle ativo.
      if (this.isActive && !this.dock.classList.contains('collapsed')) return;
      this._setCollapsed(!this.dock.classList.contains('collapsed'));
    });

    this.audioEl = document.createElement('audio');
    this.audioEl.autoplay = true;

    this.btn.addEventListener('click', () => this.toggle());
  }

  _setCollapsed(on) {
    if (!this.dock) return;
    this.dock.classList.toggle('collapsed', on);
    localStorage.setItem('mounjaro_voice_collapsed', on ? '1' : '0');
    this.collapseBtn.textContent = on ? '🎙️' : '×';
    this.collapseBtn.setAttribute(
      'aria-label',
      on ? 'Abrir botão de voz' : 'Recolher botão de voz'
    );
  }

  async toggle() {
    if (this.isActive) {
      this.stop();
    } else {
      await this.start();
    }
  }

  async start() {
    let token = window.APP_CONFIG?.openai?.apiKey;
    if (!token) {
      token = await this.promptForApiKey();
      if (!token) {
        return; // Usuário cancelou ou não forneceu chave
      }
      window.APP_CONFIG.openai.apiKey = token;
    }

    try {
      this.btn.classList.add('connecting');
      this.btn.querySelector('.label').textContent = 'Conectando...';

      // 1. Pega o microfone
      this.microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Inicializa o WebRTC
      this.pc = new RTCPeerConnection();

      // Adiciona o áudio local
      this.pc.addTrack(this.microphoneStream.getTracks()[0]);

      // Recebe o áudio remoto
      this.pc.ontrack = (e) => {
        this.audioEl.srcObject = e.streams[0];
      };

      // 3. Canal de Dados para gerenciar Sessão e Function Calling
      this.dc = this.pc.createDataChannel('oai-events');
      this.setupDataChannel();

      // 4. Cria oferta SDP
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // 5. Autentica e pega a resposta SDP do OpenAI (Realtime API)
      const baseUrl = 'https://api.openai.com/v1/realtime';
      const model = 'gpt-4o-realtime-preview-2024-12-17';

      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/sdp'
        }
      });

      if (!sdpResponse.ok) {
        throw new Error('Falha na conexão WebRTC com a OpenAI');
      }

      const answer = {
        type: 'answer',
        sdp: await sdpResponse.text()
      };
      await this.pc.setRemoteDescription(answer);

      this.isActive = true;
      this.btn.classList.remove('connecting');
      this.btn.classList.add('active');
      this.btn.querySelector('.label').textContent = 'Ouvindo...';

    } catch (e) {
      console.error('Erro no Agente de Voz:', e);
      this.stop();
      alert('Não foi possível conectar ao Agente de Voz. Verifique o microfone e a API Key.');
    }
  }

  setupDataChannel() {
    this.dc.addEventListener('open', () => {
      // Atualiza a sessão instruindo o agente
      const sessionUpdate = {
        type: 'session.update',
        session: {
          instructions: 'Você é um assistente de voz interativo do ebook "Mounjaro Sem Mitos". Fale em português do Brasil de forma amigável, clara e concisa. Responda dúvidas baseando-se no contexto de perda de peso e saúde. Você tem ferramentas para mudar a página do ebook se o usuário pedir para ir para algum capítulo específico (ex: "me leve para o capítulo 1").',
          tools: [
            {
              type: 'function',
              name: 'navegar_capitulo',
              description: 'Muda a página atual do ebook para o capítulo solicitado.',
              parameters: {
                type: 'object',
                properties: {
                  chapter_id: {
                    type: 'string',
                    description: 'O ID do capítulo para o qual navegar. Valores possíveis: introducao, capitulo-1, capitulo-2, capitulo-3, capitulo-4, capitulo-5, capitulo-6, capitulo-7, capitulo-8, capitulo-9, capitulo-10, capitulo-11, capitulo-12, conclusao, recursos-interativos'
                  }
                },
                required: ['chapter_id']
              }
            }
          ]
        }
      };
      this.dc.send(JSON.stringify(sessionUpdate));
    });

    this.dc.addEventListener('message', (e) => {
      try {
        const event = JSON.parse(e.data);
        
        // Log para debug
        // console.log('OAI Event:', event.type);

        // Quando o modelo decidir usar a nossa Tool
        if (event.type === 'response.function_call_arguments.done') {
          const args = JSON.parse(event.arguments);
          if (event.name === 'navegar_capitulo' && args.chapter_id) {
            
            // Chama a função global do app.js para navegar
            if (typeof window.loadChapter === 'function') {
              window.loadChapter(args.chapter_id);
            }

            // Precisamos responder à chamada de função para o modelo saber que deu certo
            const callId = event.call_id;
            const functionOutput = {
              type: 'conversation.item.create',
              item: {
                type: 'function_call_output',
                call_id: callId,
                output: JSON.stringify({ success: true, message: 'Navegação realizada com sucesso para o capitulo ' + args.chapter_id })
              }
            };
            this.dc.send(JSON.stringify(functionOutput));
            
            // Pede para ele gerar a resposta de áudio ("Entendido, navegando...")
            this.dc.send(JSON.stringify({ type: 'response.create' }));
          }
        }

      } catch (err) {
        console.error('Erro processando mensagem do DC:', err);
      }
    });
  }

  stop() {
    this.isActive = false;
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach(t => t.stop());
      this.microphoneStream = null;
    }
    if (this.btn) {
      this.btn.classList.remove('active', 'connecting');
      this.btn.querySelector('.label').textContent = 'Falar com o Ebook';
    }
  }
}

// Inicializa quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
  window.voiceAgent = new VoiceAgent();
  window.voiceAgent.init();
});
