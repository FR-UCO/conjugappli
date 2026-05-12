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

function updateProgressBar() { 
    document.getElementById('conj-progress-bar').style.width = ((conjCurrentQuestion / conjMaxQuestions) * 100) + "%"; 
}

function saveProgress() { 
    localStorage.setItem('conjSaveState', JSON.stringify({ score: conjScore, maxQuestions: conjMaxQuestions, currentQuestion: conjCurrentQuestion, tenseSetting: selectedTenseSetting, verbBag: verbBag, askedQuestions: askedQuestions, quizMistakes: quizMistakes, currentConj: currentConj })); 
}

function loadProgress(data) {
    conjScore = data.score; conjMaxQuestions = data.maxQuestions; conjCurrentQuestion = data.currentQuestion; selectedTenseSetting = data.tenseSetting; verbBag = data.verbBag; askedQuestions = data.askedQuestions; quizMistakes = data.quizMistakes || []; currentConj = data.currentConj;
    document.getElementById('conj-setup').style.display = 'none'; document.getElementById('conj-results').style.display = 'none'; document.getElementById('conj-play').style.display = 'block';
    document.getElementById('conj-progress').innerText = `Pregunta ${conjCurrentQuestion} / ${conjMaxQuestions}`;
    document.getElementById('conj-tense-display').innerText = `Tiempo a conjugar: ${tenseNamesES[currentConj.targetTense]}`;
    document.getElementById('conj-prompt').innerHTML = `${currentConj.verb.icon} <strong>${currentConj.displayPronoun}</strong> ___ (${currentConj.verb.fr}) <span style="color:#7f8c8d; font-weight:normal;">${currentConj.verb.comp}</span>.`;
    document.getElementById('conj-es').innerText = `Traducción: ${currentConj.verb.es} ${currentConj.verb.comp}`;
    document.getElementById('conj-btn-check').style.display = 'block'; document.getElementById('conj-btn-next').style.display = 'none'; document.getElementById('conj-feedback').style.display = "none";
    let inputField = document.getElementById('answer-input'); inputField.disabled = false; inputField.value = ""; inputField.focus(); updateProgressBar();
}

function continueConjQuiz() { 
    const savedState = localStorage.getItem('conjSaveState'); 
    if (savedState) loadProgress(JSON.parse(savedState)); 
}

function startConjQuiz() {
    // ⏱️ LE CHRONOMÈTRE DÉMARRE ICI !
    window.conjStartTime = Date.now(); 

    localStorage.removeItem('conjSaveState'); 
    selectedTenseSetting = document.getElementById('conj-tense-select').value; 
    conjMaxQuestions = parseInt(document.getElementById('conj-qty-select').value); 
    conjScore = 0; 
    conjCurrentQuestion = 0; 
    askedQuestions = []; 
    quizMistakes = []; 
    verbBag = [...validVerbsList].sort(() => Math.random() - 0.5); 
    
    document.getElementById('conj-setup').style.display = 'none'; 
    document.getElementById('conj-results').style.display = 'none'; 
    document.getElementById('conj-play').style.display = 'block'; 
    
    generateConjQuestion();
}

function generateConjQuestion() {
    if (conjCurrentQuestion >= conjMaxQuestions) { endConjQuiz(); return; }
    isCheckingAnswer = false; conjCurrentQuestion++; 
    document.getElementById('conj-progress').innerText = `Pregunta ${conjCurrentQuestion} / ${conjMaxQuestions}`; 
    updateProgressBar();
    
    document.getElementById('conj-btn-check').style.display = 'block'; 
    document.getElementById('conj-btn-next').style.display = 'none'; 
    document.getElementById('conj-feedback').style.display = "none";
    
    let inputField = document.getElementById('answer-input'); 
    inputField.disabled = false; inputField.value = ""; inputField.focus();

    let verb, pIdx, targetTense, combination; let attempt = 0;
    do {
        if (verbBag.length === 0) verbBag = [...validVerbsList].sort(() => Math.random() - 0.5);
        verb = verbBag.pop(); pIdx = Math.floor(Math.random() * 6); targetTense = selectedTenseSetting;
        if (targetTense === "mixed") targetTense = ["present", "past", "imparfait", "futur_proche", "passe_recent", "future"][Math.floor(Math.random() * 6)];
        combination = `${verb.fr}-${pIdx}-${targetTense}`; attempt++;
        if (askedQuestions.includes(combination)) { verbBag.unshift(verb); verb = null; }
    } while (!verb && attempt < 50);
    
    if (!verb) { verb = validVerbsList[Math.floor(Math.random() * validVerbsList.length)]; pIdx = Math.floor(Math.random() * 6); targetTense = selectedTenseSetting === "mixed" ? "present" : selectedTenseSetting; }
    
    askedQuestions.push(combination); 
    document.getElementById('conj-tense-display').innerText = `Tiempo a conjugar: ${tenseNamesES[targetTense]}`;
    
    let vName = verb.root || verb.fr; 
    let proxyVerb = {...verb, fr: vName}; 
    let baseAnswers = [];
    
    if (targetTense === "present") baseAnswers = [conjugatePresent(proxyVerb, pIdx)]; 
    else if (targetTense === "future") baseAnswers = [conjugateFuture(proxyVerb, pIdx)]; 
    else if (targetTense === "imparfait") baseAnswers = [conjugateImparfait(proxyVerb, pIdx)]; 
    else if (targetTense === "futur_proche") baseAnswers = [conjugateFuturProche(proxyVerb, pIdx)]; 
    else if (targetTense === "passe_recent") baseAnswers = [conjugatePasseRecent(proxyVerb, pIdx)]; 
    else if (targetTense === "past") baseAnswers = conjugatePast(proxyVerb, pIdx);
    
    let answer = [];
    if (verb.pron) {
        if (["present", "future", "imparfait", "past"].includes(targetTense)) answer = baseAnswers.map(a => getReflexive(pIdx, a) + a);
        else if (targetTense === "futur_proche") answer = [["vais", "vas", "va", "allons", "allez", "vont"][pIdx] + " " + getReflexive(pIdx, vName) + vName];
        else if (targetTense === "passe_recent") answer = [["viens", "viens", "vient", "venons", "venez", "viennent"][pIdx] + " de " + getReflexive(pIdx, vName) + vName];
    } else answer = baseAnswers;
    
    let displayPronoun = pronouns[pIdx];
    let firstWord = (answer && answer.length > 0 && answer[0]) ? answer[0] : " ";
    if (pIdx === 0) displayPronoun = "aeiouyhéèêh".includes(firstWord.charAt(0).toLowerCase()) ? "J'" : "Je "; else displayPronoun += " ";
    
    currentConj = { verb: verb, answer: answer, displayPronoun: displayPronoun.trim(), targetTense: targetTense };
    
    document.getElementById('conj-prompt').innerHTML = `${verb.icon} <strong>${displayPronoun}</strong> ___ (${verb.fr}) <span style="color:#7f8c8d; font-weight:normal;">${verb.comp}</span>.`;
    document.getElementById('conj-es').innerText = `Traducción: ${verb.es} ${verb.comp}`;
    saveProgress();
}

function checkConj() {
    if (isCheckingAnswer) return; 
    
    // CORRECTION ICI : on cherche 'answer-input' au lieu de 'conj-input'
    let inputField = document.getElementById('answer-input'); 
    
    let ans = inputField.value.trim().toLowerCase().replace(/\s+/g, ' ').replace(/['’´]/g, "'"); 
    if (ans === "") return;
    
    isCheckingAnswer = true; 
    inputField.disabled = true; 
    document.getElementById('conj-btn-check').style.display = 'none'; 
    let fb = document.getElementById('conj-feedback'); 
    fb.style.display = "block";
    
    if (currentConj.answer.some(a => a.toLowerCase().replace(/['’´]/g, "'") === ans)) {
        conjScore++; 
        fb.className = "feedback correct"; 
        fb.innerText = "✅ ¡Perfecto!"; 

        // === ENVIAR PUNTO AL RANKING ===
        sumarPuntoRanking(); 
        // ===============================

        setTimeout(generateConjQuestion, 1000);
    } else {
        quizMistakes.push({ pronoun: currentConj.displayPronoun, verb: currentConj.verb.fr, comp: currentConj.verb.comp, expected: currentConj.answer.join(' o '), actual: ans });
        fb.className = "feedback wrong"; 
        fb.innerHTML = `❌ Error. La respuesta correcta es: <br><strong style="font-size:1.2em;">${currentConj.answer.join(' o ')}</strong>`;
        document.getElementById('conj-btn-next').style.display = 'block';
    }
}
function advanceConj() { generateConjQuestion(); }

// =========================================================
// --- FIN DEL TEST DE CONJUGACIÓN ---
// =========================================================
function endConjQuiz() {
    localStorage.removeItem('conjSaveState'); 
    document.getElementById('conj-play').style.display = 'none'; 
    document.getElementById('conj-results').style.display = 'block';
    
    let percentage = Math.round((conjScore / conjMaxQuestions) * 100); 
    let scoreDisplay = document.getElementById('conj-score-display');
    scoreDisplay.innerText = `${conjScore} / ${conjMaxQuestions} (${percentage}%)`;
    
    // --- 🏆 SISTEMA DE BADGES ---
    if (percentage >= 80) {
        let tenseSelect = document.getElementById('conj-tense-select');
        let currentTense = tenseSelect ? tenseSelect.options[tenseSelect.selectedIndex].text : "Verbos";
        
        let durationMs = Date.now() - (window.conjStartTime || Date.now());
        let mins = Math.floor(durationMs / 60000);
        let secs = Math.floor((durationMs % 60000) / 1000);
        let timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

        awardBadge(conjMaxQuestions.toString(), currentTense, timeStr);
    }
    
    // Mensaje según puntuación
    if(percentage >= 80) { 
        scoreDisplay.style.color = "var(--fr-blue)"; 
        scoreDisplay.innerHTML += "<br>¡Bravo, es excelente! 🏆"; 
    } 
    else if (percentage >= 50) { 
        scoreDisplay.style.color = "#f39c12"; 
        scoreDisplay.innerHTML += "<br>¡Vas por buen camino! 👍"; 
    } 
    else { 
        scoreDisplay.style.color = "var(--fr-red)"; 
        scoreDisplay.innerHTML += "<br>¡Un poco más de práctica! 💪"; 
    }
    
    // Mostrar errores
    let mistakesDisplay = document.getElementById('conj-mistakes-display');
    if (quizMistakes.length > 0) {
        let html = `<h4 style="text-align: left; color: var(--fr-red);">📝 Resumen de errores:</h4><div class="mistakes-container">`;
        quizMistakes.forEach((m, i) => {
            html += `<div class="mistake-item">
                <strong>${i+1}. ${m.pronoun} ___ (${m.verb}) 
                <span style="color:#7f8c8d; font-weight:normal;">${m.comp}</span></strong><br>
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
    document.getElementById('btn-continue-conj').style.display = 'none'; 
}
