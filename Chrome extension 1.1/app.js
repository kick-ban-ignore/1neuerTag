// ==========================================
// 1. ZUSTAND & KONSTANTEN (STATE)
// ==========================================
let targetSunrise = null;
let countdownInterval = null;
let isTestingMode = false;

// Standard-Koordinaten (Fallback: Berlin), falls Geolocation abgelehnt wird
const DEFAULT_LAT = 52.5200;
const DEFAULT_LNG = 13.4050;

// DOM-Elemente
const elements = {
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    countdownGrid: document.getElementById('countdown-grid'),
    sunriseAscii: document.getElementById('sunrise-ascii'),
    bgHourglass: document.getElementById('bg-hourglass'),
    stream: document.getElementById('stream'),
    topSandRect: document.getElementById('top-sand-rect'),
    bottomSandRect: document.getElementById('bottom-sand-rect'),
    sidebar: document.getElementById('sidebar'),
    overlay: document.getElementById('overlay'),
    settingsBtn: document.getElementById('settings-btn'),
    closeBtn: document.getElementById('close-btn'),
    fullscreenBtn: document.getElementById('fullscreen-btn'),
    toggleBtn: document.getElementById('toggle-btn')
};

// Max-Höhen der SVG-Sand-Rechtecke aus dem ClipPath im HTML (y-Werte & Heights)
const SAND_LIMITS = {
    topMaxHeight: 55,       // Start-Höhe des oberen Sandes
    bottomMaxHeight: 55,    // Ziel-Höhe des unteren Sandes
    bottomMinY: 75,         // Start-Y-Wert für den unteren Sand (wächst nach oben)
    bottomMaxY: 130         // Boden-Y-Wert
};

// ==========================================
// 2. INITIALISIERUNG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
});

function initApp() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                calculateNextSunrise(position.coords.latitude, position.coords.longitude);
                startCountdown();
            },
            (error) => {
                console.warn("Geolocation abgelehnt oder fehlgeschlagen. Nutze Berlin als Fallback.", error);
                calculateNextSunrise(DEFAULT_LAT, DEFAULT_LNG);
                startCountdown();
            },
            { timeout: 5000 } // Verhindert ewiges Hängen der Extension falls API blockiert
        );
    } else {
        calculateNextSunrise(DEFAULT_LAT, DEFAULT_LNG);
        startCountdown();
    }
}

// ==========================================
// 3. LOGIK & BERECHNUNGEN
// ==========================================
function calculateNextSunrise(lat, lng) {
    const now = new Date();
    let times = SunCalc.getTimes(now, lat, lng);
    
    // Wenn der heutige Sonnenaufgang bereits vorbei ist, berechne den für morgen
    if (times.sunrise <= now) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        times = SunCalc.getTimes(tomorrow, lat, lng);
    }
    
    targetSunrise = times.sunrise;
    
    // Wir speichern die Gesamtdauer von "jetzt" bis zum Aufgang für die Sanduhr-Skalierung
    if (!window.totalDuration || window.totalDuration < 0) {
        window.totalDuration = targetSunrise.getTime() - now.getTime();
    }
}

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    
    // Stream-Animation aktivieren (Sand läuft)
    if (elements.stream) elements.stream.style.display = 'block';
    
    updateCountdown(); 
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    if (isTestingMode) return; 

    const now = new Date();
    const diff = targetSunrise.getTime() - now.getTime();

    if (diff <= 0) {
        handleSunriseTrigger();
        return;
    }

    renderTime(diff);
    updateHourglassVisuals(diff);
}

function renderTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (elements.hours) elements.hours.textContent = String(hrs).padStart(2, '0');
    if (elements.minutes) elements.minutes.textContent = String(mins).padStart(2, '0');
    if (elements.seconds) elements.seconds.textContent = String(secs).padStart(2, '0');
}

function updateHourglassVisuals(timeRemaining) {
    if (!window.totalDuration || !elements.topSandRect || !elements.bottomSandRect) return;

    let progress = Math.max(0, Math.min(1, timeRemaining / window.totalDuration));

    const topHeight = SAND_LIMITS.topMaxHeight * progress;
    const topY = 10 + (SAND_LIMITS.topMaxHeight - topHeight);
    elements.topSandRect.setAttribute('height', topHeight);
    elements.topSandRect.setAttribute('y', topY);

    const bottomHeight = SAND_LIMITS.bottomMaxHeight * (1 - progress);
    const bottomY = SAND_LIMITS.bottomMaxY - bottomHeight;
    elements.bottomSandRect.setAttribute('height', bottomHeight);
    elements.bottomSandRect.setAttribute('y', bottomY);
}

function handleSunriseTrigger() {
    if (countdownInterval) clearInterval(countdownInterval);
    
    if (elements.stream) elements.stream.style.display = 'none';
    if (elements.countdownGrid) elements.countdownGrid.style.display = 'none';
    if (elements.sunriseAscii) elements.sunriseAscii.style.display = 'grid';
    if (elements.bgHourglass) elements.bgHourglass.classList.add('faded');
}

function resetSunriseTrigger() {
    if (elements.countdownGrid) elements.countdownGrid.style.display = 'flex';
    if (elements.sunriseAscii) elements.sunriseAscii.style.display = 'none';
    if (elements.bgHourglass) elements.bgHourglass.classList.remove('faded');
    
    window.totalDuration = null; 
    initApp();
}

// ==========================================
// 4. EVENT LISTENERS & UI INTERAKTION
// ==========================================
function setupEventListeners() {
    if (elements.settingsBtn) elements.settingsBtn.addEventListener('click', openSidebar);
    if (elements.closeBtn) elements.closeBtn.addEventListener('click', closeSidebar);
    if (elements.overlay) elements.overlay.addEventListener('click', closeSidebar);
    if (elements.fullscreenBtn) elements.fullscreenBtn.addEventListener('click', toggleFullscreen);

    if (elements.toggleBtn) {
        elements.toggleBtn.addEventListener('click', () => {
            isTestingMode = !isTestingMode;
            
            if (isTestingMode) {
                handleSunriseTrigger();
                elements.toggleBtn.textContent = "Timer aktivieren ⌛";
            } else {
                resetSunriseTrigger();
                elements.toggleBtn.textContent = "Timer umschalten ☼";
            }
            closeSidebar();
        });
    }
}

function openSidebar() {
    if (elements.sidebar) elements.sidebar.classList.add('open');
    if (elements.overlay) elements.overlay.classList.add('show');
}

function closeSidebar() {
    if (elements.sidebar) elements.sidebar.classList.remove('open');
    if (elements.overlay) elements.overlay.classList.remove('show');
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Fehler beim Aktivieren des Vollbildmodus: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}