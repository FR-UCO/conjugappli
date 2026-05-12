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
    } // <-- Aquí termina el bloque del Modo Oscuro
    
    // Cargar la teoría dinámicamente (Independiente del modo oscuro)
    if (typeof cargarTeoria === 'function') cargarTeoria();

    // ... (Aquí continúa el resto del código que ya tenías dentro del DOMContentLoaded, 
    // como cargar las tarjetas, inicializar el ranking, etc.) ...
}); // <-- Aquí termina todo el evento DOMContentLoaded
   // Asegúrate de que esto esté dentro de tu window.onload o DOMContentLoaded
    
   // =================================================================
    // CARGAR PREFERENCIAS (AUDIO, TEMA) Y PARTIDA GUARDADA
    // =================================================================
    const user = JSON.parse(localStorage.getItem('app_user'));
    
    // 1. Recuperar preferencia de Audio
    const savedAudio = localStorage.getItem('pref_audio');
    if (savedAudio !== null) {
        isAudioEnabled = savedAudio === 'true';
        const icon = document.getElementById('audio-icon');
        if (icon) icon.innerText = isAudioEnabled ? 'volume_up' : 'volume_off';
    }

    // 2. Recuperar preferencia de Modo Oscuro
    const savedTheme = localStorage.getItem('pref_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        // Opcional: si tienes un ícono para el botón del sol/luna, actualízalo aquí
        // document.getElementById('theme-icon').innerText = 'light_mode'; 
    }

    // 3. Manejo de Usuario (Silencioso)
    if (!user) {
        // Usuario nuevo: Mostrar pantalla de registro/bienvenida
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) welcomeScreen.style.display = 'flex';
    } else {
        // Usuario recurrente: Retomamos la partida silenciosamente.
        console.log(`¡Bienvenido de nuevo, ${user.nombre}! Progreso cargado.`);
    }

    // 4. (Opcional) Cargar la última pestaña si implementaste el paso de mi mensaje anterior
    const pestanaGuardada = localStorage.getItem('ultimaPestana') || 'sec-flashcards';
    if (typeof switchTab === 'function') switchTab(pestanaGuardada);

    // Carga de Flashcards en el Grid (TU CÓDIGO)
    let html = "";
    if (typeof verbs !== 'undefined' && verbs.length > 0) {
        verbs.forEach(v => {
            html += createCardHTML(v, false); // false = mini (¡Ya incluye el giro y el audio!)
        });
        const grid = document.getElementById('flashcards-grid');
        if (grid) grid.innerHTML = html;
    }
    // ====================== INICIALIZACIÓN ======================
if (typeof renderSwipeCard === 'function') renderSwipeCard();
if (typeof renderBadges === 'function') renderBadges();

// MEJORA #4: Cargar ranking al iniciar la app
if (typeof cargarRanking === 'function') cargarRanking();

// ====================== BADGES ======================
function awardBadge(count, tense, time) {
    let earnedBadges = JSON.parse(localStorage.getItem('badges') || '[]');
    
    // Mejor ID de insignia (incluye el tiempo)
    let badgeId = `${count} ${tense}` + (time ? ` - ${time}` : '');

    // Verificar si ya tiene la insignia
    let alreadyHasIt = earnedBadges.some(badge => badge.id === badgeId);

    if (!alreadyHasIt) {
        let studentName = localStorage.getItem('studentName');
        
        if (!studentName) {
            studentName = prompt("¡Felicidades! ¿Cómo te llamas?");
            if (!studentName || studentName.trim() === "") {
                studentName = "Estudiante";
            }
            localStorage.setItem('studentName', studentName);
        }

        const today = new Date().toLocaleDateString('es-ES');

        earnedBadges.push({
            id: badgeId,
            date: today,
            name: studentName,
            duration: time || "--"
        });

        localStorage.setItem('badges', JSON.stringify(earnedBadges));
        
        alert(`🎉 ¡INCREÍBLE ${studentName.toUpperCase()}! Has ganado la insignia:\n${badgeId}`);
        
        // Actualizar visualmente las insignias
        if (typeof renderBadges === 'function') renderBadges();
    }
}

function renderBadges() {
    let earnedBadges = JSON.parse(localStorage.getItem('badges') || '[]');
    const badgeContainer = document.getElementById('badges-grid');
    
    if (!badgeContainer) return;

    if (earnedBadges.length === 0) {
        badgeContainer.innerHTML = `
            <p style='grid-column: span 2; text-align:center; padding: 20px;'>
                Aún no tienes insignias. ¡Sigue practicando! 💪
            </p>`;
        return;
    }

    let html = "";
    earnedBadges.forEach(badge => {
        const name = badge.name || "Estudiante";
        const title = badge.id || badge;
        const date = badge.date || "Hoy";
        const time = badge.duration || "--";

        html += `
        <div class="badge-card">
            <div style="font-size: 0.75rem; opacity: 0.8; margin-bottom: -4px;">${name}</div>
            <span class="material-symbols-outlined" style="font-size: 42px; color: #FFD700; font-variation-settings: 'FILL' 1;">award_star</span>
            <div class="badge-title">${title}</div>
            <div class="badge-date">📅 ${date}</div>
            <div style="font-size: 0.8rem; color: #0055A4; font-weight: bold;">⏱️ ${time}</div>
        </div>`;
    });

    badgeContainer.innerHTML = html;
}

function resetBadges() {
    if (confirm("⚠️ ¿Estás seguro de que quieres borrar todos tus trofeos?")) {
        localStorage.removeItem('badges');
        localStorage.removeItem('studentName');
        if (typeof renderBadges === 'function') renderBadges();
    }
}

// ====================== RANKING ======================
async function sumarPuntoRanking() {
    const user = JSON.parse(localStorage.getItem('app_user'));
    if (!user) return;

    try {
        await fetch(G_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: user.nombre,
                id: user.id,
                puntos: 1
            })
        });
    } catch (e) {
        console.log("Punto enviado (modo no-cors)");
    }
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
            let icono = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `<span style="color:#95a5a6;">${index + 1}</span>`;

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

// ====================== TEST / PARTIDA ======================
// Función única (se eliminó la duplicada)
function continuarPartida() {
    const guardado = localStorage.getItem('progreso_test_vocabulario');
    
    if (guardado) {
        testActual = JSON.parse(guardado);
        testActual.activo = true;

        if (typeof renderizarTest === 'function') {
            renderizarTest();
        }

        // Cambiar vistas
        const setupContainer = document.getElementById('setup-test-container');
        const gameContainer = document.getElementById('game-test-container');
        
        if (setupContainer) setupContainer.style.display = 'none';
        if (gameContainer) gameContainer.style.display = 'block';
    } else {
        alert("No tienes ninguna partida guardada. ¡Inicia una nueva!");
    }
}

function reiniciarProgreso() {
    const seguro = confirm("¿Estás seguro? Se borrará tu avance en el test actual.");
    
    if (seguro) {
        localStorage.removeItem('progreso_test_vocabulario');
        
        testActual = {
            indice: 0,
            preguntas: [],
            puntos: 0,
            activo: false
        };

        const setupContainer = document.getElementById('setup-test-container');
        const gameContainer = document.getElementById('game-test-container');
        
        if (setupContainer) setupContainer.style.display = 'block';
        if (gameContainer) gameContainer.style.display = 'none';

        alert("Partida reiniciada. Configura tu nuevo test.");
    }
}

// Variable global del test
let testActual = {
    indice: 0,
    preguntas: [],
    puntos: 0,
    activo: false
};

function guardarProgresoTest() {
    localStorage.setItem('progreso_test_vocabulario', JSON.stringify(testActual));
}
