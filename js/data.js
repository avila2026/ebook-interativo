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

        <p class="lead">Você já sentiu que, por mais que tente, o seu próprio corpo parece jogar contra você na hora de emagrecer? Você não está sozinho. A boa notícia é que a ciência finalmente entendeu isso, e estamos vivendo <strong>a maior revolução da saúde</strong> das últimas décadas.</p>
        
        <p>Nos últimos tempos, você provavelmente tem visto na TV e nas redes sociais histórias de pessoas que transformaram seus corpos e recuperaram a alegria de viver. Grande parte dessa revolução tem um nome: <strong>Mounjaro</strong> (feito com uma substância chamada tirzepatida).</p>
        
        <div class="card-highlight">
          <h4>💡 O Fim do Efeito Sanfona?</h4>
          <p>Diferente de tudo o que já existiu, o Mounjaro não é só uma "ajudinha" para perder peso. Ele age exatamente onde o problema começa: reeducando os sinais do seu estômago e cérebro. Ele imita hormônios naturais que dizem ao corpo: "Ei, já temos energia suficiente, não precisamos de mais fome agora!". O resultado? O açúcar no sangue despenca e você recupera o controle sobre o que come.</p>
        </div>

        <h3>Por Que Ele é Tão Falado?</h3>
        <p>Os resultados são surpreendentes. Em testes pelo mundo, muitas pessoas conseguiram perder cerca de <strong>20% do seu peso</strong>. Pense nisso não apenas em quilos perdidos, mas em ganho de vida: é poder brincar com os filhos sem perder o fôlego, ver os exames voltarem ao normal e amarrar o sapato sem dificuldade. Antes, só cirurgias muito invasivas conseguiam fazer isso.</p>

        <h3>O Que Você Vai Descobrir Aqui</h3>
        <p>A internet está cheia de promessas mágicas e informações falsas. Nosso objetivo neste Ebook é segurar a sua mão e explicar <strong>tudo de um jeito muito simples e honesto</strong>. Sem palavras difíceis e sem enrolação.</p>

        <p>Você vai entender como esse tratamento funciona, o que esperar de verdade, os cuidados que deve ter e como transformar o Mounjaro no seu maior aliado para reconquistar a sua saúde e autoestima.</p>

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
            <p><strong>Ação Dupla:</strong> O Mounjaro imita DOIS mensageiros ao mesmo tempo, trazendo resultados tão fortes que se comparam aos de uma cirurgia.</p>
          </div>
        </div>

        <h3>No Brasil</h3>
        <p>A agência de saúde do Brasil (ANVISA) aprovou o Mounjaro em 2023, trazendo uma nova e poderosa opção de tratamento para os brasileiros.</p>
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
        <p>Usar o Mounjaro do jeito certo não é só para ficar magro. Ele conserta várias partes do corpo que não estavam funcionando bem.</p>

        <div class="benefit-grid">
          <div class="benefit-card">
            <h5>🎯 Controla o Açúcar</h5>
            <p>Ajuda muito quem tem diabetes, baixando o açúcar no sangue para níveis normais, igual de uma pessoa sem a doença.</p>
          </div>
          <div class="benefit-card">
            <h5>📉 Perda de Peso Forte</h5>
            <p>Ajuda a perder em média 20% do peso, eliminando aquela gordura perigosa que fica presa nos órgãos da barriga.</p>
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
            <li><strong>Mude sua Rotina:</strong> Coma bem (bastante carne, ovo) e faça força (musculação) para proteger seu corpo.</li>
            <li><strong>Fuja do Falso:</strong> Compre apenas em farmácias sérias e desconfie de remédios de internet.</li>
          </ol>
        </div>

        <p class="text-center" style="margin-top: 30px;">
          <em>Parabéns por ler até aqui! Use nossos <strong>Recursos Interativos</strong> no menu para testar o que aprendeu e montar sua lista de dúvidas para levar na sua próxima consulta médica.</em>
        </p>
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
