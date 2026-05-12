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
   
    document.getElementById(tabId).classList.add('active');
    const btn = document.getElementById('btn-' + tabId);
    if (btn) btn.classList.add('active');

    if (tabId === 'sec-badges') {
        actualizarTarjetaUsuario();
        if (typeof cargarRanking === 'function') cargarRanking();
    }
}

function actualizarTarjetaUsuario() {
    const user = JSON.parse(localStorage.getItem('app_user'));
    if (user) {
        document.getElementById('display-username').innerText = user.nombre || '---';
        document.getElementById('display-userid').innerText = user.id || 'ID-000000';
    }
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
        if (isAudioEnabled && verbs && verbs[swipeIndex]) {
            speak(verbs[swipeIndex].fr);
        }
    }, 150);
}

function prevSwipe() {
    if (swipeIndex > 0) {
        swipeIndex--;
        renderSwipeCard();
    }
}

function nextSwipe() {
    if (verbs && swipeIndex < verbs.length - 1) {
        swipeIndex++;
        renderSwipeCard();
    }
}

function flipSwipe() {
    const card = document.querySelector('#swipe-card-container .flashcard');
    if (card) card.classList.toggle('flipped');
}

// ====================== AUDIO ======================
function toggleAudio() {
    isAudioEnabled = !isAudioEnabled;
    const icon = document.getElementById('audio-icon');
    if (icon) {
        icon.innerText = isAudioEnabled ? 'volume_up' : 'volume_off';
    }
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

    earnedBadges.push({
        id: badgeId,
        date: today,
        name: studentName,
        duration: time || "--"
    });

    localStorage.setItem('badges', JSON.stringify(earnedBadges));
    alert(`🎉 ¡INCREÍBLE ${studentName.toUpperCase()}! Has ganado:\n${badgeId}`);
   
    if (typeof renderBadges === 'function') renderBadges();
    sumarPuntoRanking(3); // +3 puntos por insignia
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
            body: JSON.stringify({
                id: user.id,
                nombre: user.nombre,
                puntos: cantidad
            })
        });
        console.log(`✅ ${cantidad} punto(s) enviado(s) para ${user.nombre}`);
        return true;
    } catch (error) {
        console.warn("No se pudo enviar punto al ranking:", error);
        return false;
    }
}

async function cargarRanking() {
    const lista = document.getElementById('lista-ranking');
    if (!lista) return;

    lista.innerHTML = "<li style='text-align:center;padding:10px;color:#95a5a6;'>Actualizando ranking...</li>";

    try {
        const res = await fetch(G_SHEETS_URL);
        const datos = await res.json();

        if (!datos?.length) {
            lista.innerHTML = "<li style='text-align:center;padding:10px;'>Aún no hay puntuaciones.</li>";
            return;
        }

        let html = "";
        datos.forEach((jugador, i) => {
            const icono = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `<span style="color:#95a5a6;">${i+1}</span>`;
            html += `
            <li style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:var(--bg-app);border-radius:12px;margin-bottom:8px;">
                <span>${icono} <strong>${jugador.nombre || jugador[1]}</strong></span>
                <span style="color:#0055A4;font-weight:bold;">${jugador.puntos || jugador[2]} pts</span>
            </li>`;
        });
        lista.innerHTML = html;
    } catch (e) {
        console.error(e);
        lista.innerHTML = "<li style='text-align:center;color:red;padding:10px;'>Error al cargar ranking</li>";
    }
}

// ====================== INICIALIZACIÓN ======================
window.addEventListener('DOMContentLoaded', () => {
    updateStreak();

    // Tema
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const icon = document.getElementById('theme-icon');
        if (icon) icon.innerText = 'light_mode';
    }

    // Audio
    const savedAudio = localStorage.getItem('pref_audio');
    if (savedAudio !== null) {
        isAudioEnabled = savedAudio === 'true';
        const icon = document.getElementById('audio-icon');
        if (icon) icon.innerText = isAudioEnabled ? 'volume_up' : 'volume_off';
    }

    // Cargar teoría
    if (typeof cargarTeoria === 'function') cargarTeoria();

    // Inicializaciones principales
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
                if (diffX > 0) prevSwipe();
                else nextSwipe();
            } else if (Math.abs(diffY) > 40) {
                flipSwipe();
            }
        });
    }
});
