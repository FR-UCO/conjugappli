// -------------------------------------------------------------------
// VOCABULARIO - TEST
// -------------------------------------------------------------------

let vocabScore = 0; 
let vocabMaxQuestions = 10; 
let vocabCurrentQuestion = 0; 
let vocabBag = []; 
let vocabMistakes = []; 
let currentVocabObj = null; 
let isCheckingVocab = false;

function saveVocabProgress() {
    const state = { vocabScore, vocabMaxQuestions, vocabCurrentQuestion, vocabBag, vocabMistakes, currentVocabObj };
    localStorage.setItem('progreso_vocabulario', JSON.stringify(state));
}

function actualizarBotonesVocab() {
    const guardado = localStorage.getItem('progreso_vocabulario');
    const containerPartida = document.getElementById('vocab-partida-options');
    const btnComenzar = document.getElementById('vocab-btn-comenzar-root');

    if (guardado) {
        if (containerPartida) containerPartida.style.display = 'flex';
        if (btnComenzar) btnComenzar.style.display = 'none';
    } else {
        if (containerPartida) containerPartida.style.display = 'none';
        if (btnComenzar) btnComenzar.style.display = 'block';
    }
}

function startVocabQuiz() {
    vocabMaxQuestions = parseInt(document.getElementById('vocab-qty-select').value) || 10;
    vocabScore = 0; 
    vocabCurrentQuestion = 0; 
    vocabMistakes = [];
    vocabBag = [...verbs].sort(() => Math.random() - 0.5).slice(0, vocabMaxQuestions); 
    
    document.getElementById('vocab-setup').style.display = 'none'; 
    document.getElementById('vocab-results').style.display = 'none'; 
    document.getElementById('vocab-play').style.display = 'block';
    
    generateVocabQuestion();
}

function continuarVocab() {
    const data = JSON.parse(localStorage.getItem('progreso_vocabulario'));
    if (!data) return;

    Object.assign(window, data); // Restaurar variables globales

    document.getElementById('vocab-setup').style.display = 'none';
    document.getElementById('vocab-play').style.display = 'block';
    renderizarPreguntaActual();
}

function nuevaPartidaVocab() {
    if (confirm("¿Seguro que quieres borrar tu test actual?")) {
        localStorage.removeItem('progreso_vocabulario');
        actualizarBotonesVocab();
    }
}

function generateVocabQuestion() {
    if (vocabCurrentQuestion >= vocabMaxQuestions) {
        endVocabQuiz();
        return;
    }
    
    isCheckingVocab = false;
    vocabCurrentQuestion++;
    saveVocabProgress();
    renderizarPreguntaActual();
}

function renderizarPreguntaActual() {
    document.getElementById('vocab-progress').innerText = `Palabra ${vocabCurrentQuestion} / ${vocabMaxQuestions}`;
    document.getElementById('vocab-progress-bar').style.width = ((vocabCurrentQuestion / vocabMaxQuestions) * 100) + "%";
    
    document.getElementById('vocab-btn-check').style.display = 'block';
    document.getElementById('vocab-btn-next').style.display = 'none';
    document.getElementById('vocab-feedback').style.display = "none";

    if (!currentVocabObj) currentVocabObj = vocabBag.pop();

    document.getElementById('vocab-icon').innerText = currentVocabObj.icon || '❓';
    document.getElementById('vocab-es').innerText = currentVocabObj.es;

    const inputField = document.getElementById('vocab-input');
    inputField.disabled = false;
    inputField.value = "";
    inputField.focus();
}

function checkVocab() {
    if (isCheckingVocab) return;
    
    const inputField = document.getElementById('vocab-input');
    let ans = inputField.value.trim().toLowerCase().replace(/\s+/g, ' ').replace(/['’´]/g, "'");
    if (ans === "") return;

    isCheckingVocab = true;
    inputField.disabled = true;
    document.getElementById('vocab-btn-check').style.display = 'none';

    const fb = document.getElementById('vocab-feedback');
    fb.style.display = "block";

    const correctAns = currentVocabObj.fr.toLowerCase().replace(/['’´]/g, "'");

    if (ans === correctAns) {
        vocabScore++;
        fb.className = "feedback correct";
        fb.innerText = "✅ ¡Correcto!";
        if (typeof sumarPuntoRanking === 'function') sumarPuntoRanking(1);
        if (typeof speak === 'function') speak(currentVocabObj.fr);
        setTimeout(generateVocabQuestion, 900);
    } else {
        vocabMistakes.push({ es: currentVocabObj.es, fr: currentVocabObj.fr, actual: ans });
        fb.className = "feedback wrong";
        fb.innerText = `❌ No, era: ${currentVocabObj.fr}`;
        document.getElementById('vocab-btn-next').style.display = 'block';
    }
    saveVocabProgress();
}

function advanceVocab() {
    generateVocabQuestion();
}

function endVocabQuiz() {
    localStorage.removeItem('progreso_vocabulario');
    
    const play = document.getElementById('vocab-play');
    const results = document.getElementById('vocab-results');
    
    if (play) play.style.display = 'none';
    if (results) results.style.display = 'block';

    const percentage = Math.round((vocabScore / vocabMaxQuestions) * 100);
    const scoreDisplay = document.getElementById('vocab-score-display');
    
    if (scoreDisplay) {
        scoreDisplay.innerText = `${vocabScore} / ${vocabMaxQuestions} (${percentage}%)`;

        if (percentage >= 80) scoreDisplay.style.color = "var(--fr-blue)";
        else if (percentage >= 50) scoreDisplay.style.color = "#f39c12";
        else scoreDisplay.style.color = "var(--fr-red)";
    }

    // Mostrar errores
    const mistakesDisplay = document.getElementById('vocab-mistakes-display');
    if (mistakesDisplay && vocabMistakes.length > 0) {
        let html = `<h4>📝 Errores:</h4><div class="mistakes-container">`;
        vocabMistakes.forEach((m, i) => {
            html += `<div class="mistake-item"><strong>${i+1}. ${m.es}</strong><br>❌ ${m.actual}<br>✅ <strong>${m.fr}</strong></div>`;
        });
        mistakesDisplay.innerHTML = html + "</div>";
    }

    actualizarBotonesVocab();
}

function resetVocabQuiz() {
    document.getElementById('vocab-setup').style.display = 'block';
    document.getElementById('vocab-results').style.display = 'none';
    actualizarBotonesVocab();
}

// Inicializar botones al cargar
if (typeof actualizarBotonesVocab === 'function') {
    window.addEventListener('load', actualizarBotonesVocab);
}
// ====================== INICIALIZACIÓN VOCAB ======================
function initVocabUI() {
    const playContainer = document.getElementById('vocab-play');
    if (!playContainer) return;

    playContainer.innerHTML = `
        <div class="quiz-header">
            <div id="vocab-progress" style="font-weight:700; margin-bottom:8px;">Palabra 1 / 10</div>
            <div class="progress-container">
                <div id="vocab-progress-bar" class="progress-bar"></div>
            </div>
        </div>

        <div style="text-align:center; font-size:4.5rem; margin:20px 0;" id="vocab-icon">❓</div>
        <h3 id="vocab-es" style="text-align:center; margin:15px 0; min-height:60px;"></h3>

        <input type="text" id="vocab-input" placeholder="Escribe en francés..." style="text-align:center; font-size:1.3rem;">
        
        <div id="vocab-feedback" class="feedback" style="display:none; margin:15px 0; padding:15px; border-radius:12px; font-weight:700;"></div>

        <button id="vocab-btn-check" onclick="checkVocab()" class="btn-action">Comprobar</button>
        <button id="vocab-btn-next" onclick="advanceVocab()" class="btn-action" style="display:none; background:#f39c12;">Siguiente →</button>
    `;
}

// Llamar al cargar
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(initVocabUI, 300);
        actualizarBotonesVocab();
    });
}
