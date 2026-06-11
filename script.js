const html = document.documentElement;

const themeBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');
let isDark = true;

function setTheme(dark) {
  isDark = dark;
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeLabel.textContent = dark ? 'Claro' : 'Escuro';
  if (dark) {
    themeIcon.innerhtml = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>';
  } else {
    themeIcon.innerhtml = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  }
}
themeBtn.addEventListener('click', () => setTheme(!isDark));

/* ── FONT SIZE ─────────────────────────────────────── */
const sizes = [12, 14, 16, 18, 20];
let sizeIdx = 2;
function applySize() {
  html.style.fontSize = sizes[sizeIdx] + 'px';
}
document.getElementById('fontDown').addEventListener('click', () => { if (sizeIdx > 0) { sizeIdx--; applySize(); } });
document.getElementById('fontUp').addEventListener('click', () => { if (sizeIdx < sizes.length - 1) { sizeIdx++; applySize(); } });
document.getElementById('fontReset').addEventListener('click', () => { sizeIdx = 2; applySize(); });

/* ── FILE UPLOAD ──────────────────────────────────── */
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewImg = document.getElementById('previewImg');
const uploadContent = document.getElementById('uploadContent');
const analyzeBtn = document.getElementById('analyzeBtn');
let selectedFile = null;
let selectedSample = null;

uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea.addEventListener('drop', e => {
  e.preventDefault(); uploadArea.classList.remove('drag-over');
  const f = e.dataTransfer.files[0];
  if (f && f.type.startsWith('image/')) loadFile(f);
});
uploadArea.addEventListener('click', () => { if (!selectedFile) fileInput.click(); });
fileInput.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });

function loadFile(f) {
  selectedFile = f; selectedSample = null;
  const reader = new FileReader();
  reader.onload = ev => {
    previewImg.src = ev.target.result;
    previewImg.style.display = 'block';
    uploadContent.style.display = 'none';
    analyzeBtn.disabled = false;
  };
  reader.readAsDataURL(f);
}

/* ── SAMPLE BUTTONS ────────────────────────────────── */
document.querySelectorAll('[data-sample]').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedSample = btn.getAttribute('data-sample');
    selectedFile = null;
    previewImg.style.display = 'none';
    uploadContent.style.display = 'block';
    btn.style.background = 'var(--green-dim)';
    btn.style.borderColor = 'var(--green)';
    btn.style.color = 'var(--green)';
    document.querySelectorAll('[data-sample]').forEach(b => {
      if (b !== btn) { b.style.background = ''; b.style.borderColor = ''; b.style.color = ''; }
    });
    analyzeBtn.disabled = false;
  });
});

/* ── PEST DATABASE ────────────────────────────────── */
const pests = {
  lagarta: {
    name: 'Lagarta-do-cartucho',
    sci: 'Spodoptera frugiperda',
    severity: 78,
    level: 'Alta',
    levelColor: 'var(--red)',
    crops: ['Milho', 'Sorgo', 'Trigo', 'Soja'],
    confidence: 94,
    desc: 'Uma das principais pragas do milho no Brasil. As lagartas perfuram as folhas novas formando furos enfileirados e destroem o cartucho da planta.',
    control: 'Aplicação de inseticidas biológicos à base de <em>Bt</em> (Bacillus thuringiensis) ou químicos como espinosade. Monitoramento semanal é essencial.',
    prevention: 'Rotação de culturas, uso de variedades Bt, liberação de parasitoides como <em>Telenomus remus</em>.',
    economic: 'Pode causar perdas de até 60% da produção sem controle adequado.',
  },
  ferrugem: {
    name: 'Ferrugem asiática da soja',
    sci: 'Phakopsora pachyrhizi',
    severity: 85,
    level: 'Muito alta',
    levelColor: 'var(--red)',
    crops: ['Soja'],
    confidence: 97,
    desc: 'Doença fúngica mais destrutiva da soja no Brasil. Causa desfolha precoce e pode destruir 100% da lavoura em condições favoráveis.',
    control: 'Fungicidas dos grupos triazóis + estrobilurinas em rotação. Aplicação preventiva quando 20% das plantas apresentam sintomas.',
    prevention: 'Vazio sanitário rigoroso, cultivares resistentes, monitoramento constante.',
    economic: 'Responsável por R$ 15–20 bilhões em perdas anuais no Brasil.',
  },
  mosca: {
    name: 'Mosca-branca',
    sci: 'Bemisia tabaci (biótipo B)',
    severity: 62,
    level: 'Moderada',
    levelColor: 'var(--amber)',
    crops: ['Soja', 'Algodão', 'Tomate', 'Mandioca'],
    confidence: 88,
    desc: 'Inseto sugador que causa danos diretos por sucção de seiva e indiretos pela transmissão de geminivírus. Vem ganhando importância crescente no cerrado.',
    control: 'Monitoramento com armadilhas amarelas adesivas. Inseticidas neonicotinoides ou reguladores de crescimento de insetos em focos iniciais.',
    prevention: 'Barreiras vegetais, eliminação de plantas hospedeiras alternativas, introdução de parasitoides.',
    economic: 'Perdas de 20–70% em soja; 100% em tomate com geminiviroses severas.',
  },
  cigarrinha: {
    name: 'Cigarrinha-das-pastagens',
    sci: 'Notozulia entreriana / Mahanarva sp.',
    severity: 55,
    level: 'Moderada',
    levelColor: 'var(--amber)',
    crops: ['Braquiária', 'Cana-de-açúcar', 'Milho'],
    confidence: 91,
    desc: 'Principal praga das pastagens brasileiras. Ninfas se desenvolvem na espuma próxima ao solo e adultos sugam folhas, causando "amarelamento em seta".',
    control: 'Fungo entomopatogênico <em>Metarhizium anisopliae</em> (controle biológico) ou inseticidas nos focos. Mais eficaz no estágio de ninfa.',
    prevention: 'Adubação adequada, controle de pastejo, introdução de formigas predadoras.',
    economic: 'Perdas de R$ 4–6 bilhões anuais em pastagens degradadas. Reduz capacidade de suporte em 30–70%.',
  },
};

/* ── ANALYZE ──────────────────────────────────────── */
analyzeBtn.addEventListener('click', async () => {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const loadingEl = document.getElementById('loadingEl');
  const placeholderEl = document.getElementById('placeholderEl');
  const resultContent = document.getElementById('resultContent');

  placeholderEl.style.display = 'none';
  resultContent.style.display = 'none';
  loadingEl.classList.add('show');
  statusDot.classList.add('active');
  statusText.textContent = 'Analisando imagem…';
  analyzeBtn.disabled = true;

  const steps = [
    'Pré-processando imagem…',
    'Extraindo características visuais…',
    'Consultando banco de dados de pragas…',
    'Calculando probabilidades…',
    'Gerando recomendações…',
  ];
  let step = 0;
  const loadingText = document.getElementById('loadingText');
  const interval = setInterval(() => {
    if (step < steps.length) { loadingText.textContent = steps[step++]; }
  }, 600);

  // If real file, use Claude API; if sample, use local data
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const b64 = ev.target.result.split(',')[1];
      const mediaType = selectedFile.type;
      try {
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            system: `Você é um especialista em fitopatologia e entomologia agrícola brasileira. Analise a imagem enviada e identifique se há pragas, doenças ou problemas fitossanitários visíveis. Responda APENAS em JSON com os campos: name (nome comum em português), sci (nome científico), severity (0-100), level (Baixa/Moderada/Alta/Muito alta), crops (array de culturas afetadas), confidence (0-100), desc (descrição em 2 frases), control (medidas de controle), prevention (medidas preventivas), economic (impacto econômico). Se não houver praga visível, retorne name: "Nenhuma praga detectada", severity: 0, confidence: 90 e os demais campos vazios.`,
            messages: [{ role: 'user', content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: b64 } },
              { type: 'text', text: 'Identifique a praga ou doença nesta imagem agrícola.' }
            ]}]
          })
        });
        const data = await resp.json();
        clearInterval(interval);
        const text = data.content.map(i => i.text || '').join('');
        let pest;
        try {
          const clean = text.replace(/```json|```/g, '').trim();
          pest = JSON.parse(clean);
        } catch {
          pest = { name: 'Análise completa', sci: '', severity: 50, level: 'Moderada', crops: [], confidence: 80, desc: text.slice(0, 200), control: '', prevention: '', economic: '' };
        }
        showResult(pest);
      } catch (err) {
        clearInterval(interval);
        showError();
      }
    };
    reader.readAsDataURL(selectedFile);
  } else if (selectedSample) {
    await new Promise(r => setTimeout(r, 3200));
    clearInterval(interval);
    showResult(pests[selectedSample]);
  }
});

function showResult(pest) {
  const loadingEl = document.getElementById('loadingEl');
  const resultContent = document.getElementById('resultContent');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  loadingEl.classList.remove('show');
  statusDot.classList.remove('active');
  statusDot.style.background = 'var(--green)';
  statusText.textContent = 'Análise concluída';
  document.getElementById('analyzeBtn').disabled = false;

  const crops = (pest.crops || []).map(c => `<span class="ai-tag green">${c}</span>`).join('');
  const barColor = pest.severity > 70 ? 'var(--red)' : pest.severity > 40 ? 'var(--amber)' : 'var(--green)';

  resultContent.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
      <div>
        <div class="ai-result-name">${pest.name}</div>
        ${pest.sci ? `<div class="ai-result-sci">${pest.sci}</div>` : ''}
      </div>
      <span class="confidence-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        ${pest.confidence}% confiança
      </span>
    </div>
    ${pest.severity > 0 ? `
    <div class="ai-severity-bar">
      <div class="ai-severity-label"><span>Severidade</span><span style="color:${barColor}; font-weight:600;">${pest.level} (${pest.severity}%)</span></div>
      <div class="ai-bar-track"><div class="ai-bar-fill" style="width:${pest.severity}%; background:${barColor};"></div></div>
    </div>
    ` : ''}
    ${crops ? `<div class="ai-tags">${crops}</div>` : ''}
    <p style="font-size:0.85rem; color:var(--text2); margin-bottom:1rem;">${pest.desc || ''}</p>
    ${pest.control ? `
    <div class="ai-rec-block">
      <div class="ai-rec-title">Controle recomendado</div>
      ${pest.control}
    </div>` : ''}
    ${pest.prevention ? `
    <div class="ai-rec-block" style="margin-top:8px; border-left-color: var(--amber);">
      <div class="ai-rec-title">Prevenção</div>
      ${pest.prevention}
    </div>` : ''}
    ${pest.economic ? `<p style="font-size:0.8rem; color:var(--text3); margin-top:10px;"><strong style="color:var(--text2);">Impacto econômico:</strong> ${pest.economic}</p>` : ''}
  `;
  resultContent.style.display = 'block';
}

function showError() {
  const loadingEl = document.getElementById('loadingEl');
  const resultContent = document.getElementById('resultContent');
  loadingEl.classList.remove('show');
  resultContent.innerHTML = `<div style="color:var(--red); font-size:0.875rem;">Erro ao processar. Verifique sua conexão ou tente com um exemplo.</div>`;
  resultContent.style.display = 'block';
  document.getElementById('analyzeBtn').disabled = false;
}
