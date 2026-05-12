// -------------------------------------------------------------------
// VOCABULAIRE (CON PERSISTENCIA DE PARTIDA)
// -------------------------------------------------------------------

// 1. VARIABLES GLOBALES
let vocabScore = 0; 
let vocabMaxQuestions = 10; 
let vocabCurrentQuestion = 0; 
let vocabBag = []; 
let vocabMistakes = []; 
let currentVocabObj = null; 
let isCheckingVocab = false;

// 2. FUNCIONES DE PERSISTENCIA (Guardar/Cargar)
function saveVocabProgress() {
    const state = {
        vocabScore,
        vocabMaxQuestions,
        vocabCurrentQuestion,
        vocabBag,
        vocabMistakes,
        currentVocabObj
    };
    localStorage.setItem('progreso_vocabulario', JSON.stringify(state));
}

function actualizarBotonesVocab() {
    const guardado = localStorage.getItem('progreso_vocabulario');
    const containerPartida = document.getElementById('vocab-partida-options'); // El div de los dos botones
    const btnComenzar = document.getElementById('vocab-btn-comenzar-root'); // El botón azul de "Comenzar test"

    if (guardado) {
        if (containerPartida) containerPartida.style.display = 'flex';
        if (btnComenzar) btnComenzar.style.display = 'none';
    } else {
        if (containerPartida) containerPartida.style.display = 'none';
        if (btnComenzar) btnComenzar.style.display = 'block';
    }
}

// 3. LÓGICA DE INICIO Y CONTINUACIÓN
function startVocabQuiz() {
    vocabMaxQuestions = parseInt(document.getElementById('vocab-qty-select').value);
    vocabScore = 0; 
    vocabCurrentQuestion = 0; 
    vocabMistakes = [];
    // Mezclamos y cortamos el mazo de verbos
    vocabBag = [...verbs].sort(() => Math.random() - 0.5).slice(0, vocabMaxQuestions); 
    
    document.getElementById('vocab-setup').style.display = 'none'; 
    document.getElementById('vocab-results').style.display = 'none'; 
    document.getElementById('vocab-play').style.display = 'block';
    
    generateVocabQuestion();
}

function continuarVocab() {
    const data = JSON.parse(localStorage.getItem('progreso_vocabulario'));
    if (!data) return;

    // Restauramos el estado exacto
    vocabScore = data.vocabScore;
    vocabMaxQuestions = data.vocabMaxQuestions;
    vocabCurrentQuestion = data.vocabCurrentQuestion;
    vocabBag = data.vocabBag;
    vocabMistakes = data.vocabMistakes;
    currentVocabObj = data.currentVocabObj;

    document.getElementById('vocab-setup').style.display = 'none';
    document.getElementById('vocab-play').style.display = 'block';
    
    renderizarPreguntaActual(); 
}

function nuevaPartidaVocab() {
    if (confirm("¿Seguro que quieres borrar tu test actual y empezar uno nuevo?")) {
        localStorage.removeItem('progreso_vocabulario');
        actualizarBotonesVocab();
    }
}

// 4. LÓGICA DEL JUEGO
function generateVocabQuestion() {
    if (vocabCurrentQuestion >= vocabMaxQuestions) { 
        endVocabQuiz(); 
        return; 
    }
    
    isCheckingVocab = false; 
    vocabCurrentQuestion++;
    
    // Guardamos progreso cada vez que inicia una palabra nueva
    saveVocabProgress();
    renderizarPreguntaActual();
}

function renderizarPreguntaActual() {
    document.getElementById('vocab-progress').innerText = `Palabra ${vocabCurrentQuestion} / ${vocabMaxQuestions}`;
    document.getElementById('vocab-progress-bar').style.width = ((vocabCurrentQuestion / vocabMaxQuestions) * 100) + "%";
    document.getElementById('vocab-btn-check').style.display = 'block'; 
    document.getElementById('vocab-btn-next').style.display = 'none'; 
    document.getElementById('vocab-feedback').style.display = "none";
    
    // Si no venimos de "Continuar", sacamos una nueva palabra del mazo
    if (!currentVocabObj || (vocabBag.length + vocabCurrentQuestion > vocabMaxQuestions)) {
        currentVocabObj = vocabBag.pop();
    }
    
    document.getElementById('vocab-icon').innerText = currentVocabObj.icon; 
    document.getElementById('vocab-es').innerText = currentVocabObj.es;
    
    let inputField = document.getElementById('vocab-input'); 
    inputField.disabled = false; 
    inputField.value = ""; 
    inputField.focus();
    
    // Actualizamos visibilidad de botones en el setup por si acaso
    actualizarBotonesVocab();
}

function checkVocab() {
    if (isCheckingVocab) return;
    let inputField = document.getElementById('vocab-input');
    let ans = inputField.value.trim().toLowerCase().replace(/\s+/g, ' ').replace(/['’´]/g, "'");
    if (ans === "") return;
    
    isCheckingVocab = true; 
    inputField.disabled = true;
    document.getElementById('vocab-btn-check').style.display = 'none';
    let fb = document.getElementById('vocab-feedback'); 
    fb.style.display = "block";
    
    let correctAns = currentVocabObj.fr.toLowerCase().replace(/['’´]/g, "'");
    
    if (ans === correctAns) {
        vocabScore++; 
        fb.className = "feedback correct"; 
        fb.innerText = "✅ ¡Correcto!";
        
        // Sumar punto al ranking si tienes la función definida
        if (typeof sumarPuntoRanking === 'function') sumarPuntoRanking(); 

        if (typeof speak === 'function') speak(currentVocabObj.fr); 
        saveVocabProgress(); // Guardamos que ya se sumó el punto
        setTimeout(generateVocabQuestion, 1000);
    } else {
        vocabMistakes.push({ es: currentVocabObj.es, fr: currentVocabObj.fr, actual: ans });
        fb.className = "feedback wrong"; 
        fb.innerText = `❌ No, era: ${currentVocabObj.fr}`;
        document.getElementById('vocab-btn-next').style.display = 'block';
        saveVocabProgress(); // Guardamos el error
    }
}

function advanceVocab() { 
    generateVocabQuestion(); 
}

function endVocabQuiz() {
    // Al terminar, borramos la partida guardada
    localStorage.removeItem('progreso_vocabulario');
    
    document.getElementById('vocab-play').style.display = 'none'; 
    document.getElementById('vocab-results').style.display = 'block';
    
    let percentage = Math.round((vocabScore / vocabMaxQuestions) * 100); 
    let scoreDisplay = document.getElementById('vocab-score-display');
    scoreDisplay.innerText = `${vocabScore} / ${vocabMaxQuestions} (${percentage}%)`;
    
    if(percentage >= 80) scoreDisplay.style.color = "var(--fr-blue)"; 
    else if (percentage >= 50) scoreDisplay.style.color = "#f39c12"; 
    else scoreDisplay.style.color = "var(--fr-red)";
    
    let mistakesDisplay = document.getElementById('vocab-mistakes-display');
    if (vocabMistakes.length > 0) {
        let mistakesHTML = `<h4 style="text-align: left; color: var(--fr-red);">📝 Resumen de errores:</h4><div class="mistakes-container">`;
        vocabMistakes.forEach((m, i) => { 
            mistakesHTML += `<div class="mistake-item"><strong>${i+1}. ${m.es}</strong><br><span style="color:#721c24;">❌ Escribiste: ${m.actual}</span><br><span style="color:#155724;">✅ Correcto: <strong>${m.fr}</strong></span></div>`; 
        });
        mistakesDisplay.innerHTML = mistakesHTML + "</div>"; 
        mistakesDisplay.style.display = 'block';
    } else {
        mistakesDisplay.style.display = 'none';
    }
    actualizarBotonesVocab();
}

function resetVocabQuiz() { 
    document.getElementById('vocab-setup').style.display = 'block'; 
    document.getElementById('vocab-results').style.display = 'none'; 
    actualizarBotonesVocab();
}
