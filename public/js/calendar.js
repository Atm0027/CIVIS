document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
});

const calendarState = {
    currentDate: new Date(),
    events: [] // Se cargarán desde la API
};

async function loadCalendarEvents() {
    try {
        const response = await fetchAPI(CONFIG.api.endpoints.deadline || '/calendar'); // Fallback or defined endpoint
        // Como el endpoint en api.php es /calendar -> DeadlineController@index
        // Pero en config.js podría no estar definido 'calendar', así que usamos hardcoded relative si es necesario o añadimos a config.
        // Asumiendo que CONFIG.api.base_url está configurado, podemos hacer:

        // Mejor opción: usar el endpoint '/calendar' relativo a la API.
        // Si fetchAPI concatena BASE_URL, entonces pasamos '/calendar'

        const events = await fetchAPI('/calendar');
        calendarState.events = events;
        renderCalendar();
    } catch (error) {
        console.error('Error cargando eventos:', error);
    }
}

function initCalendar() {
    loadCalendarEvents();
    renderCalendar();
    setupEventListeners();
}

function setupEventListeners() {
    // Usar .onclick para evitar duplicación de listeners
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

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Date Search
    const searchBtn = document.getElementById('search-date-btn');
    if (searchBtn) {
        searchBtn.onclick = () => {
            const month = parseInt(document.getElementById('search-month').value);
            const year = parseInt(document.getElementById('search-year').value);

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
    const year = calendarState.currentDate.getFullYear();
    const month = calendarState.currentDate.getMonth();

    // Sincronizar inputs de búsqueda
    const monthSelect = document.getElementById('search-month');
    const yearInput = document.getElementById('search-year');

    if (monthSelect) monthSelect.value = month;
    if (yearInput) yearInput.value = year;

    // Actualizar Header
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    document.getElementById('calendar-month-year').textContent = `${monthNames[month]} ${year}`;

    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    // Headers
    const esDayNames = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
    esDayNames.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        grid.appendChild(header);
    });

    // Cálculos de fecha
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const daysInMonth = lastDayOfMonth.getDate();

    let firstDayIndex = firstDayOfMonth.getDay() - 1;
    if (firstDayIndex === -1) firstDayIndex = 6;

    // Renderizar días
    // Padding inicial
    for (let i = firstDayIndex; i > 0; i--) {
        const dayDiv = createDayElement(prevMonthLastDay - i + 1, true);
        grid.appendChild(dayDiv);
    }

    // Días del mes
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

        const dayDiv = createDayElement(i, false, isToday, dateStr);
        grid.appendChild(dayDiv);
    }

    // Padding final
    const totalCells = firstDayIndex + daysInMonth;
    let remaining = 7 - (totalCells % 7);
    if (remaining === 7) remaining = 0;

    for (let i = 1; i <= remaining; i++) {
        const dayDiv = createDayElement(i, true);
        grid.appendChild(dayDiv);
    }
}

function createDayElement(dayNumber, isOtherMonth, isToday = false, dateStr = null) {
    const el = document.createElement('div');
    el.className = `calendar-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;

    const numberEl = document.createElement('div');
    numberEl.className = 'calendar-day-number';
    numberEl.textContent = dayNumber;
    el.appendChild(numberEl);

    // Eventos y Click Handler (Solo para días del mes actual)
    if (!isOtherMonth && dateStr) {
        // Buscar eventos para este día (inicio o fin)
        const dayEvents = calendarState.events.filter(e => e.date === dateStr || e.end_date === dateStr);

        if (dayEvents.length > 0) {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'event-dots';

            dayEvents.forEach(event => {
                const dot = document.createElement('div');
                // Determinar tipo de punto
                let dotClass = 'event-dot';
                if (event.date === dateStr) dotClass += ' start-date'; // Verde/Default
                if (event.end_date === dateStr) dotClass += ' end-date'; // Rojo/Diferente

                if (event.type === 'urgent') dotClass += ' urgent';

                dot.className = dotClass;
                dotsContainer.appendChild(dot);
            });

            el.appendChild(dotsContainer);
        }

        // Click para abrir modal
        el.onclick = () => openModal(dateStr, dayEvents);
    }

    return el;
}

// ===== FUNCIONES DEL MODAL =====

function openModal(dateStr, events) {
    const overlay = document.querySelector('.modal-overlay');
    const title = document.getElementById('modal-date');
    const list = document.getElementById('modal-tasks');

    // Formatear fecha
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateObj = new Date(dateStr);
    title.textContent = dateObj.toLocaleDateString('es-ES', options);

    // Llenar lista
    list.innerHTML = '';

    if (events && events.length > 0) {
        events.forEach(event => {
            const li = document.createElement('li');
            li.className = `modal-task-item ${event.type === 'urgent' ? 'urgent' : ''}`;

            let timeText = '';
            if (event.date === dateStr && event.end_date === dateStr) {
                timeText = 'Inicio y Fin del trámite';
            } else if (event.date === dateStr) {
                timeText = 'Inicio de trámite';
                if (event.end_date) timeText += ` (Finaliza: ${event.end_date})`;
            } else if (event.end_date === dateStr) {
                timeText = 'Fin de trámite';
                if (event.date) timeText += ` (Inició: ${event.date})`;
            }

            li.innerHTML = `
                <div class="modal-task-title">${event.title}</div>
                <div class="modal-task-time">${timeText}</div>
            `;
            list.appendChild(li);
        });
    } else {
        list.innerHTML = '<div class="no-tasks">No hay trámites programados para este día.</div>';
    }

    overlay.classList.add('active');
}

function closeModal() {
    document.querySelector('.modal-overlay').classList.remove('active');
}
