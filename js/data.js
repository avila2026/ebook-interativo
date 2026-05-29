// js/data.js
// Banco de dados de conteúdo para o Ebook Web Interativo - Mounjaro sem Mitos

const EBOOK_DATA = {
  metadata: {
    title: "Mounjaro sem Mitos",
    subtitle: "O Guia Simples e Prático sobre a Tirzepatida e o Emagrecimento Saudável",
    author: "Saúde Descomplicada",
    version: "1.0",
    lastUpdated: "Maio de 2026"
  },
  
  chapters: [
    {
      id: "introducao",
      type: "content",
      title: "Introdução",
      subtitle: "Sua Jornada para uma Vida Mais Leve",
      summary: "Descubra como a ciência está ajudando pessoas a recuperarem a saúde e a qualidade de vida.",
      // Para ativar um vídeo neste capítulo, descomente o bloco abaixo e ajuste a URL.
      // Apenas `url` e `title` são obrigatórios; thumbnail/description/duration são opcionais.
      // video: {
      //   type: "mp4",
      //   url: "assets/videos/seu-video.mp4", // coloque o arquivo .mp4 em assets/videos/
      //   title: "Título do vídeo",
      //   description: "Descrição opcional.",            // opcional
      //   thumbnail: "assets/images/mounjaro_box.jpg",   // opcional (capa/poster)
      //   duration: "3:20"                               // opcional
      // },
      // Obs.: para suporte offline total deste vídeo, adicione o caminho ao APP_SHELL
      // em service-worker.js e suba o CACHE_VERSION.
      content: `
        <div class="visual-placeholder image-box" data-image="health_cover">
          <p class="image-caption">Mounjaro sem Mitos: Porque você merece uma vida com mais energia e saúde.</p>
        </div>

        <p class="lead">Você já sentiu que, por mais que tente, o seu próprio corpo parece jogar contra você na hora de emagrecer? Você não está sozinho. A boa notícia é que a ciência avançou muito nessa área, e estamos vivendo <strong>um avanço significativo no tratamento</strong> da obesidade e do diabetes tipo 2.</p>
        
        <p>Nos últimos tempos, você provavelmente tem visto na TV e nas redes sociais histórias de pessoas que transformaram seus corpos e recuperaram a alegria de viver. Grande parte dessa revolução tem um nome: <strong>Mounjaro</strong> (feito com uma substância chamada tirzepatida).</p>
        
        <div class="card-highlight">
          <h4>💡 O Fim do Efeito Sanfona?</h4>
          <p>O Mounjaro não é um simples supressor de apetite. Ele age como agonista dos receptores GIP e GLP-1 — hormônios que o próprio corpo produz após as refeições para sinalizar saciedade e regular a produção de insulina. Com isso, pode contribuir para a redução da glicemia e ajudar no controle do apetite quando usado com acompanhamento médico adequado.</p>
        </div>

        <h3>Por Que Ele é Tão Falado?</h3>
        <p>Nos ensaios clínicos SURPASS e SURMOUNT, muitos participantes atingiram perda média de cerca de <strong>20% do peso corporal</strong>. Pense nisso em termos de saúde: melhora nos exames, menos pressão nas articulações, mais disposição para as atividades do dia a dia. Resultados assim, antes observados principalmente em cirurgias bariátricas, agora são documentados também com tratamento farmacológico — sempre com acompanhamento profissional.</p>

        <h3>O Que Você Vai Descobrir Aqui</h3>
        <p>A internet está cheia de promessas mágicas e informações falsas. Nosso objetivo neste Ebook é segurar a sua mão e explicar <strong>tudo de um jeito muito simples e honesto</strong>. Sem palavras difíceis e sem enrolação.</p>

        <p>Você vai entender como esse tratamento funciona, o que esperar de verdade, os cuidados que deve ter e como usar esse conhecimento para ter conversas mais informadas com seu médico.</p>

        <div class="alert alert-warning">
          <strong>⚠️ Importante:</strong> O Mounjaro é um tratamento médico sério. Não é estética ou vaidade, é saúde. Este guia é para informar e preparar você, mas lembre-se: nunca inicie o uso sem o acompanhamento de um bom médico!
        </div>
      `
    },
    {
      id: "capitulo-1",
      type: "content",
      title: "Capítulo 1 — O que é Mounjaro",
      subtitle: "Conhecendo o Remédio",
      summary: "Descubra de forma simples como funciona a substância e como ela é usada.",
      content: `
        <p>Para entender o Mounjaro, vamos olhar para o que tem dentro dele. A substância principal é a <strong>tirzepatida</strong>, uma fórmula criada para imitar substâncias que nosso próprio corpo faz.</p>
 
        <div class="scientific-card">
          <span class="scientific-badge">Ficha Científica Molecular</span>
          <h4>🧪 Identidade Química da Tirzepatida</h4>
          <p>Dados oficiais catalogados no banco de dados internacional de biotecnologia <strong>PubChem</strong> (CID 166567236):</p>
          <ul style="margin-top: 0.5rem; font-size: 0.95rem;">
            <li><strong>Fórmula Molecular:</strong> <code>C₂₂₅H₃₄₈N₄₈O₆₈</code> (peptídeo sintético de cadeia longa)</li>
            <li><strong>Massa Molecular Exata:</strong> ~4.813 g/mol (uma macromolécula altamente complexa)</li>
            <li><strong>Estrutura Peptídica:</strong> Composta por 39 aminoácidos geneticamente modificados, acoplados a uma cadeia de diácido graxo (C20 lipídeo).</li>
            <li><strong>Mecanismo de Longa Duração:</strong> Esta cadeia lipídica permite que a molécula se ligue temporariamente à albumina no sangue, impedindo a eliminação renal rápida e garantindo uma ação prolongada (meia-vida de ~5 dias), o que viabiliza a aplicação única semanal.</li>
          </ul>
        </div>

        <h3>Como Ele Age?</h3>
        <p>A tirzepatida faz parte de uma nova família de remédios. O grande diferencial dela é que ela dura muito tempo no corpo, por isso só precisa ser aplicada <strong>uma vez por semana</strong>.</p>

        <div class="visual-placeholder image-box" data-image="active_lifestyle">
          <p class="image-caption">O foco é recuperar a qualidade de vida e a disposição para as atividades do dia a dia.</p>
        </div>

        <h3>Para Quem Ele é Indicado?</h3>
        <ul>
          <li><strong>Pessoas com Diabetes Tipo 2:</strong> Para ajudar a baixar o açúcar no sangue, junto com dieta e exercícios.</li>
          <li><strong>Pessoas com Excesso de Peso (Obesidade ou Sobrepeso):</strong> Para ajudar a emagrecer, especialmente quando a pessoa já tem problemas como pressão alta, colesterol ruim alto ou problemas para respirar dormindo.</li>
        </ul>

        <h3>Como se Usa?</h3>
        <p>O remédio vem em <strong>canetas de injeção fáceis de usar</strong>. Você mesmo aplica, dando uma picadinha rápida debaixo da pele, uma vez por semana (geralmente na barriga ou na coxa). O tratamento começa com uma dose bem baixinha para o corpo se acostumar e não dar muito enjoo. Aos poucos, o médico vai aumentando a dose.</p>

        <div class="card-info">
          <h4>⚖️ Saúde x Estética</h4>
          <p>O Mounjaro é para <strong>tratar problemas de saúde de verdade</strong>. Usar o remédio só para ficar com o "corpo de verão", sem ter problemas de peso ou diabetes, é muito perigoso. Pode trazer efeitos colaterais ruins sem ganhos reais para a saúde.</p>
        </div>
      `
    },
    {
      id: "capitulo-2",
      type: "content",
      title: "Capítulo 2 — Como surgiu",
      subtitle: "A História por Trás da Descoberta",
      summary: "Veja como os cientistas descobriram a fórmula deste remédio revolucionário.",
      content: `
        <p>O Mounjaro não surgiu do nada. Foram mais de 50 anos de estudos sobre como nosso estômago e intestino funcionam quando comemos.</p>

        <h3>A Descoberta Inicial</h3>
        <p>Lá atrás, cientistas perceberam que quando a gente come açúcar, o intestino avisa o corpo para se preparar e produzir insulina (que guarda a energia). Eles viram que o nosso intestino produz "mensageiros" (chamados hormônios) para dar esse aviso.</p>

        <h3>A Evolução dos Remédios</h3>
        <div class="timeline-simple">
          <div class="timeline-item">
            <span class="year">Anos 90</span>
            <p>Os cientistas descobrem exatamente quais são esses hormônios mensageiros que ajudam o corpo a usar a energia da comida.</p>
          </div>
          <div class="timeline-item">
            <span class="year">Anos 2000</span>
            <p>Surgem os primeiros remédios que imitam esses mensageiros, mas precisavam ser injetados duas vezes ao dia.</p>
          </div>
          <div class="timeline-item">
            <span class="year">Anos 2010</span>
            <p>O grande salto: remédios como o Ozempic começam a ser injetados apenas uma vez por semana, com ótimos resultados para o peso e açúcar.</p>
          </div>
          <div class="timeline-item">
            <span class="year">Hoje (Mounjaro)</span>
            <p><strong>Ação Dupla:</strong> O Mounjaro atua como agonista de dois receptores hormonais (GIP e GLP-1) simultaneamente — uma abordagem que, nos ensaios clínicos, foi associada a resultados expressivos de controle glicêmico e perda de peso.</p>
          </div>
        </div>

        <h3>No Brasil</h3>
        <p>A ANVISA aprovou o Mounjaro em 2023 inicialmente para o controle do diabetes tipo 2. Em 2025, a indicação foi ampliada para o controle crônico de peso em adultos com IMC ≥ 30 kg/m², ou IMC ≥ 27 kg/m² na presença de pelo menos uma comorbidade relacionada ao peso (como hipertensão, dislipidemia ou apneia do sono). O uso continua sendo exclusivamente sob prescrição e acompanhamento médico.</p>
      `
    },
    {
      id: "capitulo-3",
      type: "content",
      title: "Capítulo 3 — Como funciona no corpo",
      subtitle: "Por Que Tira a Fome?",
      summary: "Entenda por que você sente menos fome e como o remédio ajuda a não comer por ansiedade.",
      content: `
        <p>O segredo do Mounjaro é que ele imita duas substâncias do nosso corpo ao mesmo tempo, enquanto os remédios mais antigos imitavam apenas uma.</p>

        <div class="visual-placeholder image-box" data-image="healthy_food">
          <p class="image-caption">O controle do apetite ajuda você a fazer escolhas alimentares mais saudáveis e nutritivas.</p>
        </div>

        <h3>Ação no Cérebro (Adeus, Fome!)</h3>
        <p>O remédio manda uma mensagem direto para a parte do cérebro que controla a fome. Isso muda como você vê a comida:</p>
        <ul>
          <li><strong>Você se sente cheio rápido:</strong> Comendo muito menos que o normal, você já sente que não aguenta mais comer.</li>
          <li><strong>Diminui a vontade de "beliscar":</strong> Aquela vontade louca de comer doce ou gordura por ansiedade e estresse diminui muito. Você pensa menos em comida.</li>
        </ul>

        <h3>Ação no Estômago</h3>
        <p>O Mounjaro faz o estômago trabalhar mais devagar. A comida fica mais tempo parada ali, o que faz você não sentir fome por muito mais tempo e evita que o açúcar no sangue suba de uma vez.</p>
      `
    },
    {
      id: "capitulo-4",
      type: "content",
      title: "Capítulo 4 — Benefícios",
      subtitle: "Além do Emagrecimento",
      summary: "Veja como o Mounjaro ajuda não só no peso, mas também no coração e na glicose.",
      content: `
        <p>Além do controle do diabetes tipo 2, os estudos clínicos mostram que a tirzepatida pode melhorar múltiplos marcadores metabólicos — não se resumindo apenas à perda de peso.</p>

        <div class="benefit-grid">
          <div class="benefit-card">
            <h5>🎯 Controla o Açúcar</h5>
            <p>Ajuda muito quem tem diabetes, baixando o açúcar no sangue para níveis normais, igual de uma pessoa sem a doença.</p>
          </div>
          <div class="benefit-card">
            <h5>📉 Perda de Peso Significativa</h5>
            <p>Nos ensaios SURMOUNT, participantes atingiram perda média de ~20% do peso corporal, com redução de gordura visceral — sempre em conjunto com mudanças no estilo de vida.</p>
          </div>
          <div class="benefit-card">
            <h5>❤️ Protege o Coração</h5>
            <p>Ajuda a baixar a pressão alta e a melhorar o colesterol ruim e as gorduras do sangue.</p>
          </div>
        </div>

        <h3>Remédio Não Faz Milagre Sozinho</h3>
        <p>É super importante lembrar: <strong>o remédio não substitui comer bem e fazer exercícios</strong>. Para o resultado durar, você precisa comer alimentos saudáveis (especialmente carnes e proteínas) e fazer exercícios de força (como musculação) para não ficar fraco e perder músculos.</p>
      `
    },
    {
      id: "indicacoes",
      type: "content",
      title: "Para Quais Casos é Indicado",
      subtitle: "Indicações Aprovadas e Em Estudo",
      summary: "As condições em que o uso da tirzepatida já é aprovado e aquelas que ainda estão sendo pesquisadas.",
      content: `
        <p class="lead">A tirzepatida começou como um tratamento para o diabetes, mas hoje é usada — e estudada — em várias condições ligadas ao metabolismo. É importante separar o que já foi <strong>aprovado pelas agências de saúde</strong> do que ainda está <strong>em pesquisa</strong>.</p>

        <h3>✅ Indicações já aprovadas</h3>
        <div class="benefit-grid">
          <div class="benefit-card">
            <h5>🩸 Diabetes Tipo 2</h5>
            <p>A indicação original. Ajuda a controlar a glicemia em adultos com diabetes tipo 2, junto com dieta e atividade física.</p>
          </div>
          <div class="benefit-card">
            <h5>⚖️ Obesidade / Controle de Peso</h5>
            <p>Aprovada para o controle crônico de peso em adultos com IMC ≥ 30, ou ≥ 27 com uma comorbidade (como hipertensão, dislipidemia ou apneia).</p>
          </div>
          <div class="benefit-card">
            <h5>💤 Apneia Obstrutiva do Sono</h5>
            <p>Em adultos com obesidade e apneia moderada a grave. Tornou-se o <strong>primeiro medicamento aprovado</strong> para essa finalidade (FDA em 2024, ANVISA em 2025), com base no estudo SURMOUNT-OSA.</p>
          </div>
        </div>

        <div class="card-highlight">
          <h4>🔬 Em estudo (ainda não aprovado para esses fins)</h4>
          <p>Resultados promissores aparecem em pesquisas, mas <strong>ainda não são indicações da bula</strong> e dependem de mais estudos. Não devem ser usados como motivo para começar o tratamento por conta própria:</p>
          <ul style="margin-top: 0.5rem;">
            <li><strong>Insuficiência cardíaca (tipo HFpEF) com obesidade:</strong> o estudo SUMMIT mostrou redução do risco de piora e de internação por insuficiência cardíaca.</li>
            <li><strong>Doença hepática gordurosa (MASH):</strong> o estudo de fase 2 SYNERGY-NASH mostrou melhora da inflamação do fígado sem piora da fibrose.</li>
            <li><strong>Saúde renal e cardiometabólica:</strong> análises apontam possíveis benefícios para os rins e o sistema cardiovascular, ainda sob investigação.</li>
          </ul>
        </div>

        <div class="alert alert-info">
          <strong>📰 Novidades (2024–2025):</strong> além da nova aprovação para apneia do sono, a ANVISA atualizou as regras no Brasil. Atenção a uma informação que circula de forma errada nas redes: <strong>o medicamento continua exigindo prescrição</strong>. O que mudou foi que, em casos de apneia associada à obesidade, cirurgiões-dentistas habilitados também podem prescrevê-lo — e as farmácias passaram a reter a segunda via da receita. Ou seja, <strong>não é venda livre</strong>.
        </div>

        <div class="alert alert-warning">
          <strong>⚠️ O que isso significa para você:</strong> ter uma dessas condições não quer dizer, automaticamente, que o medicamento é indicado para o seu caso. Quem define a indicação, a dose e os exames necessários é sempre o profissional de saúde, com base na bula vigente e na sua avaliação individual.
        </div>
      `
    },
    {
      id: "capitulo-5",
      type: "content",
      title: "Capítulo 5 — Efeitos ruins e riscos",
      subtitle: "Os Efeitos Colaterais",
      summary: "Saiba o que pode acontecer de ruim, como enjoos, e como se proteger.",
      content: `
        <p>Como todo remédio forte, o Mounjaro tem efeitos colaterais. O segredo é conhecer esses efeitos e conversar sempre com seu médico.</p>

        <h3>Efeitos Comuns (Mais Leves)</h3>
        <p>Como o estômago fica mais lento, é comum sentir incômodos nas primeiras semanas ou quando a dose aumenta:</p>
        <ul>
          <li><strong>Enjoo e Vômito:</strong> Costumam melhorar com o passar do tempo.</li>
          <li><strong>Intestino Preso ou Solto (Diarreia):</strong> Varia de pessoa para pessoa.</li>
          <li><strong>Azia e sensação de barriga estufada:</strong> Por causa da digestão devagar.</li>
        </ul>

        <h3>Problemas Sérios (Raros)</h3>
        <p>Acontecem com poucas pessoas, mas exigem ir ao médico rápido:</p>
        <ul>
          <li><strong>Problema no Pâncreas:</strong> Uma dor de barriga muito forte que não passa e vai para as costas.</li>
          <li><strong>Pedra na Vesícula:</strong> Emagrecer muito rápido pode criar pedras na vesícula.</li>
          <li><strong>Falta de Água no Corpo:</strong> Pode acontecer se você vomitar muito e não beber água.</li>
        </ul>

        <div class="alert alert-danger">
          <strong>⚠️ Cuidado com a Fraqueza:</strong> Emagrecer muito rápido pode fazer você perder músculos em vez de só gordura. Se você não comer carne, ovo, leite (proteínas) e não malhar, pode ficar muito fraco e prejudicar o corpo no futuro.
        </div>
      `
    },
    {
      id: "sinais-alerta",
      type: "content",
      title: "Sinais de Alerta",
      subtitle: "Quando Procurar Atendimento Rápido",
      summary: "Reconheça os sinais que exigem contato imediato com seu médico ou um pronto-socorro.",
      content: `
        <p class="lead">Saber reconhecer um sinal de alerta pode fazer diferença. Os pontos abaixo são baseados nas informações de segurança da bula. <strong>Eles não substituem orientação médica</strong> — na dúvida, procure atendimento.</p>

        <div class="alert alert-danger">
          <strong>🚨 Procure atendimento de urgência se tiver:</strong>
          <ul style="margin-top: 0.75rem;">
            <li><strong>Dor abdominal forte ou persistente</strong>, especialmente se irradiar para as costas — pode indicar problema no pâncreas (pancreatite).</li>
            <li><strong>Vômitos ou diarreia persistentes</strong> com sinais de desidratação (boca muito seca, tontura, urina escura, pouca urina) — risco de lesão nos rins.</li>
            <li><strong>Reação alérgica:</strong> inchaço no rosto, lábios ou garganta, dificuldade para respirar ou engolir, manchas na pele.</li>
            <li><strong>Sintomas de hipoglicemia</strong> (tremor, suor frio, confusão, desmaio) — risco maior para quem usa insulina ou sulfonilureia.</li>
          </ul>
        </div>

        <h3>Converse com seu médico em breve se notar</h3>
        <ul>
          <li><strong>Alteração na visão</strong> — pessoas com diabetes e retinopatia precisam de acompanhamento oftalmológico.</li>
          <li><strong>Dor no lado direito da barriga, febre ou icterícia (pele/olhos amarelados)</strong> — possível problema na vesícula.</li>
          <li><strong>Enjoos que não melhoram</strong> após as primeiras semanas ou após ajuste de dose.</li>
        </ul>

        <div class="alert alert-warning">
          <strong>🏥 Antes de cirurgia, endoscopia ou sedação:</strong> avise toda a equipe médica que você usa tirzepatida. O esvaziamento gástrico mais lento aumenta o risco de aspiração durante a anestesia.
        </div>

        <div class="card-highlight">
          <h4>💉 Nunca compartilhe a caneta</h4>
          <p>Mesmo trocando a agulha, a caneta é de uso individual. Compartilhar pode transmitir infecções.</p>
        </div>
      `
    },
    {
      id: "capitulo-6",
      type: "content",
      title: "Capítulo 6 — Quem não pode usar?",
      subtitle: "As Contraindicações",
      summary: "Descubra quem está proibido de tomar o Mounjaro por riscos à saúde.",
      content: `
        <p>O médico sempre deve avaliar você antes de dar a receita, porque algumas pessoas não podem tomar o remédio de jeito nenhum.</p>

        <h3>Quem NÃO pode usar (Proibição Total)</h3>
        <ul>
          <li><strong>Histórico de Câncer de Tireoide Específico (CMT):</strong> Se você ou alguém da família teve esse tipo raro de câncer, não pode usar.</li>
          <li><strong>Síndrome NEM 2:</strong> Uma doença genética que causa tumores.</li>
          <li><strong>Alergia Forte:</strong> Se teve alergia grave ao remédio.</li>
          <li><strong>Grávidas e Mulheres Amamentando:</strong> O remédio faz mal para o bebê. Se quiser engravidar, precisa parar de usar o remédio 2 meses antes.</li>
        </ul>

        <h3>Quem Precisa de Muito Cuidado</h3>
        <ul>
          <li>Quem já teve problemas graves no pâncreas.</li>
          <li>Quem tem problemas graves no estômago (quando ele já é muito lento).</li>
          <li>Quem tem problemas sérios nos rins.</li>
        </ul>
      `
    },
    {
      id: "interacoes",
      type: "content",
      title: "Interações e Situações Especiais",
      subtitle: "Remédios, Anticoncepcional, Cirurgia e Gravidez",
      summary: "Entenda como a tirzepatida pode interagir com outros medicamentos e situações da vida.",
      content: `
        <p class="lead">A tirzepatida pode interagir com outros tratamentos e exige cuidados em situações específicas. Informe sempre seu médico sobre <strong>tudo</strong> o que você usa, incluindo vitaminas e fitoterápicos.</p>

        <h3>💊 Outros medicamentos para diabetes</h3>
        <p>Quando combinada com <strong>insulina</strong> ou <strong>sulfonilureias</strong> (secretagogos), aumenta o risco de hipoglicemia (açúcar baixo demais). O médico pode precisar ajustar a dose desses remédios.</p>

        <h3>⏳ Absorção de remédios orais</h3>
        <p>Como o estômago esvazia mais devagar, a absorção de alguns medicamentos tomados pela boca pode mudar. Comente com o médico se você usa remédios de horário rígido.</p>

        <div class="card-highlight">
          <h4>💊 Anticoncepcionais orais</h4>
          <p>A pílula pode ter a absorção reduzida, principalmente no início e nos ajustes de dose. Converse com seu médico sobre usar também um <strong>método de barreira</strong> (como preservativo) por algumas semanas.</p>
        </div>

        <h3>🤰 Gravidez e amamentação</h3>
        <p>A tirzepatida não é indicada na gravidez nem na amamentação. Se você planeja engravidar, fale com o médico — em geral recomenda-se suspender o tratamento com antecedência.</p>

        <div class="alert alert-warning">
          <strong>🏥 Cirurgia e anestesia:</strong> informe a equipe médica que você usa o medicamento antes de qualquer procedimento com sedação, pelo risco aumentado de aspiração.
        </div>

        <div class="alert alert-info">
          <strong>ℹ️ Resumo:</strong> nenhuma dessas situações significa que você "não pode" usar — significa que cada caso precisa de avaliação e ajuste individual feito pelo seu médico.
        </div>
      `
    },
    {
      id: "capitulo-7",
      type: "content",
      title: "Capítulo 7 — Histórias Reais",
      subtitle: "Exemplos do Dia a Dia",
      summary: "Veja como o Mounjaro ajudou ou atrapalhou a vida de pacientes na prática.",
      content: `
        <p>Vamos ver três histórias (baseadas na vida real) para entender como o remédio funciona na prática.</p>

        <div class="case-study">
          <h5>👤 Caso 1: Roberto (54 anos) — Vencendo o Diabetes</h5>
          <p><strong>Situação:</strong> Roberto tinha diabetes há anos. Mesmo tomando injeção de insulina todo dia, o açúcar no sangue estava muito alto e ele engordava muito.</p>
          <p><strong>Ação:</strong> O médico receitou o Mounjaro, começando bem fraco e aumentando aos poucos.</p>
          <p><strong>Resultado:</strong> Em 8 meses, o açúcar baixou para o nível de quem não tem diabetes. Ele perdeu 14 quilos de barriga, não precisou mais das picadas diárias de insulina e se sentiu cheio de energia.</p>
        </div>

        <div class="case-study">
          <h5>👤 Caso 2: Mariana (38 anos) — Emagrecendo com Saúde</h5>
          <p><strong>Situação:</strong> Mariana era muito acima do peso, sentia dores no joelho e vivia no "efeito sanfona" (emagrece e engorda).</p>
          <p><strong>Ação:</strong> Começou o Mounjaro ajudada por um médico, um nutricionista e um professor da academia.</p>
          <p><strong>Resultado:</strong> Perdeu 20 quilos em um ano. Como ela comeu bastante proteína e puxou peso na academia, não perdeu músculos. As dores sumiram e ela manteve o corpo forte.</p>
        </div>

        <div class="case-study alert-case">
          <h5>⚠️ Caso 3: Débora (26 anos) — O Perigo de Usar Escondido</h5>
          <p><strong>Situação:</strong> Débora não era gorda, só queria perder 4 quilos para ir à praia. Comprou o remédio escondido e tomou uma dose alta de uma vez só porque viu na internet.</p>
          <p><strong>Resultado:</strong> Ela vomitou sem parar por dias, ficou desidratada e foi parar no hospital para tomar soro na veia. Ficou muito fraca e, quando parou o remédio, engordou tudo de novo rápido. Usar sem precisar é um erro perigoso.</p>
        </div>
      `
    },
    {
      id: "capitulo-8",
      type: "content",
      title: "Capítulo 8 — Mounjaro vs. Ozempic",
      subtitle: "Qual a Diferença?",
      summary: "Entenda por que o Mounjaro é considerado mais forte que o Ozempic.",
      content: `
        <p>A maior dúvida é: <strong>Mounjaro e Ozempic são a mesma coisa?</strong> Não. Ambos são ótimos, mas o Mounjaro é mais moderno.</p>

        <h3>Uma vs. Duas Mensagens</h3>
        <p>O <strong>Ozempic</strong> manda <strong>uma</strong> mensagem para o corpo (imita o hormônio GLP-1) para avisar que está sem fome. O <strong>Mounjaro</strong> manda <strong>duas</strong> mensagens ao mesmo tempo (imita o GLP-1 e o GIP). É como se ele falasse mais alto para o cérebro e para o estômago.</p>

        <div class="scientific-card">
          <span class="scientific-badge">Mecanismo de Ação Celular</span>
          <h4>🧬 A Sinergia dos Receptores GIPR e GLP1R</h4>
          <p>Enquanto a Semaglutida (Ozempic) atua exclusivamente no receptor do hormônio <strong>GLP-1</strong>, a Tirzepatida (Mounjaro) é um <strong>coagonista duplo</strong> projetado por engenharia genética para ativar simultaneamente os receptores de dois hormônios incretínicos cruciais:</p>
          <ul style="margin-top: 0.5rem; font-size: 0.95rem;">
            <li><strong>GLP-1R (Receptor do GLP-1):</strong> Desacelera o esvaziamento do estômago, melhora a produção de insulina dependente de glicose no pâncreas e atua no hipotálamo atenuando a fome.</li>
            <li><strong>GIPR (Receptor do GIP):</strong> O grande diferencial metabólico. O receptor de GIP está presente no tecido adiposo (gordura) e em centros de náusea do cérebro. A ativação sinérgica do GIPR melhora a sensibilidade à insulina nas células de gordura, ajuda a proteger a massa magra e atenua os reflexos de náusea severa gerados pela ativação isolada do GLP-1.</li>
            <li><strong>O Efeito Clínico:</strong> Esta via dupla não apenas bloqueia o apetite de forma mais abrangente, como também otimiza o metabolismo de gorduras sistemicamente, gerando resultados substancialmente superiores na perda de peso.</li>
          </ul>
        </div>

        <div class="visual-placeholder image-box" data-image="happy_future">
          <p class="image-caption">Uma nova geração de tratamentos trazendo mais esperança e resultados reais.</p>
        </div>

        <h3>Resumo das Diferenças</h3>
        <ul>
          <li><strong>Perda de Peso:</strong> O Mounjaro geralmente faz as pessoas perderem mais peso do que o Ozempic.</li>
          <li><strong>Enjoos:</strong> Os enjoos são parecidos nos dois, algumas pessoas dizem que o Mounjaro dá menos enjoo, mas varia muito de pessoa para pessoa.</li>
          <li><strong>Preço e Acesso:</strong> O Mounjaro, por ser mais novo e potente, costuma ser mais caro e mais difícil de achar nas farmácias do que o Ozempic.</li>
        </ul>
      `
    },
    {
      id: "capitulo-9",
      type: "content",
      title: "Capítulo 9 — Testes e Comprovações",
      subtitle: "Como Sabemos que Funciona?",
      summary: "Veja como os cientistas tiveram certeza de que o remédio é bom.",
      content: `
        <p>Nenhum remédio é vendido sem ser testado em milhares de pessoas antes. O Mounjaro passou por grandes testes no mundo todo.</p>

        <h3>1. Testes para Diabetes</h3>
        <p>Os pesquisadores deram o remédio para pessoas com diabetes para comparar com outros remédios mais antigos.</p>
        <ul>
          <li><strong>Resultado:</strong> Mais da metade das pessoas conseguiu deixar o açúcar no sangue tão baixo que os exames pareciam de pessoas sem diabetes.</li>
        </ul>

        <h3>2. Testes para Perda de Peso</h3>
        <p>Eles testaram pessoas que só precisavam emagrecer (sem diabetes).</p>
        <ul>
          <li><strong>Resultado:</strong> As pessoas perderam, em média, <strong>20% do próprio peso (cerca de 24 quilos)</strong> depois de pouco mais de um ano. E os resultados se mantiveram enquanto usavam o remédio e cuidavam da saúde.</li>
        </ul>

        <div class="scientific-card">
          <span class="scientific-badge">Dados dos Ensaios Clínicos</span>
          <h4>📊 Evidências Científicas Reais (Eli Lilly)</h4>
          <p>O desenvolvimento da Tirzepatida envolveu dois massivos programas internacionais de ensaios clínicos de Fase 3 (totalmente revisados e publicados em grandes periódicos médicos como o <em>The New England Journal of Medicine</em>):</p>
          <h5 style="margin-top: 0.75rem;">🏆 O Programa SURMOUNT (Tratamento de Obesidade)</h5>
          <p style="font-size: 0.95rem; margin-bottom: 0.75rem;">O ensaio clínico **SURMOUNT-1** avaliou 2.539 adultos com obesidade ou sobrepeso (sem diabetes) durante 72 semanas:</p>
          <ul style="font-size: 0.9rem; margin-bottom: 1rem;">
            <li><strong>Perda de Peso Ponderal Média:</strong> Redução impressionante de **20,9% (cerca de 24 kg)** na dose máxima de 15 mg semanais.</li>
            <li><strong>Taxa de Resposta:</strong> Incríveis **91% dos participantes** perderam 5% ou mais de seu peso corporal total, um patamar clínico sem precedentes históricos para tratamento farmacológico.</li>
          </ul>
          <h5>🏆 O Programa SURPASS (Controle do Diabetes Tipo 2)</h5>
          <p style="font-size: 0.95rem; margin-bottom: 0.75rem;">O ensaio clínico **SURPASS-2** comparou diretamente a Tirzepatida (15 mg) contra a Semaglutida 1 mg (Ozempic) em 1.879 pacientes:</p>
          <ul style="font-size: 0.9rem;">
            <li><strong>Redução da Hemoglobina Glicada (HbA1c):</strong> Queda de **2,30%** com a Tirzepatida 15 mg comparado a 1,86% com a Semaglutida.</li>
            <li><strong>Perda de Peso Superior:</strong> Perda ponderal média de **11,2 kg** na Tirzepatida contra 5,7 kg na Semaglutida, comprovando superioridade estatística e clínica direta nas duas métricas.</li>
          </ul>
        </div>

        <div class="card-info">
          <h4>📊 Fique Atento</h4>
          <p>Nos testes, as pessoas tinham acompanhamento de nutricionistas e faziam exercícios físicos regulares. Na vida real, o medicamento só alcança todo o seu potencial se você também se esforçar e mantiver um estilo de vida ativo e dieta balanceada.</p>
        </div>
      `
    },
    {
      id: "capitulo-10",
      type: "content",
      title: "Capítulo 10 — Segurança e Cuidado",
      subtitle: "Fuja do Remédio Falso",
      summary: "Saiba como não cair em golpes e por que você precisa fazer exames.",
      content: `
        <p>Para o tratamento dar certo e você não colocar sua vida em risco, é preciso seguir regras de segurança.</p>

        <h3>O Perigo dos Remédios Falsificados</h3>
        <p>Como o Mounjaro faz muito sucesso e às vezes falta na farmácia, muita gente ruim tenta vender falsificações:</p>
        <ul>
          <li><strong>Canetas Falsas na Internet:</strong> Vendem pela internet ou redes sociais remédios que têm água com sal, insulina ou coisas perigosas dentro.</li>
          <li><strong>Remédio Manipulado:</strong> Somente o fabricante (Eli Lilly) pode fazer a receita verdadeira. Farmácias de manipulação não têm autorização para fazer o Mounjaro verdadeiro, o que aumenta o risco de sujeira e bactérias no remédio.</li>
        </ul>

        <h3>Exames de Sangue</h3>
        <p>Um bom médico vai pedir exames antes e durante o uso da caneta para checar:</p>
        <ul>
          <li>Como estão seu pâncreas, fígado e rins.</li>
          <li>Se a sua tireoide está saudável.</li>
        </ul>
      `
    },
    {
      id: "capitulo-11",
      type: "content",
      title: "Capítulo 11 — Mitos e Verdades",
      subtitle: "Tirando as Dúvidas",
      summary: "Separamos o que é mentira e o que é verdade sobre o Mounjaro.",
      content: `
        <p>Na internet tem muita fofoca. Vamos ver o que é real e o que é invenção.</p>

        <div class="myth-truth-box">
          <div class="myth">
            <strong>❌ Mito:</strong> "O Mounjaro derrete a gordura sozinho, eu posso continuar comendo fast food e não fazer exercício."
          </div>
          <div class="truth">
            <strong>✔️ Verdade:</strong> Mentira. O remédio só tira a fome. Se você comer mal e não malhar, pode ficar desnutrido, perder músculos e engordar tudo o dobro quando parar o remédio.
          </div>
        </div>

        <div class="myth-truth-box">
          <div class="myth">
            <strong>❌ Mito:</strong> "Vou usar por 3 meses, emagrecer e nunca mais vou engordar na vida."
          </div>
          <div class="truth">
            <strong>✔️ Verdade:</strong> A obesidade é igual pressão alta: precisa de cuidado constante. Se você parar de tomar o remédio sem mudar totalmente sua cabeça e seus hábitos, o peso volta devagar. O médico é quem diz como parar.
          </div>
        </div>

        <div class="myth-truth-box">
          <div class="myth">
            <strong>❌ Mito:</strong> "Qualquer um pode usar para secar a barriga rápido."
          </div>
          <div class="truth">
            <strong>✔️ Verdade:</strong> É só para pessoas com problemas sérios de peso ou saúde. Usar só por beleza traz efeitos colaterais fortes e desnecessários.
          </div>
        </div>

        <h3>🎯 Expectativas realistas (mitos avançados)</h3>
        <p>Alguns mitos são mais sutis e geram frustração ou risco. Vale conhecê-los:</p>

        <div class="myth-truth-box">
          <div class="myth">
            <strong>❌ Mito:</strong> "Vou emagrecer igual àquele influenciador que mostrou o antes e depois."
          </div>
          <div class="truth">
            <strong>✔️ Verdade:</strong> A resposta é individual e depende de genética, dose, alimentação, sono e atividade física. Médias de estudos não são promessa de resultado pessoal — e fotos na internet raramente contam a história completa.
          </div>
        </div>

        <div class="myth-truth-box">
          <div class="myth">
            <strong>❌ Mito:</strong> "Se funcionou tão bem para o meu amigo, vai funcionar igual para mim."
          </div>
          <div class="truth">
            <strong>✔️ Verdade:</strong> Cada corpo reage de um jeito. Dose, tolerância a efeitos colaterais e ritmo de perda variam muito de pessoa para pessoa.
          </div>
        </div>

        <div class="myth-truth-box">
          <div class="myth">
            <strong>❌ Mito:</strong> "Posso ajustar a dose e usar por conta própria, sem médico."
          </div>
          <div class="truth">
            <strong>✔️ Verdade:</strong> Não. Dose, ajustes e segurança dependem de avaliação médica. Usar sozinho aumenta o risco de efeitos adversos e de erro de aplicação.
          </div>
        </div>

        <div class="myth-truth-box">
          <div class="myth">
            <strong>❌ Mito:</strong> "Tive enjoo nos primeiros dias, então o remédio não presta e devo parar."
          </div>
          <div class="truth">
            <strong>✔️ Verdade:</strong> Efeitos digestivos leves são comuns no início e nos ajustes de dose, e tendem a melhorar. O que <em>não</em> é normal (dor forte, vômitos persistentes, desidratação) está no capítulo <em>Sinais de Alerta</em>. Quem decide parar ou ajustar é o médico.
          </div>
        </div>
      `
    },
    {
      id: "capitulo-12",
      type: "content",
      title: "Capítulo 12 — O Futuro dos Remédios",
      subtitle: "O que Vem por Aí?",
      summary: "Uma ideia de como serão os remédios para emagrecer daqui a alguns anos.",
      content: `
        <p>O Mounjaro é incrível, mas a ciência não para. Já existem novos tratamentos sendo estudados nos laboratórios para o futuro.</p>

        <div class="visual-placeholder image-box" data-image="health_cover">
          <p class="image-caption">A ciência trabalhando para garantir um futuro com mais saúde e vitalidade para todos.</p>
        </div>

        <h3>1. Remédios com Três Mensagens</h3>
        <p>Se o Mounjaro manda duas mensagens (hormônios), já tem remédio novo em teste mandando TRÊS mensagens ao mesmo tempo para o corpo. Isso vai fazer o corpo queimar energia mais rápido e perder ainda mais peso, protegendo o fígado.</p>

        <h3>2. Remédio em Comprimido</h3>
        <p>Muita gente tem medo de injeção. No futuro, remédios muito fortes e eficientes como o Mounjaro poderão ser tomados como uma pílula normal todos os dias, facilitando a vida.</p>

        <h3>3. Inteligência Artificial</h3>
        <p>Daqui a alguns anos, os médicos poderão usar computadores inteligentes e testes de sangue para saber exatamente qual remédio vai funcionar melhor no seu corpo, antes mesmo de você começar a tomar, evitando que você sinta qualquer enjoo.</p>
      `
    },
    {
      id: "nutricao",
      type: "content",
      title: "Alimentação, Proteína e Músculos",
      subtitle: "Comer Bem Durante o Tratamento",
      summary: "Como se alimentar para perder gordura sem perder massa muscular, com hidratação e fibras.",
      content: `
        <p class="lead">Durante o tratamento o apetite diminui — por isso, cada refeição precisa ser mais <strong>nutritiva</strong>. Comer pouco e mal aumenta o risco de perder massa muscular, ficar fraco e ter deficiências. A orientação individual deve vir de um nutricionista.</p>

        <h3>🥩 Proteína em primeiro lugar</h3>
        <p>A proteína protege a massa magra enquanto você emagrece. Boas fontes vão muito além da carne:</p>
        <ul>
          <li><strong>Origem animal:</strong> ovos, frango, peixe, carne magra, iogurte, queijos.</li>
          <li><strong>Vegetarianas/veganas:</strong> feijão, lentilha, grão-de-bico, tofu, soja, ervilha, quinoa.</li>
          <li><strong>Intolerantes à lactose:</strong> bebidas vegetais enriquecidas, tofu, leguminosas.</li>
        </ul>
        <p>Distribua a proteína ao longo do dia, não só no almoço.</p>

        <h3>💧 Hidratação</h3>
        <p>Com menos fome, é comum também beber menos água. A desidratação piora enjoos e sobrecarrega os rins. Tenha sempre água por perto e beba ao longo do dia, mesmo sem sede.</p>

        <h3>🌾 Fibras e intestino</h3>
        <p>A digestão mais lenta pode causar prisão de ventre. Ajudam a prevenir: verduras, legumes, frutas com casca, aveia e grãos integrais — sempre acompanhados de água.</p>

        <div class="card-highlight">
          <h4>🏋️ Treino de força</h4>
          <p>Exercícios de força (musculação, faixas elásticas, peso do corpo) são o principal estímulo para preservar músculo durante o emagrecimento. Combine com atividade aeróbica que você goste. Adapte tudo à sua condição física — de preferência com orientação de um profissional.</p>
        </div>

        <div class="alert alert-warning">
          <strong>⚠️ Sinal de alerta nutricional:</strong> fraqueza importante, queda de cabelo, unhas frágeis ou tontura podem indicar ingestão insuficiente. Converse com seu médico ou nutricionista.
        </div>
      `
    },
    {
      id: "linha-do-tempo",
      type: "content",
      title: "O Que Esperar no Tempo",
      subtitle: "A Linha do Tempo do Tratamento",
      summary: "Uma visão geral de como o tratamento costuma evoluir ao longo das semanas e meses.",
      content: `
        <p class="lead">Cada pessoa responde de um jeito, mas conhecer a evolução típica ajuda a ter <strong>expectativas realistas</strong> e a não desistir cedo demais. Os marcos abaixo são gerais e educativos — o ritmo, a dose e os ajustes são sempre definidos pelo seu médico.</p>

        <div class="alert alert-info">
          <strong>ℹ️ Importante:</strong> este capítulo descreve tendências observadas em estudos e na prática clínica. Ele <strong>não orienta dose</strong> nem substitui o acompanhamento profissional.
        </div>

        <div class="timeline-simple">
          <div class="timeline-item">
            <span class="year">Início (dose baixa)</span>
            <p>O tratamento costuma começar com uma <strong>dose baixa</strong>, que é aumentada aos poucos. Isso reduz enjoos e ajuda o corpo a se acostumar. Quem define e ajusta é o médico.</p>
          </div>
          <div class="timeline-item">
            <span class="year">Primeira semana</span>
            <p>Muitas pessoas já sentem <strong>menos fome</strong> e mais saciedade. Efeitos digestivos leves (enjoo, prisão de ventre) podem aparecer e costumam ser passageiros. Hidrate-se e priorize proteína.</p>
          </div>
          <div class="timeline-item">
            <span class="year">Primeiro mês</span>
            <p>O apetite tende a ficar mais controlado. A perda de peso costuma ser gradual — não é instantânea. Constância importa mais que pressa.</p>
          </div>
          <div class="timeline-item">
            <span class="year">Ajustes de dose</span>
            <p>A cada poucas semanas o médico pode aumentar a dose conforme a resposta e a tolerância. Cada aumento pode trazer de volta enjoos leves por alguns dias.</p>
          </div>
          <div class="timeline-item">
            <span class="year">Ao longo dos meses</span>
            <p>É quando os resultados de peso e de exames costumam ficar mais visíveis, sempre acompanhados de alimentação e atividade física.</p>
          </div>
          <div class="timeline-item">
            <span class="year">Desaceleração / platô</span>
            <p>Mais à frente, a perda de peso pode desacelerar — é <strong>normal e esperado</strong>. Veja o capítulo <em>Manutenção, Platô e Reganho</em> para entender o porquê.</p>
          </div>
        </div>

        <div class="alert alert-warning">
          <strong>⚠️ Atenção:</strong> ter enjoo no começo <strong>não</strong> significa que o remédio "não presta". Mas dor abdominal forte, vômitos persistentes ou sinais de desidratação pedem contato médico — reveja o capítulo <em>Sinais de Alerta</em>.
        </div>
      `
    },
    {
      id: "manutencao",
      type: "content",
      title: "Manutenção, Platô e Reganho",
      subtitle: "Depois que o Peso Desce",
      summary: "Entenda por que a obesidade é crônica, o que é o platô e como manter os resultados.",
      content: `
        <p class="lead">Emagrecer é só parte da jornada. A obesidade é uma <strong>condição crônica</strong> — manter o resultado exige estratégia contínua, não força de vontade isolada.</p>

        <h3>📉 O que é o platô?</h3>
        <p>Depois de um tempo, a perda de peso desacelera ou estaciona. Isso é <strong>normal e esperado</strong>: o corpo se adapta gastando menos energia. O platô não significa que o tratamento "parou de funcionar". Ajustes são avaliados pelo médico.</p>

        <h3>🔄 Por que o peso pode voltar?</h3>
        <p>Estudos mostram que, ao interromper o medicamento, parte do peso costuma retornar. Isso acontece porque o tratamento controla mecanismos biológicos do apetite — ao pará-lo, esses mecanismos voltam. Não é "falta de disciplina"; é fisiologia.</p>

        <div class="card-highlight">
          <h4>🧩 Pilares da manutenção</h4>
          <ul style="margin-top: 0.5rem;">
            <li>Acompanhamento médico contínuo (não suspender por conta própria).</li>
            <li>Alimentação rica em proteína e fibras.</li>
            <li>Atividade física regular, com treino de força.</li>
            <li>Sono de qualidade e cuidado com a saúde mental.</li>
            <li>Apoio de equipe: médico, nutricionista e educador físico.</li>
          </ul>
        </div>

        <div class="alert alert-info">
          <strong>ℹ️ Expectativa realista:</strong> não existe "alta definitiva" garantida. O objetivo é uma estratégia de longo prazo, definida com seu médico, para manter os ganhos de saúde.
        </div>
      `
    },
    {
      id: "custo-acesso",
      type: "content",
      title: "Custo, Continuidade e Acesso",
      subtitle: "Planejando o Tratamento com os Pés no Chão",
      summary: "O que considerar sobre custo, duração e onde adquirir com segurança — sem promessas.",
      content: `
        <p class="lead">Antes de começar, vale entender o lado prático: é um tratamento <strong>contínuo</strong> e tem custo. Planejar evita começar e parar no meio, o que atrapalha os resultados e pode favorecer o reganho.</p>

        <h3>💰 Custo mensal</h3>
        <p>O preço varia bastante conforme a dose, a região, a farmácia e promoções/descontos do fabricante. Por isso, <strong>não citamos um valor fixo aqui</strong> — ele muda com o tempo. Consulte farmácias e o seu plano/convênio para ter o número atualizado, e some o custo das agulhas e do acompanhamento médico.</p>

        <h3>⏳ Por quanto tempo?</h3>
        <p>Por ser usado no controle de uma <strong>condição crônica</strong>, costuma ser um tratamento de <strong>longo prazo</strong>, e não de poucas semanas. A duração é individual e definida com o médico — pense nele como parte de uma rotina de saúde, não como uma "dieta relâmpago".</p>

        <div class="card-highlight">
          <h4>🧮 Planejamento financeiro</h4>
          <ul style="margin-top: 0.5rem;">
            <li>Considere o custo <strong>mensal recorrente</strong>, não só a primeira caixa.</li>
            <li>Inclua agulhas, consultas e exames de acompanhamento.</li>
            <li>Converse com o médico sobre o que fazer se precisar pausar por questão financeira — parar por conta própria tem consequências (veja <em>Manutenção, Platô e Reganho</em>).</li>
          </ul>
        </div>

        <div class="alert alert-danger">
          <strong>🚫 Onde comprar com segurança:</strong> adquira <strong>somente em farmácias licenciadas</strong>, com receita. Desconfie de preços muito baixos, vendas por redes sociais e "versões manipuladas/importadas sem registro" — há risco de <strong>falsificação</strong> e de produto sem procedência. Na dúvida, confirme o registro na ANVISA.
        </div>

        <div class="alert alert-info">
          <strong>ℹ️ Sem promessas:</strong> custo e disponibilidade mudam e fogem ao escopo deste guia. Esta seção é só para ajudar você a se planejar e conversar melhor com o médico e o farmacêutico.
        </div>
      `
    },
    {
      id: "perguntas-medico",
      type: "content",
      title: "Perguntas para Levar ao Médico",
      subtitle: "Como se Preparar para a Consulta",
      summary: "Um roteiro prático para aproveitar melhor a consulta e tomar decisões informadas.",
      content: `
        <p class="lead">A melhor decisão sobre o tratamento é tomada junto com seu médico. Chegar preparado para a consulta ajuda você a tirar todas as dúvidas e a receber a orientação mais segura.</p>

        <h3>📋 O que levar anotado</h3>
        <ul>
          <li>Seu <strong>histórico de peso</strong> e as tentativas anteriores de emagrecer.</li>
          <li>Lista de <strong>todos os medicamentos</strong>, vitaminas e suplementos que você usa.</li>
          <li>Doenças que você tem ou já teve: diabetes, pré-diabetes, hipertensão, colesterol alto, apneia do sono, gordura no fígado.</li>
          <li>Histórico de <strong>pancreatite, pedra na vesícula, doença renal ou problema na retina</strong>.</li>
          <li>Histórico familiar de câncer de tireoide (CMT) ou síndrome NEM 2.</li>
          <li>Se está grávida, amamentando ou planejando engravidar.</li>
        </ul>

        <div class="card-highlight">
          <h4>❓ Perguntas que você pode fazer</h4>
          <ul style="margin-top: 0.5rem;">
            <li>Este tratamento é indicado para o meu caso específico?</li>
            <li>Quais exames preciso fazer antes e durante o uso?</li>
            <li>Quais efeitos colaterais são esperados e o que faço se aparecerem?</li>
            <li>Como a dose vai ser ajustada ao longo do tempo?</li>
            <li>Preciso mudar algum remédio que já tomo?</li>
            <li>O que acontece se eu precisar interromper o tratamento?</li>
            <li>Como fica a alimentação, a hidratação e a atividade física?</li>
            <li>Com que frequência vou precisar de retornos?</li>
          </ul>
        </div>

        <div class="alert alert-info">
          <strong>ℹ️ Dica:</strong> leve também o <em>checklist de triagem</em> e a calculadora de IMC do Lab Interativo deste guia. Eles ajudam a organizar a conversa — mas a decisão final é sempre do médico.
        </div>
      `
    },
    {
      id: "conclusao",
      type: "content",
      title: "Conclusão",
      subtitle: "O Fim e o Novo Começo",
      summary: "Uma reflexão rápida para você levar para a vida toda.",
      content: `
        <p class="lead">A ciência criou uma ajuda de ouro, mas o herói da sua saúde ainda é você.</p>

        <p>O Mounjaro é uma das maiores descobertas da medicina moderna. Ele é uma esperança real para milhões de pessoas que sofrem há anos tentando tratar a obesidade e o diabetes.</p>

        <p>Mas a grande lição deste guia é: <strong>o remédio é só um empurrãozinho</strong>. O objetivo final não deve ser ficar com o corpo de capa de revista, mas sim ter energia para brincar com os filhos, viver sem dores e evitar infartos.</p>

        <div class="card-highlight text-center">
          <h5>🌟 Os 3 Passos para o Sucesso:</h5>
          <ol class="text-left" style="display: inline-block; max-width: 500px; margin: 15px auto;">
            <li><strong>Médico é Fundamental:</strong> Nunca tome por conta própria. Siga as orientações do seu doutor.</li>
            <li><strong>Mude sua Rotina:</strong> Priorize proteínas (de origem animal ou vegetal), hidrate-se e faça treino de força para proteger sua massa muscular.</li>
            <li><strong>Fuja do Falso:</strong> Compre apenas em farmácias sérias e desconfie de remédios de internet.</li>
          </ol>
        </div>

        <p class="text-center" style="margin-top: 30px;">
          <em>Parabéns por ler até aqui! Use nossos <strong>Recursos Interativos</strong> no menu para testar o que aprendeu e montar sua lista de dúvidas para levar na sua próxima consulta médica.</em>
        </p>
      `
    },
    {
      id: "fontes",
      type: "content",
      title: "Fontes e Revisão Editorial",
      subtitle: "Transparência e Responsabilidade",
      summary: "As referências que embasam este guia e como ele deve ser usado.",
      content: `
        <p class="lead">Este material foi elaborado com base em fontes oficiais e na literatura científica. Ele tem caráter <strong>exclusivamente educativo</strong> e não substitui a bula, o profissional de saúde nem a consulta médica.</p>

        <h3>📚 Principais referências</h3>
        <ul>
          <li><strong>Bula do Mounjaro® (tirzepatida)</strong> — Eli Lilly, aprovada pela ANVISA. Fonte primária para indicações, contraindicações, advertências e reações adversas.</li>
          <li><strong>ANVISA</strong> — registro e atualizações de indicação no Brasil (diabetes tipo 2 e controle crônico de peso).</li>
          <li><strong>FDA — Prescribing Information (Mounjaro / Zepbound)</strong> — informações regulatórias dos EUA.</li>
          <li><strong>Programa de estudos SURPASS</strong> — ensaios clínicos de tirzepatida no diabetes tipo 2 (publicados no <em>The New England Journal of Medicine</em> e <em>The Lancet</em>).</li>
          <li><strong>Programa de estudos SURMOUNT</strong> — ensaios clínicos de tirzepatida no controle de peso (publicados no <em>The New England Journal of Medicine</em>).</li>
          <li><strong>SURMOUNT-OSA</strong> — ensaio de tirzepatida na apneia obstrutiva do sono em adultos com obesidade (<em>The New England Journal of Medicine</em>, 2024).</li>
          <li><strong>SUMMIT</strong> — ensaio de tirzepatida na insuficiência cardíaca com fração de ejeção preservada (HFpEF) e obesidade (<em>The New England Journal of Medicine</em>, 2024).</li>
          <li><strong>SYNERGY-NASH</strong> — ensaio de fase 2 de tirzepatida na esteato-hepatite (MASH) com fibrose (<em>The New England Journal of Medicine</em>, 2024).</li>
          <li><strong>PubChem (CID 166567236)</strong> — dados de identidade química da tirzepatida.</li>
        </ul>

        <div class="alert alert-warning">
          <strong>⚠️ Aviso médico-legal:</strong> os percentuais de perda de peso citados referem-se a médias observadas em ensaios clínicos, sob acompanhamento profissional, e <strong>não representam promessa de resultado individual</strong>. Resultados de estudos em andamento (como em insuficiência cardíaca e doença hepática) <strong>não equivalem a indicações aprovadas</strong> na bula. Mounjaro® é marca registrada da Eli Lilly. O uso é exclusivamente sob prescrição.
        </div>

        <div class="alert alert-info">
          <strong>🩺 Revisão editorial:</strong> recomenda-se que o conteúdo médico seja revisado por profissional habilitado (médico/endocrinologista e farmacêutico) antes da publicação, com data de última revisão visível ao leitor.
        </div>

        <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 1.5rem;">As referências acima são indicadas para consulta direta às fontes originais. Sempre confirme informações de dose, uso e segurança na bula vigente e com seu médico.</p>
      `
    }
  ],

  // Banco de perguntas para o Quiz Interativo
  quiz: [
    {
      question: "Qual é a substância principal que forma o Mounjaro?",
      options: [
        "Semaglutida",
        "Liraglutida",
        "Tirzepatida",
        "Dulaglutida"
      ],
      correct: 2,
      explanation: "A Tirzepatida é a substância do Mounjaro. A Semaglutida é a do Ozempic."
    },
    {
      question: "Qual o grande diferencial do Mounjaro comparado aos remédios mais antigos?",
      options: [
        "Ele é um comprimido tomado pela boca.",
        "Ele imita dois hormônios ao mesmo tempo no corpo.",
        "Ele destrói diretamente as células de gordura.",
        "Ele age só no estômago, sem ir para o cérebro."
      ],
      correct: 1,
      explanation: "O Mounjaro manda dupla mensagem para o corpo, controlando melhor a fome."
    },
    {
      question: "Qual é o efeito ruim mais comum que as pessoas sentem no início?",
      options: [
        "Dores nas pernas.",
        "Muita vontade de comer doce de madrugada.",
        "Enjoo, porque a comida demora mais para sair do estômago.",
        "Coração batendo muito rápido e insônia."
      ],
      correct: 2,
      explanation: "O estômago trabalha mais devagar, o que pode causar um pequeno enjoo nos primeiros dias."
    },
    {
      question: "Quem NÃO pode usar o Mounjaro de jeito nenhum?",
      options: [
        "Pessoas com pressão alta leve.",
        "Pessoas com histórico na família de um tipo específico de câncer de tireoide.",
        "Pessoas que têm dificuldade de dormir.",
        "Pessoas que já tomaram vitaminas."
      ],
      correct: 1,
      explanation: "Problemas específicos de câncer na tireoide na família impedem o uso do remédio."
    },
    {
      question: "O que é obrigatório fazer durante o uso para não ficar fraco e perder músculos?",
      options: [
        "Ficar de repouso absoluto.",
        "Tomar apenas sucos e não comer nada.",
        "Comer boas fontes de proteínas (carnes, ovos) e fazer musculação.",
        "Beber muito café."
      ],
      correct: 2,
      explanation: "Para não perder massa muscular durante o emagrecimento, é preciso comer bem e fazer exercícios de força."
    }
  ],

  // Dados para o comparador visual de medicamentos
  comparison: [
    {
      name: "Mounjaro",
      active: "Tirzepatida",
      class: "Imita 2 Hormônios",
      frequency: "1 vez por semana (Injeção)",
      weightLoss: "Até 20% do peso (nos testes)",
      mainEfects: "Enjoo, vômito, intestino preso ou solto.",
      cost: "Alto",
      status: "Novo no Brasil para tratar diabetes tipo 2"
    },
    {
      name: "Ozempic / Wegovy",
      active: "Semaglutida",
      class: "Imita 1 Hormônio",
      frequency: "1 vez por semana (Injeção)",
      weightLoss: "Em média 15% do peso",
      mainEfects: "Enjoo, intestino preso ou solto.",
      cost: "Médio a Alto",
      status: "Muito usado e famoso no Brasil"
    },
    {
      name: "Saxenda",
      active: "Liraglutida",
      class: "Imita 1 Hormônio (mais antigo)",
      frequency: "Todo dia (Injeção)",
      weightLoss: "Em média 8% do peso",
      mainEfects: "Enjoo logo no começo.",
      cost: "Médio",
      status: "Comum e já antigo no mercado"
    },
    {
      name: "Metformina",
      active: "Metformina",
      class: "Ajuda a usar o açúcar",
      frequency: "Todo dia (Comprimido)",
      weightLoss: "Quase nada, foca na saúde do sangue",
      mainEfects: "Dor na barriga, diarreia leve.",
      cost: "Muito Baixo / Grátis",
      status: "Básico para quem tem diabetes"
    }
  ],

  // Itens para o checklist interativo de contraindicações
  contraindications: [
    { id: "cmt", text: "Alguém da família já teve um câncer de tireoide muito raro?" },
    { id: "nem2", text: "Tem alguma doença genética grave de tumores?" },
    { id: "allergy", text: "Tem alergia grave a esse remédio?" },
    { id: "pregnant", text: "Está grávida ou quer engravidar logo?" },
    { id: "breastfeeding", text: "Está amamentando bebê no peito?" },
    { id: "pancreatitis", text: "Já teve algum problema grave no pâncreas?" },
    { id: "gastroparesis", text: "Tem o estômago quase paralisado ou muito lento?" },
    { id: "kidney", text: "Faz hemodiálise ou tem problema sério nos rins?" }
  ],

  // Glossário com explicações simples
  glossary: {
    "Tirzepatida": "É o nome da substância química que fica dentro da caneta do Mounjaro.",
    "GLP-1 e GIP": "São como mensageiros naturais do nosso intestino que avisam o corpo para usar energia e parar de sentir fome.",
    "Glicada (HbA1c)": "Um exame de sangue que mostra a nota média do seu açúcar no sangue nos últimos três meses.",
    "Bariátrica": "Cirurgia para diminuir o tamanho do estômago.",
    "Sarcopenia": "Perder muita carne e músculos, ficando fraco porque emagreceu da forma errada.",
    "Gastroparesia": "Quando a comida fica empacada no estômago, porque ele trabalha devagar demais.",
    "GIPR": "Receptor celular do hormônio GIP. Atua otimizando a queima de gordura e atenuando as náuseas.",
    "GLP1R": "Receptor celular do hormônio GLP-1. Regula a sensação de saciedade e reduz a fome.",
    "SURMOUNT-1": "Ensaio clínico global da Eli Lilly que avaliou o emagrecimento saudável em adultos com sobrepeso/obesidade.",
    "SURPASS-2": "Ensaio clínico global da Eli Lilly que comprovou a superioridade da Tirzepatida contra a Semaglutida no diabetes tipo 2.",
    "HbA1c": "Exame de hemoglobina glicada, que mede o açúcar médio do sangue nos últimos 3 meses.",
    "coagonista": "Substância médica projetada para ativar simultaneamente dois receptores celulares (como o GIP e GLP-1)."
  },

  // Efeitos colaterais com dicas fáceis
  adverseEffects: [
    {
      symptom: "Enjoo (Náusea)",
      frequency: "Acontece muito no início",
      tip: "Coma bem pouquinho de cada vez. Evite comida com muita gordura ou pimenta. Não deite na cama logo depois de comer."
    },
    {
      symptom: "Intestino Preso",
      frequency: "Acontece bastante",
      tip: "Beba muita água o dia todo e coma fibras (frutas, saladas). Andar e se mexer ajuda o intestino a funcionar."
    },
    {
      symptom: "Diarreia (Intestino Solto)",
      frequency: "Acontece e passa",
      tip: "Fique longe de frituras e leite puro. Beba muita água, água de coco ou soro para não secar por dentro."
    },
    {
      symptom: "Azia e Queimação",
      frequency: "Comum",
      tip: "Jante cedo. Mastigue bem devagar. Diminua o café e o refrigerante."
    },
    {
      symptom: "Cansaço e Fraqueza",
      frequency: "Às vezes",
      tip: "Isso acontece porque você está comendo pouco. Não pule refeições. Tente dormir bem e comer proteínas (ovo, carne)."
    }
  ]
};
