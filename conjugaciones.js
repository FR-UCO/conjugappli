// --- CONFIGURACIÓN DE CONJUGACIÓN ---
// Cette fonction choisit un pronom au hasard pour les 3èmes personnes
function getPronoun(pIdx) {
    const options = [
        ["Je"],
        ["Tu"],
        ["Il", "Elle", "On"], // Index 2: 3ème personne du singulier
        ["Nous"],
        ["Vous"],
        ["Ils", "Elles"]      // Index 5: 3ème personne du pluriel
    ];
    const choices = options[pIdx];
    return choices[Math.floor(Math.random() * choices.length)];
}

const tenseNamesES = { 
    "present": "Presente de Indicativo", 
    "past": "Passé Composé", 
    "imparfait": "Imperfecto", 
    "futur_proche": "Futuro Próximo", 
    "passe_recent": "Pasado Reciente", 
    "future": "Futuro Simple" 
};
// -------------------------------------------------------------------
// MOTEUR DE CONJUGAISON (100% FIABLE ET BLINDÉ)
// -------------------------------------------------------------------
let currentConj = null; let conjScore = 0; let conjMaxQuestions = 10; let conjCurrentQuestion = 0; let selectedTenseSetting = "present"; let isCheckingAnswer = false; let verbBag = []; let askedQuestions = []; let quizMistakes = []; 

function conjugatePresent(verb, pIdx) {
    let vName = verb.root || verb.fr;
    if (vName === "être") return ["suis", "es", "est", "sommes", "êtes", "sont"][pIdx];
    if (vName === "avoir") return ["ai", "as", "a", "avons", "avez", "ont"][pIdx];
    if (vName === "aller") return ["vais", "vas", "va", "allons", "allez", "vont"][pIdx];
    if (vName === "faire") return ["fais", "fais", "fait", "faisons", "faites", "font"][pIdx];
    if (vName === "prendre" || vName === "comprendre") { let pref = vName === "comprendre" ? "com" : ""; return [pref+"prends", pref+"prends", pref+"prend", pref+"prenons", pref+"prenez", pref+"prennent"][pIdx]; }
    if (vName === "voir") return ["vois", "vois", "voit", "voyons", "voyez", "voient"][pIdx];
    if (vName === "pouvoir") return ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"][pIdx];
    if (vName === "vouloir") return ["veux", "veux", "veut", "voulons", "voulez", "veulent"][pIdx];
    if (vName === "devoir") return ["dois", "dois", "doit", "devons", "devez", "doivent"][pIdx];
    if (vName === "croire") return ["crois", "crois", "croit", "croyons", "croyez", "croient"][pIdx];
    if (vName === "connaître") return ["connais", "connais", "connaît", "connaissons", "connaissez", "connaissent"][pIdx];
    if (vName === "mettre") return ["mets", "mets", "met", "mettons", "mettez", "mettent"][pIdx];
    if (vName === "lire") return ["lis", "lis", "lit", "lisons", "lisez", "lisent"][pIdx];
    if (vName === "écrire") return ["écris", "écris", "écrit", "écrivons", "écrivez", "écrivent"][pIdx];
    if (vName === "boire") return ["bois", "bois", "boit", "buvons", "buvez", "boivent"][pIdx];
    if (vName === "savoir") return ["sais", "sais", "sait", "savons", "savez", "savent"][pIdx];
    if (vName === "venir") return ["viens", "viens", "vient", "venons", "venez", "viennent"][pIdx];
    if (vName === "souvenir") return ["souviens", "souviens", "souvient", "souvenons", "souvenez", "souviennent"][pIdx];
    if (vName === "courir") return ["cours", "cours", "court", "courons", "courez", "courent"][pIdx];
    if (vName === "rire") return ["ris", "ris", "rit", "rions", "riez", "rient"][pIdx];
    if (vName === "conduire") return ["conduis", "conduis", "conduit", "conduisons", "conduisez", "conduisent"][pIdx];
    if (vName === "recevoir") return ["reçois", "reçois", "reçoit", "recevons", "recevez", "reçoivent"][pIdx];
    if (vName === "vivre") return ["vis", "vis", "vit", "vivons", "vivez", "vivent"][pIdx];
    if (vName === "mourir") return ["meurs", "meurs", "meurt", "mourons", "mourez", "meurent"][pIdx];
    if (vName === "naître") return ["nais", "nais", "naît", "naissons", "naissez", "naissent"][pIdx];
    if (vName === "envoyer") return ["envoie", "envoies", "envoie", "envoyons", "envoyez", "envoient"][pIdx];
    if (vName === "espérer") return ["espère", "espères", "espère", "espérons", "espérez", "espèrent"][pIdx];
    if (vName === "essayer") return ["essaie", "essaies", "essaie", "essayons", "essayez", "essaient"][pIdx];
    if (vName === "lever") return ["lève", "lèves", "lève", "levons", "levez", "lèvent"][pIdx];
    if (vName === "promener") return ["promène", "promènes", "promène", "promenons", "promenez", "promènent"][pIdx];
    if (vName === "acheter") return ["achète", "achètes", "achète", "achetons", "achetez", "achètent"][pIdx];
    if (vName === "appeler") return ["appelle", "appelles", "appelle", "appelons", "appelez", "appellent"][pIdx];
    if (vName === "payer") return ["paie", "paies", "paie", "payons", "payez", "paient"][pIdx];
    if (vName === "nettoyer") return ["nettoie", "nettoies", "nettoie", "nettoyons", "nettoyez", "nettoient"][pIdx];
    if (vName === "répéter") return ["répète", "répètes", "répète", "répétons", "répétez", "répètent"][pIdx];

    if (vName === "dormir" || vName === "partir" || vName === "sortir" || vName === "sentir") { let rad = vName.slice(0,-3); let radP = vName.slice(0,-2); return [rad+"s", rad+"s", rad+"t", radP+"ons", radP+"ez", radP+"ent"][pIdx]; }
    if (vName === "ouvrir" || vName === "offrir") { let rad = vName.slice(0,-2); return [rad+"e", rad+"es", rad+"e", rad+"ons", rad+"ez", rad+"ent"][pIdx]; }

    let rad = vName.slice(0, -2);
    if (verb.group === "er") {
        if (pIdx === 3) { 
            if (vName.endsWith("ger")) return rad + "eons"; 
            if (vName.endsWith("cer")) return rad.slice(0, -1) + "çons"; 
        }
        return rad + ["e", "es", "e", "ons", "ez", "ent"][pIdx];
    }
    if (verb.group === "ir") return rad + ["is", "is", "it", "issons", "issez", "issent"][pIdx];
    if (verb.group === "re") return rad + ["s", "s", "", "ons", "ez", "ent"][pIdx];
}

function conjugateFuture(verb, pIdx) {
    let vName = verb.root || verb.fr;
    if (vName === "être") return ["serai", "seras", "sera", "serons", "serez", "seront"][pIdx];
    if (vName === "avoir") return ["aurai", "auras", "aura", "aurons", "aurez", "auront"][pIdx];
    if (vName === "aller") return ["irai", "iras", "ira", "irons", "irez", "iront"][pIdx];
    if (vName === "faire") return ["ferai", "feras", "fera", "ferons", "ferez", "feront"][pIdx];
    if (vName === "voir") return ["verrai", "verras", "verra", "verrons", "verrez", "verront"][pIdx];
    if (vName === "pouvoir") return ["pourrai", "pourras", "pourra", "pourrons", "pourrez", "pourront"][pIdx];
    if (vName === "vouloir") return ["voudrai", "voudras", "voudra", "voudrons", "voudrez", "voudront"][pIdx];
    if (vName === "devoir") return ["devrai", "devras", "devra", "devrons", "devrez", "devront"][pIdx];
    if (vName === "savoir") return ["saurai", "sauras", "saura", "saurons", "saurez", "sauront"][pIdx];
    if (vName === "venir") return ["viendrai", "viendras", "viendra", "viendrons", "viendrez", "viendront"][pIdx];
    if (vName === "souvenir") return ["souviendrai", "souviendras", "souviendra", "souviendrons", "souviendrez", "souviendront"][pIdx];
    if (vName === "courir") return ["courrai", "courras", "courra", "courrons", "courrez", "courront"][pIdx];
    if (vName === "mourir") return ["mourrai", "mourras", "mourra", "mourrons", "mourrez", "mourront"][pIdx];
    if (vName === "recevoir") return ["recevrai", "recevras", "recevra", "recevrons", "recevrez", "recevront"][pIdx];
    if (vName === "acheter") return ["achèterai", "achèteras", "achètera", "achèterons", "achèterez", "achèteront"][pIdx];
    if (vName === "lever") return ["lèverai", "lèveras", "lèvera", "lèverons", "lèverez", "lèveront"][pIdx];
    if (vName === "promener") return ["promènerai", "promèneras", "promènera", "promènerons", "promènerez", "promèneront"][pIdx];
    if (vName === "appeler") return ["appellerai", "appelleras", "appellera", "appellerons", "appellerez", "appelleront"][pIdx];
    if (vName === "payer") return ["paierai", "paieras", "paiera", "paierons", "paierez", "paieront"][pIdx];
    if (vName === "nettoyer") return ["nettoierai", "nettoieras", "nettoiera", "nettoierons", "nettoierez", "nettoieront"][pIdx];
    if (vName === "envoyer") return ["enverrai", "enverras", "enverra", "enverrons", "enverrez", "enverront"][pIdx];
    if (vName === "essayer") return ["essaierai", "essaieras", "essaiera", "essaierons", "essaierez", "essaieront"][pIdx];
    
    let base = verb.group === "re" ? vName.slice(0, -1) : vName;
    return base + ["ai", "as", "a", "ons", "ez", "ont"][pIdx];
}

function conjugateImparfait(verb, pIdx) {
    let vName = verb.root || verb.fr;
    let endings = ["ais", "ais", "ait", "ions", "iez", "aient"];
    if (vName === "être") return "ét" + endings[pIdx];
    
    let proxyVerb = {...verb, fr: vName};
    let nousPresent = conjugatePresent(proxyVerb, 3); 
    let rad = nousPresent.slice(0, -3); 
    if (endings[pIdx].startsWith("i")) { 
        if (rad.endsWith("ge")) rad = rad.slice(0, -1); 
        if (rad.endsWith("ç")) rad = rad.slice(0, -1) + "c"; 
    }
    return rad + endings[pIdx];
}

function conjugatePast(verb, pIdx) {
    let aux = verb.aux === "etre" ? ["suis", "es", "est", "sommes", "êtes", "sont"][pIdx] : ["ai", "as", "a", "avons", "avez", "ont"][pIdx];
    if (verb.aux === "etre") { 
        if (pIdx <= 2) return [aux + " " + verb.pp, aux + " " + verb.pp + "e"]; 
        else return [aux + " " + verb.pp + "s", aux + " " + verb.pp + "es"]; 
    }
    return [aux + " " + verb.pp];
}

function conjugateFuturProche(verb, pIdx) { 
    return ["vais", "vas", "va", "allons", "allez", "vont"][pIdx] + " " + (verb.root || verb.fr); 
}

function conjugatePasseRecent(verb, pIdx) { 
    let vName = verb.root || verb.fr; 
    let prep = "aeiouyhéèêh".includes(vName.charAt(0).toLowerCase()) ? "d'" : "de ";
    return ["viens", "viens", "vient", "venons", "venez", "viennent"][pIdx] + " " + prep + vName; 
}

function getReflexive(pIdx, nextWord) { 
    return "aeiouyhéèêh".includes(nextWord.charAt(0).toLowerCase()) ? ["m'", "t'", "s'", "nous ", "vous ", "s'"][pIdx] : ["me ", "te ", "se ", "nous ", "vous ", "se "][pIdx]; 
}

// ====================== FUNCIONES DE PROGRESO Y CONTROL ======================

function updateProgressBar() {
    const progressBar = document.getElementById('conj-progress-bar');
    if (progressBar && conjMaxQuestions > 0) {
        const percentage = (conjCurrentQuestion / conjMaxQuestions) * 100;
        progressBar.style.width = percentage + "%";
    }
}

function saveProgress() {
    const state = {
        score: conjScore,
        maxQuestions: conjMaxQuestions,
        currentQuestion: conjCurrentQuestion,
        tenseSetting: selectedTenseSetting,
        verbBag: verbBag,
        askedQuestions: askedQuestions,
        quizMistakes: quizMistakes,
        currentConj: currentConj
    };
    localStorage.setItem('conjSaveState', JSON.stringify(state));
}

function loadProgress(data) {
    conjScore = data.score || 0;
    conjMaxQuestions = data.maxQuestions || 10;
    conjCurrentQuestion = data.currentQuestion || 0;
    selectedTenseSetting = data.tenseSetting || "present";
    verbBag = data.verbBag || [];
    askedQuestions = data.askedQuestions || [];
    quizMistakes = data.quizMistakes || [];
    currentConj = data.currentConj;

    // Cambiar vistas
    document.getElementById('conj-setup').style.display = 'none';
    document.getElementById('conj-results').style.display = 'none';
    document.getElementById('conj-play').style.display = 'block';

    // Actualizar interfaz
    document.getElementById('conj-progress').innerText = `Pregunta ${conjCurrentQuestion} / ${conjMaxQuestions}`;
    
    if (currentConj) {
        document.getElementById('conj-tense-display').innerText = 
            `Tiempo a conjugar: ${tenseNamesES[currentConj.targetTense] || '—'}`;

        document.getElementById('conj-prompt').innerHTML = `
            ${currentConj.verb.icon || ''} 
            <strong>${currentConj.displayPronoun}</strong> ___ 
            (${currentConj.verb.fr}) 
            <span style="color:#7f8c8d; font-weight:normal;">${currentConj.verb.comp || ''}</span>.
        `;

        document.getElementById('conj-es').innerText = 
            `Traducción: ${currentConj.verb.es} ${currentConj.verb.comp || ''}`;
    }

    document.getElementById('conj-btn-check').style.display = 'block';
    document.getElementById('conj-btn-next').style.display = 'none';
    document.getElementById('conj-feedback').style.display = "none";

    const inputField = document.getElementById('answer-input');
    if (inputField) {
        inputField.disabled = false;
        inputField.value = "";
        inputField.focus();
    }

    updateProgressBar();
}

function continueConjQuiz() {
    const savedState = localStorage.getItem('conjSaveState');
    if (savedState) {
        loadProgress(JSON.parse(savedState));
    } else {
        alert("No hay ninguna partida guardada.");
    }
}

function startConjQuiz() {
    window.conjStartTime = Date.now();

    localStorage.removeItem('conjSaveState');
    
    selectedTenseSetting = document.getElementById('conj-tense-select').value || "present";
    conjMaxQuestions = parseInt(document.getElementById('conj-qty-select').value) || 10;
    
    conjScore = 0;
    conjCurrentQuestion = 0;
    askedQuestions = [];
    quizMistakes = [];
    verbBag = [...verbs].sort(() => Math.random() - 0.5);

    document.getElementById('conj-setup').style.display = 'none';
    document.getElementById('conj-results').style.display = 'none';
    document.getElementById('conj-play').style.display = 'block';

    generateConjQuestion();
}

function generateConjQuestion() {
    if (conjCurrentQuestion >= conjMaxQuestions) {
        endConjQuiz();
        return;
    }

    isCheckingAnswer = false;
    conjCurrentQuestion++;

    document.getElementById('conj-progress').innerText = `Pregunta ${conjCurrentQuestion} / ${conjMaxQuestions}`;
    updateProgressBar();

    document.getElementById('conj-btn-check').style.display = 'block';
    document.getElementById('conj-btn-next').style.display = 'none';
    document.getElementById('conj-feedback').style.display = "none";

    const inputField = document.getElementById('answer-input');
    if (inputField) {
        inputField.disabled = false;
        inputField.value = "";
        inputField.focus();
    }

    // Selección de verbo
    let verb = null;
    let pIdx, targetTense, combination;
    let attempt = 0;

    do {
        if (verbBag.length === 0) {
            verbBag = [...verbs].sort(() => Math.random() - 0.5);
        }

        verb = verbBag.pop();
        pIdx = Math.floor(Math.random() * 6);
        targetTense = selectedTenseSetting;

        if (targetTense === "mixed") {
            const tenses = ["present", "past", "imparfait", "futur_proche", "passe_recent", "future"];
            targetTense = tenses[Math.floor(Math.random() * tenses.length)];
        }

        combination = `${verb.fr}-${pIdx}-${targetTense}`;
        attempt++;

        if (askedQuestions.includes(combination)) {
            verbBag.unshift(verb);
            verb = null;
        }
    } while (!verb && attempt < 50);

    // Fallback
    if (!verb) {
        verb = verbs[Math.floor(Math.random() * verbs.length)];
        pIdx = Math.floor(Math.random() * 6);
        targetTense = selectedTenseSetting === "mixed" ? "present" : selectedTenseSetting;
    }

    askedQuestions.push(combination);

    // Configurar la pregunta
    document.getElementById('conj-tense-display').innerText = `Tiempo a conjugar: ${tenseNamesES[targetTense]}`;

    const vName = verb.root || verb.fr;
    const proxyVerb = { ...verb, fr: vName };
    let baseAnswers = [];

    if (targetTense === "present") baseAnswers = [conjugatePresent(proxyVerb, pIdx)];
    else if (targetTense === "future") baseAnswers = [conjugateFuture(proxyVerb, pIdx)];
    else if (targetTense === "imparfait") baseAnswers = [conjugateImparfait(proxyVerb, pIdx)];
    else if (targetTense === "futur_proche") baseAnswers = [conjugateFuturProche(proxyVerb, pIdx)];
    else if (targetTense === "passe_recent") baseAnswers = [conjugatePasseRecent(proxyVerb, pIdx)];
    else if (targetTense === "past") baseAnswers = conjugatePast(proxyVerb, pIdx);

    let answer = [];
    if (verb.pron) {
        if (["present", "future", "imparfait", "past"].includes(targetTense)) {
            answer = baseAnswers.map(a => getReflexive(pIdx, a) + a);
        } else if (targetTense === "futur_proche") {
            answer = [["vais", "vas", "va", "allons", "allez", "vont"][pIdx] + " " + getReflexive(pIdx, vName) + vName];
        } else if (targetTense === "passe_recent") {
            answer = [["viens", "viens", "vient", "venons", "venez", "viennent"][pIdx] + " de " + getReflexive(pIdx, vName) + vName];
        }
    } else {
        answer = baseAnswers;
    }

    let displayPronoun = getPronoun(pIdx);
    let firstWord = (answer && answer.length > 0 && answer[0]) ? answer[0] : " ";
    if (pIdx === 0) {
        displayPronoun = "aeiouyhéèêh".includes(firstWord.charAt(0).toLowerCase()) ? "J'" : "Je ";
    } else {
        displayPronoun += " ";
    }

    currentConj = {
        verb: verb,
        answer: answer,
        displayPronoun: displayPronoun.trim(),
        targetTense: targetTense
    };

    document.getElementById('conj-prompt').innerHTML = `
        ${verb.icon || ''} <strong>${currentConj.displayPronoun}</strong> ___ 
        (${verb.fr}) <span style="color:#7f8c8d; font-weight:normal;">${verb.comp || ''}</span>.
    `;

    document.getElementById('conj-es').innerText = `Traducción: ${verb.es} ${verb.comp || ''}`;

    saveProgress();
}

function checkConj() {
    if (isCheckingAnswer) return;

    const inputField = document.getElementById('answer-input');
    let ans = inputField.value.trim().toLowerCase().replace(/\s+/g, ' ').replace(/['’´]/g, "'");
    if (ans === "") return;

    isCheckingAnswer = true;
    inputField.disabled = true;
    document.getElementById('conj-btn-check').style.display = 'none';

    const fb = document.getElementById('conj-feedback');
    fb.style.display = "block";

    const isCorrect = currentConj.answer.some(a => 
        a.toLowerCase().replace(/['’´]/g, "'") === ans
    );

    if (isCorrect) {
        conjScore++;
        fb.className = "feedback correct";
        fb.innerText = "✅ ¡Perfecto!";
        if (typeof sumarPuntoRanking === 'function') sumarPuntoRanking(1);
        setTimeout(generateConjQuestion, 1000);
    } else {
        quizMistakes.push({
            pronoun: currentConj.displayPronoun,
            verb: currentConj.verb.fr,
            comp: currentConj.verb.comp,
            expected: currentConj.answer.join(' o '),
            actual: ans
        });
        fb.className = "feedback wrong";
        fb.innerHTML = `❌ Error. La respuesta correcta es:<br><strong style="font-size:1.2em;">${currentConj.answer.join(' o ')}</strong>`;
        document.getElementById('conj-btn-next').style.display = 'block';
    }
}

function advanceConj() {
    generateConjQuestion();
}

// =========================================================
// --- FIN DEL TEST DE CONJUGACIÓN ---
// =========================================================
function endConjQuiz() {
    localStorage.removeItem('conjSaveState');
    
    const play = document.getElementById('conj-play');
    const results = document.getElementById('conj-results');
    
    if (play) play.style.display = 'none';
    if (results) results.style.display = 'block';

    const percentage = Math.round((conjScore / conjMaxQuestions) * 100);
    const scoreDisplay = document.getElementById('conj-score-display');
    
    if (scoreDisplay) {
        scoreDisplay.innerText = `${conjScore} / ${conjMaxQuestions} (${percentage}%)`;

        if (percentage >= 80) {
            scoreDisplay.style.color = "var(--fr-blue)";
            scoreDisplay.innerHTML += "<br>¡Bravo, es excelente! 🏆";
        } else if (percentage >= 50) {
            scoreDisplay.style.color = "#f39c12";
            scoreDisplay.innerHTML += "<br>¡Vas por buen camino! 👍";
        } else {
            scoreDisplay.style.color = "var(--fr-red)";
            scoreDisplay.innerHTML += "<br>¡Un poco más de práctica! 💪";
        }
    }

    // Mostrar errores
    const mistakesDisplay = document.getElementById('conj-mistakes-display');
    if (mistakesDisplay && quizMistakes.length > 0) {
        let html = `<h4 style="text-align: left; color: var(--fr-red);">📝 Resumen de errores:</h4><div class="mistakes-container">`;
        quizMistakes.forEach((m, i) => {
            html += `<div class="mistake-item">
                <strong>${i+1}. ${m.pronoun} ___ (${m.verb})</strong><br>
                <span style="color:#721c24;">❌ Escribiste: <strong>${m.actual}</strong></span><br>
                <span style="color:#155724;">✅ Correcto: <strong>${m.expected}</strong></span>
            </div>`;
        });
        mistakesDisplay.innerHTML = html + `</div>`;
    }

    actualizarBotonesVocab(); // Si existe
}

    // Sistema de badges
    if (percentage >= 80) {
        const tenseSelect = document.getElementById('conj-tense-select');
        const currentTense = tenseSelect ? tenseSelect.options[tenseSelect.selectedIndex].text : "Verbos";
        
        const durationMs = Date.now() - (window.conjStartTime || Date.now());
        const mins = Math.floor(durationMs / 60000);
        const secs = Math.floor((durationMs % 60000) / 1000);
        const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

        if (typeof awardBadge === 'function') {
            awardBadge(conjMaxQuestions.toString(), currentTense, timeStr);
        }
    }

    // Estilo según puntuación
    if (percentage >= 80) {
        scoreDisplay.style.color = "var(--fr-blue)";
        scoreDisplay.innerHTML += "<br>¡Bravo, es excelente! 🏆";
    } else if (percentage >= 50) {
        scoreDisplay.style.color = "#f39c12";
        scoreDisplay.innerHTML += "<br>¡Vas por buen camino! 👍";
    } else {
        scoreDisplay.style.color = "var(--fr-red)";
        scoreDisplay.innerHTML += "<br>¡Un poco más de práctica! 💪";
    }

    // Mostrar errores
    const mistakesDisplay = document.getElementById('conj-mistakes-display');
    if (quizMistakes.length > 0) {
        let html = `<h4 style="text-align: left; color: var(--fr-red);">📝 Resumen de errores:</h4><div class="mistakes-container">`;
        quizMistakes.forEach((m, i) => {
            html += `<div class="mistake-item">
                <strong>${i+1}. ${m.pronoun} ___ (${m.verb}) 
                <span style="color:#7f8c8d; font-weight:normal;">${m.comp || ''}</span></strong><br>
                <span style="color:#721c24;">❌ Escribiste: <strong>${m.actual}</strong></span><br>
                <span style="color:#155724;">✅ Correcto: <strong>${m.expected}</strong></span>
            </div>`;
        });
        mistakesDisplay.innerHTML = html + `</div>`;
        mistakesDisplay.style.display = 'block';
    } else {
        mistakesDisplay.style.display = 'none';
    }
}

function resetConjQuiz() {
    document.getElementById('conj-setup').style.display = 'block';
    document.getElementById('conj-results').style.display = 'none';
    const continueBtn = document.getElementById('btn-continue-conj');
    if (continueBtn) continueBtn.style.display = 'none';
}
// ====================== INICIALIZACIÓN CONJUGACIÓN ======================
function initConjUI() {
    const playContainer = document.getElementById('conj-play');
    if (!playContainer) return;

    playContainer.innerHTML = `
        <div class="quiz-header">
            <div id="conj-progress" style="font-weight:700; margin-bottom:8px;">Pregunta 1 / 10</div>
            <div class="progress-container">
                <div id="conj-progress-bar" class="progress-bar"></div>
            </div>
            <div id="conj-tense-display" style="text-align:center; font-weight:700; color:var(--primary); margin:10px 0;"></div>
        </div>

        <div id="conj-prompt" style="font-size:1.35rem; text-align:center; min-height:80px; margin:20px 0;"></div>
        <div id="conj-es" style="text-align:center; color:#666; margin-bottom:15px;"></div>

        <input type="text" id="answer-input" placeholder="Escribe la conjugación..." style="text-align:center; font-size:1.3rem;">

        <div id="conj-feedback" class="feedback" style="display:none; margin:15px 0; padding:15px; border-radius:12px;"></div>

        <button id="conj-btn-check" onclick="checkConj()" class="btn-action">Comprobar</button>
        <button id="conj-btn-next" onclick="advanceConj()" class="btn-action" style="display:none; background:#f39c12;">Siguiente →</button>
    `;
}

// Inicializar
window.addEventListener('load', () => {
    setTimeout(initConjUI, 400);
});
