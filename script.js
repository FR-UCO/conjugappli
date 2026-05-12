// ====================== CONFIGURACIÓN ======================
const G_SHEETS_URL = "https://script.google.com/macros/s/AKfycbz4akXg7EPytPwD7EsQJVOwJakbSk9k8sxpdhpwMHmcGZnFsZIZyP6o8qxzf7iPOLyG/exec";

// ====================== TTS ======================
function speak(text) {
    if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'fr-FR';
        window.speechSynthesis.speak(msg);
    }
}

// ====================== USUARIO ======================
window.onload = function() {
    const user = JSON.parse(localStorage.getItem('app_user'));
    if (!user) {
        const welcome = document.getElementById('welcome-screen');
        if (welcome) welcome.style.display = 'flex';
    }
};

function registerUser() {
    const nameInput = document.getElementById('reg-username').value.trim();
    if (nameInput.length < 2) {
        alert("Por favor, introduce un nombre válido");
        return;
    }

    const uniqueId = "ID-" + Math.floor(Math.random() * 1000000);
   
    const userData = {
        nombre: nameInput,
        id: uniqueId,
        fechaRegistro: new Date().toLocaleDateString()
    };

    localStorage.setItem('app_user', JSON.stringify(userData));
    document.getElementById('welcome-screen').style.display = 'none';
    console.log("Usuario registrado:", userData);
}

// ====================== NAVEGACIÓN ======================
function showGrammar(topicId, btnElement) {
    document.querySelectorAll('.theory-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.gram-btn').forEach(b => b.classList.remove('active'));
   
    const content = document.getElementById(topicId);
    if (content) content.classList.add('active');
    if (btnElement) btnElement.classList.add('active');
}

function switchTab(tabId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
   
    const section = document.getElementById(tabId);
    if (section) section.classList.add('active');

    const btn = document.getElementById('btn-' + tabId);
    if (btn) btn.classList.add('active');

    if (tabId === 'sec-badges') {
        actualizarTarjetaUsuario();
        if (typeof cargarRanking === 'function') cargarRanking();
    }
}

function actualizarTarjetaUsuario() {
    const user = JSON.parse(localStorage.getItem('app_user'));
    if (!user) return;

    const nameEl = document.getElementById('display-username');
    const idEl = document.getElementById('display-userid');

    if (nameEl) nameEl.innerText = user.nombre || '---';
    if (idEl) idEl.innerText = user.id || 'ID-000000';
}

// ====================== STREAK ======================
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
    } else {
        streak = 1;
    }

    localStorage.setItem('streak', streak);
    localStorage.setItem('lastVisit', today);
    
    const streakEl = document.getElementById('streak-count');
    if (streakEl) streakEl.innerText = streak;
}

// ====================== TARJETAS (FLASHCARDS) ======================
let swipeIndex = 0;
let isAudioEnabled = true;
let swipeTouchStartX = 0;
let swipeTouchStartY = 0;

function createCardHTML(v, isLarge = false) {
    if (!v) return '';
    const irregClass = (v.group !== 'er' || v.irreg || v.pron) ? 'irregular-border' : '';
    const safeFr = v.fr.replace(/'/g, "\\'");
    
    const baseClass = isLarge ? 'flashcard' : 'flashcard-mini';
    const frontClass = isLarge ? 'flashcard-front' : 'flashcard-mini-front';
    const backClass = isLarge ? 'flashcard-back' : 'flashcard-mini-back';
   
    const audioScript = !isLarge ? `if(isAudioEnabled) speak('${safeFr}');` : '';

    return `
    <div class="${isLarge ? 'flashcard-container' : 'flashcard-mini-container'}">
        <div class="${baseClass} ${irregClass}" onclick="this.classList.toggle('flipped'); ${audioScript}">
            <div class="${frontClass}">
                <div class="icon">${v.icon || ''}</div>
                <div class="fr">${v.fr}</div>
            </div>
            <div class="${backClass}">
                <div class="es">${v.es}</div>
            </div>
        </div>
    </div>`;
}

function renderSwipeCard() {
    const counter = document.getElementById('swipe-counter');
    const container = document.getElementById('swipe-card-container');
   
    if (counter) counter.innerText = `Carta ${swipeIndex + 1} / ${verbs ? verbs.length : 0}`;
    if (container && verbs && verbs[swipeIndex]) {
        container.innerHTML = createCardHTML(verbs[swipeIndex], true);
    }

    setTimeout(() => {
        if (isAudioEnabled && verbs && verbs[swipeIndex]) speak(verbs[swipeIndex].fr);
    }, 150);
}

function prevSwipe() { if (swipeIndex > 0) { swipeIndex--; renderSwipeCard(); } }
function nextSwipe() { if (verbs && swipeIndex < verbs.length - 1) { swipeIndex++; renderSwipeCard(); } }
function flipSwipe() {
    const card = document.querySelector('#swipe-card-container .flashcard');
    if (card) card.classList.toggle('flipped');
}

// ====================== AUDIO ======================
function toggleAudio() {
    isAudioEnabled = !isAudioEnabled;
    const icon = document.getElementById('audio-icon');
    if (icon) icon.innerText = isAudioEnabled ? 'volume_up' : 'volume_off';
    localStorage.setItem('pref_audio', isAudioEnabled);
}

// ====================== TEMA ======================
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    if (icon) icon.innerText = isDark ? 'light_mode' : 'dark_mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ====================== BADGES ======================
function awardBadge(count, tense, time) {
    let earnedBadges = JSON.parse(localStorage.getItem('badges') || '[]');
    let badgeId = `${count} ${tense}` + (time ? ` - ${time}` : '');

    if (earnedBadges.some(b => b.id === badgeId)) return;

    let studentName = localStorage.getItem('studentName');
    if (!studentName) {
        studentName = prompt("¡Felicidades! ¿Cómo te llamas?");
        if (!studentName?.trim()) studentName = "Estudiante";
        localStorage.setItem('studentName', studentName);
    }

    const today = new Date().toLocaleDateString('es-ES');

    earnedBadges.push({ id: badgeId, date: today, name: studentName, duration: time || "--" });

    localStorage.setItem('badges', JSON.stringify(earnedBadges));
    alert(`🎉 ¡INCREÍBLE ${studentName.toUpperCase()}! Has ganado:\n${badgeId}`);
   
    if (typeof renderBadges === 'function') renderBadges();
    sumarPuntoRanking(3);
}

function renderBadges() {
    const earnedBadges = JSON.parse(localStorage.getItem('badges') || '[]');
    const container = document.getElementById('badges-grid');
    if (!container) return;

    if (earnedBadges.length === 0) {
        container.innerHTML = `<p style='grid-column: span 2; text-align:center; padding:20px;'>Aún no tienes insignias. ¡Sigue practicando! 💪</p>`;
        return;
    }

    let html = '';
    earnedBadges.forEach(badge => {
        html += `
        <div class="badge-card">
            <div style="font-size:0.75rem;opacity:0.8;">${badge.name || "Estudiante"}</div>
            <span class="material-symbols-outlined" style="font-size:42px;color:#FFD700;font-variation-settings:'FILL' 1;">award_star</span>
            <div class="badge-title">${badge.id}</div>
            <div class="badge-date">📅 ${badge.date}</div>
            <div style="font-size:0.8rem;color:#0055A4;font-weight:bold;">⏱️ ${badge.duration}</div>
        </div>`;
    });
    container.innerHTML = html;
}

function resetBadges() {
    if (confirm("¿Estás seguro de borrar todos tus trofeos?")) {
        localStorage.removeItem('badges');
        localStorage.removeItem('studentName');
        renderBadges();
    }
}

// ====================== RANKING ======================
async function sumarPuntoRanking(cantidad = 1) {
    const user = JSON.parse(localStorage.getItem('app_user'));
    if (!user) return false;

    try {
        await fetch(G_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: user.id, nombre: user.nombre, puntos: cantidad })
        });
        console.log(`✅ ${cantidad} punto(s) enviados`);
    } catch (e) {
        console.warn("Error enviando puntos:", e);
    }
}

async function cargarRanking() {
    const lista = document.getElementById('lista-ranking');
    if (!lista) return;

    lista.innerHTML = "<li style='text-align:center;padding:10px;color:#95a5a6;'>Actualizando ranking...</li>";

    try {
        const res = await fetch(G_SHEETS_URL);
        const datos = await res.json();

        if (!datos || datos.length === 0) {
            lista.innerHTML = "<li style='text-align:center;padding:10px;'>Aún no hay puntuaciones.</li>";
            return;
        }

        let html = "";
        datos.forEach((jugador, i) => {
            const nombre = jugador.nombre || jugador[1] || 'Usuario';
            const puntos = jugador.puntos || jugador[2] || 0;
            const icono = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `<span style="color:#95a5a6;">${i+1}</span>`;

            html += `
            <li style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:var(--bg-app);border-radius:12px;margin-bottom:8px;">
                <span>${icono} <strong>${nombre}</strong></span>
                <span style="color:#0055A4;font-weight:bold;">${puntos} pts</span>
            </li>`;
        });
        lista.innerHTML = html;
    } catch (e) {
        lista.innerHTML = "<li style='text-align:center;color:red;padding:10px;'>Error al cargar ranking</li>";
    }
}

// ====================== TEST - CONTINUAR / REINICIAR ======================
let testActual = {
    indice: 0,
    preguntas: [],
    puntos: 0,
    activo: false
};

function continuarPartida() {
    const guardado = localStorage.getItem('progreso_test_vocabulario');
    if (!guardado) {
        alert("No tienes ninguna partida guardada. ¡Inicia una nueva!");
        return;
    }

    testActual = JSON.parse(guardado);
    testActual.activo = true;

    if (typeof renderizarTest === 'function') renderizarTest();

    // Cambiar vistas (ajusta los IDs según tu HTML)
    const setup = document.getElementById('setup-test-container') || document.getElementById('conj-setup');
    const game = document.getElementById('game-test-container') || document.getElementById('conj-play');

    if (setup) setup.style.display = 'none';
    if (game) game.style.display = 'block';
}

function reiniciarProgreso() {
    if (!confirm("¿Estás seguro? Se borrará tu avance actual.")) return;

    localStorage.removeItem('progreso_test_vocabulario');
    testActual = { indice: 0, preguntas: [], puntos: 0, activo: false };

    const setup = document.getElementById('setup-test-container') || document.getElementById('conj-setup');
    const game = document.getElementById('game-test-container') || document.getElementById('conj-play');

    if (setup) setup.style.display = 'block';
    if (game) game.style.display = 'none';

    alert("Partida reiniciada.");
}

function guardarProgresoTest() {
    localStorage.setItem('progreso_test_vocabulario', JSON.stringify(testActual));
}

// ====================== INICIALIZACIÓN ======================
window.addEventListener('DOMContentLoaded', () => {
    updateStreak();

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const icon = document.getElementById('theme-icon');
        if (icon) icon.innerText = 'light_mode';
    }

    const savedAudio = localStorage.getItem('pref_audio');
    if (savedAudio !== null) {
        isAudioEnabled = savedAudio === 'true';
        const icon = document.getElementById('audio-icon');
        if (icon) icon.innerText = isAudioEnabled ? 'volume_up' : 'volume_off';
    }

    if (typeof cargarTeoria === 'function') cargarTeoria();
    if (typeof renderSwipeCard === 'function') renderSwipeCard();
    if (typeof renderBadges === 'function') renderBadges();
    if (typeof cargarRanking === 'function') cargarRanking();

    // Flashcards grid
    if (typeof verbs !== 'undefined' && verbs.length > 0) {
        let html = "";
        verbs.forEach(v => html += createCardHTML(v, false));
        const grid = document.getElementById('flashcards-grid');
        if (grid) grid.innerHTML = html;
    }

    // Touch swipe
    const swipeContainer = document.getElementById('swipe-card-container');
    if (swipeContainer) {
        swipeContainer.addEventListener('touchstart', e => {
            swipeTouchStartX = e.changedTouches[0].screenX;
            swipeTouchStartY = e.changedTouches[0].screenY;
        });

        swipeContainer.addEventListener('touchend', e => {
            const diffX = e.changedTouches[0].screenX - swipeTouchStartX;
            const diffY = e.changedTouches[0].screenY - swipeTouchStartY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
                diffX > 0 ? prevSwipe() : nextSwipe();
            } else if (Math.abs(diffY) > 40) {
                flipSwipe();
            }
        });
    }

    actualizarTarjetaUsuario();
});
