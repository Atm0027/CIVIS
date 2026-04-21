document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
});

const calendarState = {
    currentDate: new Date(),
    events: [] // Favoritos del usuario con fechas de trámite
};

/**
 * Carga los eventos del calendario desde los favoritos del usuario.
 * Si el usuario está autenticado, usa /api/favorites/calendar.
 * Si no hay sesión, el calendario aparece vacío.
 */
async function loadCalendarEvents() {
    try {
        if (!hasToken()) {
            // Sin sesión: calendario vacío con mensaje informativo
            calendarState.events = [];
            renderCalendar();
            showCalendarGuestMessage();
            return;
        }

        const events = await fetchAPI(CONFIG.api.endpoints.favoritesCalendar);
        calendarState.events = Array.isArray(events) ? events : [];
        renderCalendar();

    } catch (error) {
        console.error('[Calendar] Error cargando eventos de favoritos:', error);
        calendarState.events = [];
        renderCalendar();
    }
}

function showCalendarGuestMessage() {
    const header = document.getElementById('calendar-month-year');
    if (header) {
        const msg = document.createElement('p');
        msg.style.cssText = 'font-size:0.8rem;color:#94a3b8;margin-top:4px;';
        msg.textContent = 'Inicia sesión para ver tus trámites favoritos';
        header.parentNode.insertBefore(msg, header.nextSibling);
    }
}

function initCalendar() {
    loadCalendarEvents();
    renderCalendar();
    setupEventListeners();
}

function setupEventListeners() {
    const prevBtn = document.getElementById('prev-month');
    if (prevBtn) prevBtn.onclick = () => changeMonth(-1);

    const nextBtn = document.getElementById('next-month');
    if (nextBtn) nextBtn.onclick = () => changeMonth(1);

    const todayBtn = document.getElementById('today-btn');
    if (todayBtn) todayBtn.onclick = () => goToToday();

    // Modal Close
    const closeBtn = document.querySelector('.close-modal-btn');
    const overlay = document.querySelector('.modal-overlay');

    if (closeBtn) closeBtn.onclick = closeModal;
    if (overlay) overlay.onclick = (e) => {
        if (e.target === overlay) closeModal();
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Date Search
    const searchBtn = document.getElementById('search-date-btn');
    if (searchBtn) {
        searchBtn.onclick = () => {
            const month = parseInt(document.getElementById('search-month').value);
            const year  = parseInt(document.getElementById('search-year').value);
            if (!isNaN(month) && !isNaN(year)) {
                calendarState.currentDate.setMonth(month);
                calendarState.currentDate.setFullYear(year);
                renderCalendar();
            }
        };
    }
}

function changeMonth(offset) {
    calendarState.currentDate.setMonth(calendarState.currentDate.getMonth() + offset);
    renderCalendar();
}

function goToToday() {
    calendarState.currentDate = new Date();
    renderCalendar();
}

function renderCalendar() {
    const year  = calendarState.currentDate.getFullYear();
    const month = calendarState.currentDate.getMonth();

    // Sincronizar inputs de búsqueda
    const monthSelect = document.getElementById('search-month');
    const yearInput   = document.getElementById('search-year');
    if (monthSelect) monthSelect.value = month;
    if (yearInput)   yearInput.value   = year;

    // Actualizar Header
    const monthNames = [
        "Enero","Febrero","Marzo","Abril","Mayo","Junio",
        "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
    ];
    const headerEl = document.getElementById('calendar-month-year');
    if (headerEl) headerEl.textContent = `${monthNames[month]} ${year}`;

    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Headers de días
    const esDayNames = ['lun','mar','mié','jue','vie','sáb','dom'];
    esDayNames.forEach(day => {
        const h = document.createElement('div');
        h.className = 'calendar-day-header';
        h.textContent = day;
        grid.appendChild(h);
    });

    // Cálculos
    const firstDayOfMonth  = new Date(year, month, 1);
    const lastDayOfMonth   = new Date(year, month + 1, 0);
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const daysInMonth      = lastDayOfMonth.getDate();

    let firstDayIndex = firstDayOfMonth.getDay() - 1;
    if (firstDayIndex === -1) firstDayIndex = 6;

    // Padding inicial
    for (let i = firstDayIndex; i > 0; i--) {
        grid.appendChild(createDayElement(prevMonthLastDay - i + 1, true));
    }

    // Días del mes
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const isToday  = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const dateStr  = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        grid.appendChild(createDayElement(i, false, isToday, dateStr));
    }

    // Padding final
    const totalCells = firstDayIndex + daysInMonth;
    let remaining = 7 - (totalCells % 7);
    if (remaining === 7) remaining = 0;
    for (let i = 1; i <= remaining; i++) {
        grid.appendChild(createDayElement(i, true));
    }
}

function createDayElement(dayNumber, isOtherMonth, isToday = false, dateStr = null) {
    const el = document.createElement('div');
    el.className = `calendar-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;

    const numberEl = document.createElement('div');
    numberEl.className = 'calendar-day-number';
    numberEl.textContent = dayNumber;
    el.appendChild(numberEl);

    if (!isOtherMonth && dateStr) {
        // Eventos de favoritos para este día (inicio o fin)
        const dayEvents = calendarState.events.filter(e => {
            const eStart = e.date     ? e.date.split('T')[0].split(' ')[0]     : null;
            const eEnd   = e.end_date ? e.end_date.split('T')[0].split(' ')[0] : null;
            return eStart === dateStr || eEnd === dateStr;
        });

        if (dayEvents.length > 0) {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'event-dots';

            dayEvents.forEach(event => {
                const dot = document.createElement('div');
                const eStart = event.date     ? event.date.split('T')[0].split(' ')[0]     : null;
                const eEnd   = event.end_date ? event.end_date.split('T')[0].split(' ')[0] : null;

                let dotClass = 'event-dot favorite'; // Todos son favoritos
                if (eStart === dateStr) dotClass += ' start-date';
                if (eEnd   === dateStr) dotClass += ' end-date';

                dot.className = dotClass;
                dotsContainer.appendChild(dot);
            });

            el.appendChild(dotsContainer);
        }

        el.onclick = () => openModal(dateStr, dayEvents);
    }

    return el;
}

// ===== MODAL =====

function openModal(dateStr, events) {
    const overlay = document.querySelector('.modal-overlay');
    const title   = document.getElementById('modal-date');
    const list    = document.getElementById('modal-tasks');

    if (!overlay || !title || !list) return;

    // Formatear fecha
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateObj = new Date(dateStr + 'T12:00:00'); // Evitar desfase de zona horaria
    title.textContent = dateObj.toLocaleDateString('es-ES', options);

    list.innerHTML = '';

    if (events && events.length > 0) {
        events.forEach(event => {
            const li = document.createElement('li');
            li.className = 'modal-task-item';

            const eStart = event.date     ? event.date.split('T')[0].split(' ')[0]     : null;
            const eEnd   = event.end_date ? event.end_date.split('T')[0].split(' ')[0] : null;

            let timeText = '';
            if (eStart === dateStr && eEnd === dateStr) {
                timeText = 'Inicio y Fin del trámite';
            } else if (eStart === dateStr) {
                timeText = 'Inicio de trámite';
                if (eEnd) timeText += ` · Finaliza: ${eEnd}`;
            } else if (eEnd === dateStr) {
                timeText = 'Fin de trámite';
                if (eStart) timeText += ` · Inició: ${eStart}`;
            }

            li.innerHTML = `
                <div class="modal-task-title">❤️ ${event.title}</div>
                <div class="modal-task-time">${timeText}</div>
            `;
            list.appendChild(li);
        });
    } else {
        list.innerHTML = '<div class="no-tasks">No tienes trámites favoritos programados para este día.</div>';
    }

    overlay.classList.add('active');
}

function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.classList.remove('active');
}
