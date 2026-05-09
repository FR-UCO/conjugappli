// Al inicio del archivo
const G_SHEETS_URL = "https://script.google.com/macros/s/AKfycbz4akXg7EPytPwD7EsQJVOwJakbSk9k8sxpdhpwMHmcGZnFsZIZyP6o8qxzf7iPOLyG/exec";

// Comprobar registro al cargar la página
window.onload = function() {
    const user = JSON.parse(localStorage.getItem('app_user'));
    if (!user) {
        document.getElementById('welcome-screen').style.display = 'flex';
    } else {
        console.log("Usuario activo:", user.nombre, user.id);
    }
};

function registerUser() {
    const nameInput = document.getElementById('reg-username').value.trim();
    if (nameInput.length < 2) {
        alert("Por favor, introduce un nombre válido");
        return;
    }

    // Generar código único (ej: ID-123456)
    const uniqueId = "ID-" + Math.floor(Math.random() * 1000000);
    
    const userData = {
        nombre: nameInput,
        id: uniqueId,
        fechaRegistro: new Date().toLocaleDateString()
    };

    localStorage.setItem('app_user', JSON.stringify(userData));
    document.getElementById('welcome-screen').style.display = 'none';
}
// --- BASE DE DONNÉES ÉTENDUE : 100 VERBES ---
const verbs = [
    { fr: "parler", es: "hablar", icon: "🗣️", group: "er", aux: "avoir", pp: "parlé", comp: "français" },
    { fr: "manger", es: "comer", icon: "🍝", group: "er", aux: "avoir", pp: "mangé", comp: "une pizza" },
    { fr: "regarder", es: "mirar", icon: "👀", group: "er", aux: "avoir", pp: "regardé", comp: "un film" },
    { fr: "écouter", es: "escuchar", icon: "🎧", group: "er", aux: "avoir", pp: "écouté", comp: "de la musique" },
    { fr: "travailler", es: "trabajar", icon: "💼", group: "er", aux: "avoir", pp: "travaillé", comp: "au bureau" },
    { fr: "étudier", es: "estudiar", icon: "📚", group: "er", aux: "avoir", pp: "étudié", comp: "la leçon" },
    { fr: "chanter", es: "cantar", icon: "🎤", group: "er", aux: "avoir", pp: "chanté", comp: "une belle chanson" },
    { fr: "danser", es: "bailar", icon: "💃", group: "er", aux: "avoir", pp: "dansé", comp: "toute la nuit" },
    { fr: "acheter", es: "comprar", icon: "🛍️", group: "er", aux: "avoir", pp: "acheté", irreg: true, comp: "du pain" },
    { fr: "payer", es: "pagar", icon: "💳", group: "er", aux: "avoir", pp: "payé", irreg: true, comp: "l'addition" },
    { fr: "chercher", es: "buscar", icon: "🔍", group: "er", aux: "avoir", pp: "cherché", comp: "les clés" },
    { fr: "trouver", es: "encontrar", icon: "🎯", group: "er", aux: "avoir", pp: "trouvé", comp: "la solution" },
    { fr: "penser", es: "pensar", icon: "🤔", group: "er", aux: "avoir", pp: "pensé", comp: "à l'avenir" },
    { fr: "appeler", es: "llamar", icon: "📱", group: "er", aux: "avoir", pp: "appelé", irreg: true, comp: "un ami" },
    { fr: "aimer", es: "amar", icon: "❤️", group: "er", aux: "avoir", pp: "aimé", comp: "le chocolat" },
    { fr: "marcher", es: "caminar", icon: "🚶‍♂️", group: "er", aux: "avoir", pp: "marché", comp: "dans le parc" },
    { fr: "cuisiner", es: "cocinar", icon: "🍳", group: "er", aux: "avoir", pp: "cuisiné", comp: "un bon repas" },
    { fr: "voyager", es: "viajar", icon: "✈️", group: "er", aux: "avoir", pp: "voyagé", comp: "en train" },
    { fr: "arriver", es: "llegar", icon: "🏁", group: "er", aux: "etre", pp: "arrivé", comp: "en retard" },
    { fr: "jouer", es: "jugar", icon: "⚽", group: "er", aux: "avoir", pp: "joué", comp: "au football" },

    { fr: "finir", es: "terminar", icon: "✅", group: "ir", aux: "avoir", pp: "fini", comp: "les devoirs" },
    { fr: "choisir", es: "elegir", icon: "👉", group: "ir", aux: "avoir", pp: "choisi", comp: "un livre" },
    { fr: "réussir", es: "lograr", icon: "🎓", group: "ir", aux: "avoir", pp: "réussi", comp: "l'examen" },
    { fr: "grandir", es: "crecer", icon: "🌱", group: "ir", aux: "avoir", pp: "grandi", comp: "très vite" },
    { fr: "dormir", es: "dormir", icon: "🛌", group: "ir3", aux: "avoir", pp: "dormi", irreg: true, comp: "profondément" },
    { fr: "partir", es: "irse", icon: "🚂", group: "ir3", aux: "etre", pp: "parti", irreg: true, comp: "en vacances" },
    { fr: "sortir", es: "salir", icon: "🚪", group: "ir3", aux: "etre", pp: "sorti", irreg: true, comp: "avec des amis" },
    { fr: "sentir", es: "sentir", icon: "👃", group: "ir3", aux: "avoir", pp: "senti", irreg: true, comp: "les fleurs" },
    { fr: "ouvrir", es: "abrir", icon: "🔓", group: "ir3", aux: "avoir", pp: "ouvert", irreg: true, comp: "la porte" },
    { fr: "offrir", es: "ofrecer", icon: "🎁", group: "ir3", aux: "avoir", pp: "offert", irreg: true, comp: "un cadeau" },

    { fr: "vendre", es: "vender", icon: "🏪", group: "re", aux: "avoir", pp: "vendu", comp: "la voiture" },
    { fr: "attendre", es: "esperar", icon: "⏳", group: "re", aux: "avoir", pp: "attendu", comp: "le bus" },
    { fr: "répondre", es: "responder", icon: "💬", group: "re", aux: "avoir", pp: "répondu", comp: "au teléfono" },
    { fr: "entendre", es: "escuchar", icon: "👂", group: "re", aux: "avoir", pp: "entendu", comp: "un bruit" },
    { fr: "perdre", es: "perder", icon: "📉", group: "re", aux: "avoir", pp: "perdu", comp: "le match" },
    { fr: "lire", es: "leer", icon: "📖", group: "re", aux: "avoir", pp: "lu", irreg: true, comp: "un roman" },
    { fr: "écrire", es: "escribir", icon: "✍️", group: "re", aux: "avoir", pp: "écrit", irreg: true, comp: "une lettre" },
    { fr: "prendre", es: "tomar", icon: "🖐️", group: "re", aux: "avoir", pp: "pris", irreg: true, comp: "le métro" },
    { fr: "mettre", es: "poner", icon: "📥", group: "re", aux: "avoir", pp: "mis", irreg: true, comp: "le manteau" },
    { fr: "comprendre", es: "entender", icon: "💡", group: "re", aux: "avoir", pp: "compris", irreg: true, comp: "la question" },
    { fr: "connaître", es: "conocer", icon: "🤝", group: "re", aux: "avoir", pp: "connu", irreg: true, comp: "la vérité" },
    { fr: "croire", es: "creer", icon: "🙏", group: "re", aux: "avoir", pp: "cru", irreg: true, comp: "aux fantômes" },
    { fr: "voir", es: "ver", icon: "👁️", group: "oir", aux: "avoir", pp: "vu", irreg: true, comp: "un oiseau" },
    { fr: "pouvoir", es: "poder", icon: "💪", group: "oir", aux: "avoir", pp: "pu", irreg: true, comp: "le faire" },
    { fr: "vouloir", es: "querer", icon: "🎯", group: "oir", aux: "avoir", pp: "voulu", irreg: true, comp: "un café" },
    { fr: "devoir", es: "deber", icon: "⚠️", group: "oir", aux: "avoir", pp: "dû", irreg: true, comp: "partir tôt" },
    { fr: "être", es: "ser/estar", icon: "🌟", aux: "avoir", pp: "été", irreg: true, comp: "heureux" },
    { fr: "avoir", es: "tener/haber", icon: "🤲", aux: "avoir", pp: "eu", irreg: true, comp: "un chat" },
    { fr: "aller", es: "ir", icon: "🗺️", aux: "etre", pp: "allé", irreg: true, comp: "au cinéma" },
    { fr: "faire", es: "hacer", icon: "🛠️", aux: "avoir", pp: "fait", irreg: true, comp: "du sport" },

    { fr: "boire", es: "beber", icon: "🥛", group: "re", aux: "avoir", pp: "bu", irreg: true, comp: "de l'eau" },
    { fr: "savoir", es: "saber", icon: "🧠", group: "oir", aux: "avoir", pp: "su", irreg: true, comp: "la respuesta" },
    { fr: "venir", es: "venir", icon: "🚶", group: "ir3", aux: "etre", pp: "venu", irreg: true, comp: "ici" },
    { fr: "courir", es: "correr", icon: "🏃", group: "ir3", aux: "avoir", pp: "couru", irreg: true, comp: "un marathon" },
    { fr: "rire", es: "reír", icon: "😂", group: "re", aux: "avoir", pp: "ri", irreg: true, comp: "beaucoup" },
    { fr: "conduire", es: "conducir", icon: "🚗", group: "re", aux: "avoir", pp: "conduit", irreg: true, comp: "une voiture" },
    { fr: "recevoir", es: "recibir", icon: "📬", group: "oir", aux: "avoir", pp: "reçu", irreg: true, comp: "un colis" },
    { fr: "descendre", es: "bajar", icon: "⬇️", group: "re", aux: "etre", pp: "descendu", comp: "l'escalier" },
    { fr: "répéter", es: "repetir", icon: "🔁", group: "er", aux: "avoir", pp: "répété", irreg: true, comp: "la phrase" },
    { fr: "nettoyer", es: "limpiar", icon: "🧹", group: "er", aux: "avoir", pp: "nettoyé", irreg: true, comp: "la maison" },

    { fr: "se lever", root: "lever", es: "levantarse", icon: "🛏️", group: "er", aux: "etre", pp: "levé", pron: true, comp: "tôt" },
    { fr: "se laver", root: "laver", es: "lavarse", icon: "🧼", group: "er", aux: "etre", pp: "lavé", pron: true, comp: "les mains" },
    { fr: "se réveiller", root: "réveiller", es: "despertarse", icon: "⏰", group: "er", aux: "etre", pp: "réveillé", pron: true, comp: "à 7h" },
    { fr: "se coucher", root: "coucher", es: "acostarse", icon: "🛌", group: "er", aux: "etre", pp: "couché", pron: true, comp: "tard" },
    { fr: "s'habiller", root: "habiller", es: "vestirse", icon: "👕", group: "er", aux: "etre", pp: "habillé", pron: true, comp: "vite" },
    { fr: "se promener", root: "promener", es: "pasear", icon: "🚶", group: "er", aux: "etre", pp: "promené", pron: true, comp: "au parc" },
    { fr: "se dépêcher", root: "dépêcher", es: "darse prisa", icon: "⏱️", group: "er", aux: "etre", pp: "dépêché", pron: true, comp: "pour le train" },
    { fr: "se souvenir", root: "souvenir", es: "acordarse", icon: "💭", group: "ir3", aux: "etre", pp: "souvenu", pron: true, comp: "de tout" },
    { fr: "tomber", es: "caer", icon: "🍂", group: "er", aux: "etre", pp: "tombé", comp: "par terre" },
    { fr: "monter", es: "subir", icon: "🧗", group: "er", aux: "etre", pp: "monté", comp: "l'escalier" },
    { fr: "rester", es: "quedarse", icon: "🏠", group: "er", aux: "etre", pp: "resté", comp: "à la maison" },
    { fr: "rentrer", es: "volver/entrar", icon: "🔙", group: "er", aux: "etre", pp: "rentré", comp: "chez moi" },
    { fr: "retourner", es: "regresar", icon: "🔄", group: "er", aux: "etre", pp: "retourné", comp: "en France" },
    { fr: "oublier", es: "olvidar", icon: "🧠", group: "er", aux: "avoir", pp: "oublié", comp: "son mot de passe" },
    { fr: "espérer", es: "esperar", icon: "🤞", group: "er", aux: "avoir", pp: "espéré", irreg: true, comp: "un miracle" },
    { fr: "envoyer", es: "enviar", icon: "📧", group: "er", aux: "avoir", pp: "envoyé", irreg: true, comp: "un message" },
    { fr: "essayer", es: "intentar", icon: "🎯", group: "er", aux: "avoir", pp: "essayé", irreg: true, comp: "de comprendre" },
    { fr: "vivre", es: "vivir", icon: "❤️", group: "re", aux: "avoir", pp: "vécu", irreg: true, comp: "en paix" },
    { fr: "mourir", es: "morir", icon: "🥀", group: "ir3", aux: "etre", pp: "mort", irreg: true, comp: "de rire" },
    { fr: "naître", es: "nacer", icon: "👶", group: "re", aux: "etre", pp: "né", irreg: true, comp: "en 2000" },

    { fr: "accepter", es: "aceptar", icon: "✅", group: "er", aux: "avoir", pp: "accepté", comp: "l'offre" },
    { fr: "aider", es: "ayudar", icon: "🤝", group: "er", aux: "avoir", pp: "aidé", comp: "un ami" },
    { fr: "annuler", es: "cancelar", icon: "❌", group: "er", aux: "avoir", pp: "annulé", comp: "le vol" },
    { fr: "apporter", es: "traer", icon: "📦", group: "er", aux: "avoir", pp: "apporté", comp: "un dessert" },
    { fr: "cacher", es: "esconder", icon: "🙈", group: "er", aux: "avoir", pp: "caché", comp: "le trésor" },
    { fr: "changer", es: "cambiar", icon: "🔄", group: "er", aux: "avoir", pp: "changé", comp: "d'avis" },
    { fr: "commencer", es: "comenzar", icon: "▶️", group: "er", aux: "avoir", pp: "commencé", comp: "le travail" },
    { fr: "continuer", es: "continuar", icon: "⏩", group: "er", aux: "avoir", pp: "continué", comp: "à marcher" },
    { fr: "couper", es: "cortar", icon: "✂️", group: "er", aux: "avoir", pp: "coupé", comp: "le papier" },
    { fr: "créer", es: "crear", icon: "🎨", group: "er", aux: "avoir", pp: "créé", comp: "un projet" },
    { fr: "demander", es: "preguntar", icon: "🙋", group: "er", aux: "avoir", pp: "demandé", comp: "de l'aide" },
    { fr: "donner", es: "dar", icon: "🎁", group: "er", aux: "avoir", pp: "donné", comp: "un conseil" },
    { fr: "entrer", es: "entrar", icon: "🚪", group: "er", aux: "etre", pp: "entré", comp: "dans la pièce" },
    { fr: "expliquer", es: "explicar", icon: "🏫", group: "er", aux: "avoir", pp: "expliqué", comp: "la leçon" },
    { fr: "fermer", es: "cerrar", icon: "🔒", group: "er", aux: "avoir", pp: "fermé", comp: "la fenêtre" },
    { fr: "gagner", es: "ganar", icon: "🏆", group: "er", aux: "avoir", pp: "gagné", comp: "le concours" },
    { fr: "montrer", es: "mostrar", icon: "🖼️", group: "er", aux: "avoir", pp: "montré", comp: "la photo" },
    { fr: "pleurer", es: "llorar", icon: "😢", group: "er", aux: "avoir", pp: "pleuré", comp: "de joie" },
    { fr: "rencontrer", es: "encontrar(se)", icon: "🫂", group: "er", aux: "avoir", pp: "rencontré", comp: "quelqu'un" },
    { fr: "utiliser", es: "utilizar", icon: "🛠️", group: "er", aux: "avoir", pp: "utilisé", comp: "un outil" }
];

const pronouns = ["Je", "Tu", "Il/Elle", "Nous", "Vous", "Ils/Elles"];
const tenseNamesES = { "present": "Presente de Indicativo", "past": "Passé Composé", "imparfait": "Imperfecto", "futur_proche": "Futuro Próximo", "passe_recent": "Pasado Reciente", "future": "Futuro Simple" };

// LA LIGNE VITALE QUI MANQUAIT EST ICI :
const validVerbsList = verbs;

// TTS AUTOMATIQUE
function speak(text) {
    if ('speechSynthesis' in window) {
        let msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'fr-FR'; 
        window.speechSynthesis.speak(msg);
    }
}

// NAVIGATION
function showGrammar(topicId, btnElement) {
    document.querySelectorAll('.theory-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.gram-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(topicId).classList.add('active');
    btnElement.classList.add('active');
}

function switchTab(tabId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    document.getElementById('btn-' + tabId).classList.add('active');

    // ESTO ES LO QUE ACTUALIZA LA APP:
    if (tabId === 'sec-badges') {
        actualizarTarjetaUsuario(); // Muestra tu ID arriba
        cargarRanking();           // Trae el Top 10 de Google Sheets
    }
}

function actualizarTarjetaUsuario() {
    const user = JSON.parse(localStorage.getItem('app_user'));
    if (user) {
        document.getElementById('display-username').innerText = user.nombre;
        document.getElementById('display-userid').innerText = user.id;
    }
}

// STREAK
function updateStreak() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const lastVisit = localStorage.getItem('lastVisit');
    let streak = parseInt(localStorage.getItem('streak') || "0");

    if (lastVisit) {
        const lastDate = parseInt(lastVisit);
        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) streak++; 
        else if (diffDays > 1) streak = 1; 
    } else streak = 1; 

    localStorage.setItem('streak', streak);
    localStorage.setItem('lastVisit', today);
    document.getElementById('streak-count').innerText = streak;
}

// =========================================
// VARIABLES GLOBALES (Asegúrate de que no estén repetidas en otro lado)
// =========================================
let swipeIndex = 0;
let isAudioEnabled = true; 

// =========================================
// FUNCIONES DE LAS TARJETAS
// =========================================
function createCardHTML(v, isLarge = false) {
    let irregClass = (v.group !== 'er' || v.irreg || v.pron) ? 'irregular-border' : '';
    let safeFr = v.fr.replace(/'/g, "\\'");
    let safeEs = v.es.replace(/'/g, "\\'");
    
    const baseClass = isLarge ? 'flashcard' : 'flashcard-mini';
    const frontClass = isLarge ? 'flashcard-front' : 'flashcard-mini-front';
    const backClass = isLarge ? 'flashcard-back' : 'flashcard-mini-back';
    
    // Solo le agregamos el audio al onclick si NO es la tarjeta grande (Swipe)
    const audioScript = !isLarge ? `if(isAudioEnabled) speak('${safeFr}');` : '';
    
    return `
    <div class="${isLarge ? 'flashcard-container' : 'flashcard-mini-container'}">
        <div class="${baseClass} ${irregClass}" onclick="this.classList.toggle('flipped'); ${audioScript}">
            <div class="${frontClass}">
                <div class="icon">${v.icon}</div>
                <div class="fr">${v.fr}</div>
            </div>
            <div class="${backClass}">
                <div class="es">${v.es}</div>
            </div>
        </div>
    </div>`;
}

function renderSwipeCard() {
    document.getElementById('swipe-counter').innerText = `Carta ${swipeIndex + 1} / ${verbs.length}`;
    document.getElementById('swipe-card-container').innerHTML = createCardHTML(verbs[swipeIndex], true);
    
    // Suena al pasar de tarjeta (si el audio está activado)
    setTimeout(() => { 
        if (isAudioEnabled) speak(verbs[swipeIndex].fr); 
    }, 150); 
}

function prevSwipe() { if(swipeIndex > 0) { swipeIndex--; renderSwipeCard(); } }
function nextSwipe() { if(swipeIndex < verbs.length - 1) { swipeIndex++; renderSwipeCard(); } }

function flipSwipe() { 
    const card = document.querySelector('#swipe-card-container .flashcard');
    if(card) { 
        card.classList.toggle('flipped'); 
    } 
}

function renderSwipeCard() {
    document.getElementById('swipe-counter').innerText = `Carta ${swipeIndex + 1} / ${verbs.length}`;
    document.getElementById('swipe-card-container').innerHTML = createCardHTML(verbs[swipeIndex], true);
    
    // Suena al pasar de tarjeta (si el audio está activado)
    setTimeout(() => { 
        if (isAudioEnabled) speak(verbs[swipeIndex].fr); 
    }, 150); 
}

function prevSwipe() { if(swipeIndex > 0) { swipeIndex--; renderSwipeCard(); } }
function nextSwipe() { if(swipeIndex < verbs.length - 1) { swipeIndex++; renderSwipeCard(); } }

function flipSwipe() { 
    const card = document.querySelector('#swipe-card-container .flashcard');
    if(card) { 
        card.classList.toggle('flipped'); 
    } 
}
function renderSwipeCard() {
    document.getElementById('swipe-counter').innerText = `Carta ${swipeIndex + 1} / ${verbs.length}`;
    document.getElementById('swipe-card-container').innerHTML = createCardHTML(verbs[swipeIndex], true);
    
    // Suena al pasar de tarjeta (si el audio está activado)
    setTimeout(() => { 
        if (isAudioEnabled) speak(verbs[swipeIndex].fr); 
    }, 150); 
}

function prevSwipe() { if(swipeIndex > 0) { swipeIndex--; renderSwipeCard(); } }
function nextSwipe() { if(swipeIndex < verbs.length - 1) { swipeIndex++; renderSwipeCard(); } }

function flipSwipe() { 
    const card = document.querySelector('#swipe-card-container .flashcard');
    if(card) { 
        card.classList.toggle('flipped'); 
    } 
}

document.getElementById('swipe-card-container').addEventListener('touchstart', e => {
    swipeTouchStartX = e.changedTouches[0].screenX;
    swipeTouchStartY = e.changedTouches[0].screenY;
});

document.getElementById('swipe-card-container').addEventListener('touchend', e => {
    let diffX = e.changedTouches[0].screenX - swipeTouchStartX;
    let diffY = e.changedTouches[0].screenY - swipeTouchStartY;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 40) { if (diffX > 0) prevSwipe(); else nextSwipe(); }
    } else {
        if (Math.abs(diffY) > 40) flipSwipe();
    }
});
document.getElementById('swipe-card-container').addEventListener('touchend', e => {
    let diffX = e.changedTouches[0].screenX - swipeTouchStartX;
    let diffY = e.changedTouches[0].screenY - swipeTouchStartY;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 40) { if (diffX > 0) prevSwipe(); else nextSwipe(); }
    } else {
        if (Math.abs(diffY) > 40) flipSwipe();
    }
});

// MEJORA #2: Función para el botón que apaga/enciende el audio
function toggleAudio() {
    isAudioEnabled = !isAudioEnabled;
    const icon = document.getElementById('audio-icon');
    if (icon) {
        icon.innerText = isAudioEnabled ? 'volume_up' : 'volume_off';
    }
    localStorage.setItem('pref_audio', isAudioEnabled); // Guarda la preferencia del usuario
}


// -------------------------------------------------------------------
// VOCABULAIRE
// -------------------------------------------------------------------
let vocabScore = 0; let vocabMaxQuestions = 10; let vocabCurrentQuestion = 0; let vocabBag = []; let vocabMistakes = []; let currentVocabObj = null; let isCheckingVocab = false;

function startVocabQuiz() {
    vocabMaxQuestions = parseInt(document.getElementById('vocab-qty-select').value);
    vocabScore = 0; vocabCurrentQuestion = 0; vocabMistakes = [];
    vocabBag = [...verbs].sort(() => Math.random() - 0.5).slice(0, vocabMaxQuestions); 
    document.getElementById('vocab-setup').style.display = 'none'; document.getElementById('vocab-results').style.display = 'none'; document.getElementById('vocab-play').style.display = 'block';
    generateVocabQuestion();
}

function generateVocabQuestion() {
    if (vocabCurrentQuestion >= vocabMaxQuestions) { endVocabQuiz(); return; }
    isCheckingVocab = false; vocabCurrentQuestion++;
    document.getElementById('vocab-progress').innerText = `Palabra ${vocabCurrentQuestion} / ${vocabMaxQuestions}`;
    document.getElementById('vocab-progress-bar').style.width = ((vocabCurrentQuestion / vocabMaxQuestions) * 100) + "%";
    document.getElementById('vocab-btn-check').style.display = 'block'; document.getElementById('vocab-btn-next').style.display = 'none'; document.getElementById('vocab-feedback').style.display = "none";
    
    currentVocabObj = vocabBag.pop();
    document.getElementById('vocab-icon').innerText = currentVocabObj.icon; document.getElementById('vocab-es').innerText = currentVocabObj.es;
    
    let inputField = document.getElementById('vocab-input'); inputField.disabled = false; inputField.value = ""; inputField.focus();
}

function checkVocab() {
    if (isCheckingVocab) return;
    let inputField = document.getElementById('vocab-input');
    let ans = inputField.value.trim().toLowerCase().replace(/\s+/g, ' ').replace(/['’´]/g, "'");
    if (ans === "") return;
    
    isCheckingVocab = true; inputField.disabled = true;
    document.getElementById('vocab-btn-check').style.display = 'none';
    let fb = document.getElementById('vocab-feedback'); fb.style.display = "block";
    
    let correctAns = currentVocabObj.fr.toLowerCase().replace(/['’´]/g, "'");
    if (ans === correctAns) {
        vocabScore++; 
        fb.className = "feedback correct"; 
        fb.innerText = "✅ ¡Correcto!";
        
        // === ENVIAR PUNTO AL RANKING ===
        sumarPuntoRanking(); 
        // ===============================

        speak(currentVocabObj.fr); 
        setTimeout(generateVocabQuestion, 1000);
    } else {
        vocabMistakes.push({ es: currentVocabObj.es, fr: currentVocabObj.fr, actual: ans });
        fb.className = "feedback wrong"; fb.innerText = `❌ No, era: ${currentVocabObj.fr}`;
        document.getElementById('vocab-btn-next').style.display = 'block';
    }
}
function advanceVocab() { generateVocabQuestion(); }

function endVocabQuiz() {
    document.getElementById('vocab-play').style.display = 'none'; document.getElementById('vocab-results').style.display = 'block';
    let percentage = Math.round((vocabScore / vocabMaxQuestions) * 100); let scoreDisplay = document.getElementById('vocab-score-display');
    scoreDisplay.innerText = `${vocabScore} / ${vocabMaxQuestions} (${percentage}%)`;
    if(percentage >= 80) scoreDisplay.style.color = "var(--fr-blue)"; else if (percentage >= 50) scoreDisplay.style.color = "#f39c12"; else scoreDisplay.style.color = "var(--fr-red)";
    let mistakesDisplay = document.getElementById('vocab-mistakes-display');
    if (vocabMistakes.length > 0) {
        let mistakesHTML = `<h4 style="text-align: left; color: var(--fr-red);">📝 Resumen de errores:</h4><div class="mistakes-container">`;
        vocabMistakes.forEach((m, i) => { mistakesHTML += `<div class="mistake-item"><strong>${i+1}. ${m.es}</strong><br><span style="color:#721c24;">❌ Escribiste: ${m.actual}</span><br><span style="color:#155724;">✅ Correcto: <strong>${m.fr}</strong></span></div>`; });
        mistakesDisplay.innerHTML = mistakesHTML + "</div>"; mistakesDisplay.style.display = 'block';
    } else mistakesDisplay.style.display = 'none';
}
function resetVocabQuiz() { document.getElementById('vocab-setup').style.display = 'block'; document.getElementById('vocab-results').style.display = 'none'; }

function filterPP() {
    let input = document.getElementById("search-pp"); let filter = input.value.toLowerCase();
    let table = document.getElementById("table-pp"); let tr = table.getElementsByTagName("tr");
    for (let i = 1; i < tr.length; i++) {
        let tdFr = tr[i].getElementsByTagName("td")[0]; let tdEs = tr[i].getElementsByTagName("td")[2]; 
        if (tdFr || tdEs) {
            let txtValueFr = tdFr.textContent || tdFr.innerText; let txtValueEs = tdEs.textContent || tdEs.innerText;
            if (txtValueFr.toLowerCase().indexOf(filter) > -1 || txtValueEs.toLowerCase().indexOf(filter) > -1) tr[i].style.display = ""; else tr[i].style.display = "none";
        }       
    }
}

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

// ====================== EVENTS & THEME ======================
document.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        if (document.getElementById('sec-vocab').classList.contains('active')) {
            let playArea = document.getElementById('vocab-play');
            if(playArea.style.display === 'block') { 
                if (!isCheckingVocab) checkVocab(); 
                else if (document.getElementById('vocab-btn-next').style.display === 'block') advanceVocab(); 
            }
        }
        else if (document.getElementById('sec-conj').classList.contains('active')) {
            let playArea = document.getElementById('conj-play');
            if (playArea.style.display === 'block') { 
                if (!isCheckingAnswer) checkConj(); 
                else if (document.getElementById('conj-btn-next').style.display === 'block') advanceConj(); 
            }
        }
    }
});

function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    
    if (icon) {
        icon.innerText = isDark ? 'light_mode' : 'dark_mode';
    }
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ====================== INIT ======================
window.addEventListener('DOMContentLoaded', () => {
    updateStreak();

    // Lógica de Tema (Modo Oscuro)
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.innerText = 'light_mode';
        }
    }
   
   // Asegúrate de que esto esté dentro de tu window.onload o DOMContentLoaded
    
    // =================================================================
    // MEJORAS #2 y #5: CARGAR PREFERENCIAS Y PARTIDA GUARDADA
    // =================================================================
    const user = JSON.parse(localStorage.getItem('app_user'));
    
    // Recuperar si el audio estaba activado o desactivado
    const savedAudio = localStorage.getItem('pref_audio');
    if (savedAudio !== null) {
        isAudioEnabled = savedAudio === 'true'; // Convierte el string guardado a booleano
        const icon = document.getElementById('audio-icon');
        if (icon) icon.innerText = isAudioEnabled ? 'volume_up' : 'volume_off';
    }

    if (!user) {
        // Usuario nuevo: Mostrar pantalla de registro/bienvenida
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) welcomeScreen.style.display = 'flex';
    } else {
        // Usuario recurrente: Preguntar si quiere continuar
        const continuar = confirm(`¡Bienvenido de nuevo, ${user.nombre}! 🇫🇷\n\n¿Deseas continuar con tu progreso anterior?\n(Si cancelas, se reiniciarán tus estadísticas locales).`);
        
        if (!continuar) {
            localStorage.removeItem('app_stats'); // Borra las estadísticas (rachas, tests, etc.)
            alert("Partida reiniciada. ¡Mucho éxito en esta nueva ronda!");
        }
    }
    // =================================================================

    // Carga de Flashcards en el Grid (TU CÓDIGO)
    let html = "";
    if (typeof verbs !== 'undefined' && verbs.length > 0) {
        verbs.forEach(v => {
            html += createCardHTML(v, false); // false = mini (¡Ya incluye el giro y el audio!)
        });
        const grid = document.getElementById('flashcards-grid');
        if (grid) grid.innerHTML = html;
    }

    // Inicialización de componentes (TU CÓDIGO)
    if (typeof renderSwipeCard === 'function') renderSwipeCard();
    if (typeof renderBadges === 'function') renderBadges();
    
    // MEJORA #4: Añadimos la carga del ranking al iniciar la app
    if (typeof cargarRanking === 'function') cargarRanking(); 
});
// ====================== BADGES ======================
function awardBadge(count, tense, time) {
    let earnedBadges = JSON.parse(localStorage.getItem('badges')) || [];
    let badgeId = `${count} ${tense}`;
    
    let alreadyHasIt = earnedBadges.some(badge => (badge.id === badgeId || badge === badgeId));
    
    if (!alreadyHasIt) {
        let studentName = localStorage.getItem('studentName');
        if (!studentName) {
            studentName = prompt("¡Felicidades! ¿Cómo te llamas?");
            if (!studentName) studentName = "Estudiante";
            localStorage.setItem('studentName', studentName);
        }

        let today = new Date().toLocaleDateString('es-ES');
        
        earnedBadges.push({ 
            id: badgeId, 
            date: today, 
            name: studentName,
            duration: time 
        });
        
        localStorage.setItem('badges', JSON.stringify(earnedBadges));
        alert(`🎉 ¡INCREÍBLE ${studentName.toUpperCase()}! Has ganado la insignia: ${badgeId}`);
        renderBadges(); 
    }
}

function renderBadges() {
    let earnedBadges = JSON.parse(localStorage.getItem('badges')) || [];
    let badgeContainer = document.getElementById('badges-grid');
    
    if (!badgeContainer) return;

    if (earnedBadges.length === 0) {
        badgeContainer.innerHTML = "<p style='grid-column: span 2; text-align:center;'>Aún no tienes insignias. 💪</p>";
        return;
    }

    let html = "";
    earnedBadges.forEach(badge => {
        let name = badge.name || "Estudiante";
        let title = badge.id || badge;
        let date = badge.date || "Hoy";
        let time = badge.duration || "--";
        
        html += `
        <div class="badge-card">
            <div style="font-size: 0.7rem; opacity: 0.7; margin-bottom: -5px;">${name}</div>
            <span class="material-symbols-outlined" style="font-size: 40px; color: #FFD700; font-variation-settings: 'FILL' 1;">award_star</span>
            <div class="badge-title">${title}</div>
            <div class="badge-date">📅 ${date}</div>
            <div style="font-size: 0.75rem; color: #0055A4; font-weight: bold; margin-top: 2px;">⏱️ ${time}</div>
        </div>`; 
    });
    badgeContainer.innerHTML = html;
}

function resetBadges() {
    if(confirm("⚠️ ¿Estás seguro de que quieres borrar todos tus trofeos?")) {
        localStorage.removeItem('badges');
        localStorage.removeItem('studentName');
        renderBadges();
    }
}

// ====================== RANKING ======================
async function sumarPuntoRanking() {
    const user = JSON.parse(localStorage.getItem('app_user'));
    if (!user) return;

    fetch(G_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors', 
        body: JSON.stringify({
            nombre: user.nombre,
            id: user.id,
            puntos: 1
        })
    });
}

async function cargarRanking() {
    const lista = document.getElementById('lista-ranking');
    if (!lista) return;

    lista.innerHTML = "<li style='text-align:center; padding:10px; color:#95a5a6;'>Actualizando ranking global...</li>";

    try {
        const response = await fetch(G_SHEETS_URL);
        const datos = await response.json(); 

        if (!datos || datos.length === 0) {
            lista.innerHTML = "<li style='text-align:center; padding:10px;'>Aún no hay puntuaciones.</li>";
            return;
        }

        let html = "";
        datos.forEach((jugador, index) => {
            let icono = "";
            if (index === 0) icono = "🥇";
            else if (index === 1) icono = "🥈";
            else if (index === 2) icono = "🥉";
            else icono = `<span style="color:#95a5a6;">${index + 1}</span>`;

            html += `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-app); border-radius: 12px; margin-bottom: 8px;">
                    <span>${icono} <strong>${jugador[1]}</strong></span>
                    <span style="color: #0055A4; font-weight: bold;">${jugador[2]} pts</span>
                </li>`;
        });
        lista.innerHTML = html;
    } catch (error) {
        console.error("Error al leer ranking:", error);
        lista.innerHTML = "<li style='text-align:center; padding:10px; color:red;'>No se pudo cargar el ranking.</li>";
    }
}
