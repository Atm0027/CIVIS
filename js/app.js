// ===== LÓGICA PRINCIPAL DE LA APLICACIÓN CIVIS =====

// Variable global para el usuario actual
let currentUser = {};

// Espera a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el usuario actual
    currentUser = { ...mockDB.user };

    // Inicializar la aplicación
    initializeApp();
});

// ===== FUNCIÓN PRINCIPAL DE INICIALIZACIÓN =====
function initializeApp() {
    // Obtener referencias a elementos del DOM
    const elements = getElements();

    // Configurar event listeners
    setupEventListeners(elements);

    // Renderizar contenido inicial
    renderUserProfile();
    renderUpcomingDeadlines();
    renderFeed(mockDB.videos);
}

// ===== OBTENER REFERENCIAS A ELEMENTOS DEL DOM =====
function getElements() {
    return {
        sidebar: document.getElementById('sidebar'),
        openSidebarBtn: document.getElementById('open-sidebar-btn'),
        closeSidebarBtn: document.getElementById('close-sidebar-btn'),
        sidebarOverlay: document.getElementById('sidebar-overlay'),

        navLinks: document.querySelectorAll('.nav-link'),
        pages: document.querySelectorAll('.page-content'),

        userProfileSidebar: document.getElementById('user-profile-sidebar'),
        upcomingDeadlinesEl: document.getElementById('upcoming-deadlines'),

        videoFeedGrid: document.getElementById('video-feed-grid'),
        feedTitle: document.getElementById('feed-title'),
        noResultsEl: document.getElementById('no-results'),

        calendarFullList: document.getElementById('calendar-full-list'),
        faqList: document.getElementById('faq-list'),

        searchBar: document.getElementById('search-bar'),

        profileForm: document.getElementById('profile-edit-form'),
        profileNameInput: document.getElementById('profile-name'),
        profileEmailInput: document.getElementById('profile-email'),
        profileRelevantDataInput: document.getElementById('profile-relevant-data'),
        saveSuccessMessage: document.getElementById('save-success-message')
    };
}

// ===== CONFIGURAR EVENT LISTENERS =====
function setupEventListeners(elements) {
    // Control de la Sidebar Móvil
    elements.openSidebarBtn.addEventListener('click', () => {
        elements.sidebar.classList.remove('-translate-x-full');
        elements.sidebarOverlay.classList.remove('hidden');
    });

    elements.closeSidebarBtn.addEventListener('click', () => {
        elements.sidebar.classList.add('-translate-x-full');
        elements.sidebarOverlay.classList.add('hidden');
    });

    elements.sidebarOverlay.addEventListener('click', () => {
        elements.sidebar.classList.add('-translate-x-full');
        elements.sidebarOverlay.classList.add('hidden');
    });

    // Navegación principal
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            showPage(pageId);
            // En móvil, cerrar la sidebar después de hacer clic
            if (window.innerWidth < 768) {
                elements.sidebar.classList.add('-translate-x-full');
                elements.sidebarOverlay.classList.add('hidden');
            }
        });
    });

    // Lógica de Búsqueda
    elements.searchBar.addEventListener('input', handleSearch);

    // Lógica de Editar Perfil
    elements.profileForm.addEventListener('submit', handleProfileSubmit);
}

// ===== FUNCIONES DE RENDERIZADO =====

// Renderiza el perfil en la barra lateral
function renderUserProfile() {
    const userProfileSidebar = document.getElementById('user-profile-sidebar');

    userProfileSidebar.innerHTML = `
        <div class="flex flex-col items-center text-center">
            <img class="h-20 w-20 rounded-full object-cover" src="${currentUser.avatarUrl}" alt="Avatar de usuario">
            <h4 class="mt-3 text-lg font-semibold text-white">${currentUser.name}</h4>
            <p class="text-sm text-slate-400">${currentUser.email}</p>
            <button class="nav-link-profile mt-4 text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors" data-page="profile">
                Editar Perfil
            </button>
        </div>
    `;

    // Añadir event listener al botón de editar perfil recién creado
    document.querySelector('.nav-link-profile').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('profile');
        // Rellenar el formulario de perfil
        const profileNameInput = document.getElementById('profile-name');
        const profileEmailInput = document.getElementById('profile-email');
        const profileRelevantDataInput = document.getElementById('profile-relevant-data');

        profileNameInput.value = currentUser.name;
        profileEmailInput.value = currentUser.email;
        profileRelevantDataInput.value = currentUser.relevantData;
    });
}

// Renderiza los plazos cercanos en la barra lateral
function renderUpcomingDeadlines() {
    const upcomingDeadlinesEl = document.getElementById('upcoming-deadlines');
    upcomingDeadlinesEl.innerHTML = ''; // Limpiar
    const now = new Date();

    // Simulación: coger los 2 plazos más cercanos
    const upcoming = mockDB.calendar
        .filter(item => new Date(item.date) > now) // Solo fechas futuras
        .sort((a, b) => new Date(a.date) - new Date(b.date)) // Ordenar por cercanía
        .slice(0, 2); // Coger las 2 primeras

    if (upcoming.length === 0) {
        upcomingDeadlinesEl.innerHTML = '<p class="text-sm text-slate-400">No hay plazos cercanos.</p>';
        return;
    }

    upcoming.forEach(item => {
        const itemDate = new Date(item.date);
        const formattedDate = itemDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

        upcomingDeadlinesEl.innerHTML += `
            <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 p-2 bg-slate-700 rounded-full">
                    <svg class="w-4 h-4 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                    <p class="text-sm font-medium text-white">${item.title}</p>
                    <p class="text-xs text-slate-400">${formattedDate}</p>
                </div>
            </div>
        `;
    });
}

// Renderiza el feed de vídeos
function renderFeed(videosToRender) {
    const videoFeedGrid = document.getElementById('video-feed-grid');
    const noResultsEl = document.getElementById('no-results');

    videoFeedGrid.innerHTML = ''; // Limpiar grid

    if (videosToRender.length === 0) {
        noResultsEl.classList.remove('hidden');
    } else {
        noResultsEl.classList.add('hidden');
    }

    videosToRender.forEach(video => {
        videoFeedGrid.innerHTML += `
            <div class="video-card bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl cursor-pointer">
                <img class="w-full h-48 object-cover" src="${video.thumbnail}" alt="Miniatura de ${video.title}">
                <div class="p-5">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">${video.title}</h3>
                    <p class="text-sm text-gray-600 mb-4">${video.description}</p>
                    <div class="flex flex-wrap gap-2">
                        ${video.tags.map(tag => `<span class="text-xs font-medium bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    });
}

// Renderiza la lista completa del calendario
function renderCalendarPage() {
    const calendarFullList = document.getElementById('calendar-full-list');
    calendarFullList.innerHTML = ''; // Limpiar

    mockDB.calendar
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach(item => {
            const itemDate = new Date(item.date);
            const formattedDate = itemDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
            calendarFullList.innerHTML += `
                <li class="py-4 flex justify-between items-center">
                    <div>
                        <p class="text-md font-medium text-gray-900">${item.title}</p>
                        <p class="text-sm text-gray-500">${formattedDate}</p>
                    </div>
                    <span class="text-sm font-semibold ${new Date(item.date) < new Date() ? 'text-red-600' : 'text-green-600'}">
                        ${new Date(item.date) < new Date() ? 'Plazo finalizado' : 'Plazo abierto'}
                    </span>
                </li>
            `;
        });
}

// Renderiza la lista de FAQs
function renderFaqPage() {
    const faqList = document.getElementById('faq-list');
    faqList.innerHTML = ''; // Limpiar

    mockDB.faqs.forEach(faq => {
        faqList.innerHTML += `
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${faq.q}</h3>
                <p class="text-gray-700">${faq.a}</p>
            </div>
        `;
    });
}

// ===== LÓGICA DE NAVEGACIÓN Y ESTADO =====

// Función para mostrar la página correcta y ocultar las demás
function showPage(pageId) {
    const pages = document.querySelectorAll('.page-content');
    const navLinks = document.querySelectorAll('.nav-link');

    // Ocultar todas las páginas
    pages.forEach(page => page.classList.add('hidden'));

    // Mostrar la página solicitada
    const activePage = document.getElementById(`page-${pageId}`);
    if (activePage) {
        activePage.classList.remove('hidden');
    }

    // Actualizar el estado activo de los links de navegación
    navLinks.forEach(link => {
        link.classList.remove('bg-slate-700', 'text-white');
        link.classList.add('text-slate-300');
        if (link.dataset.page === pageId) {
            link.classList.add('bg-slate-700', 'text-white');
            link.classList.remove('text-slate-300');
        }
    });

    // Lógica de renderizado específica de la página
    if (pageId === 'feed') {
        // Al volver al feed, resetea la búsqueda y el título
        const searchBar = document.getElementById('search-bar');
        const feedTitle = document.getElementById('feed-title');
        searchBar.value = '';
        feedTitle.textContent = 'Videoteca de Trámites';
        renderFeed(mockDB.videos);
    } else if (pageId === 'calendar') {
        renderCalendarPage();
    } else if (pageId === 'faq') {
        renderFaqPage();
    }
}

// ===== HANDLERS DE EVENTOS =====

// Manejador de búsqueda
function handleSearch(e) {
    const searchBar = document.getElementById('search-bar');
    const feedTitle = document.getElementById('feed-title');
    const searchTerm = e.target.value.toLowerCase().trim();

    // Asegurarse de que estamos en la página de feed
    showPage('feed');

    if (searchTerm === '') {
        feedTitle.textContent = 'Videoteca de Trámites';
        renderFeed(mockDB.videos);
        return;
    }

    const filteredVideos = mockDB.videos.filter(video =>
        video.title.toLowerCase().includes(searchTerm) ||
        video.description.toLowerCase().includes(searchTerm) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    feedTitle.textContent = `Resultados para "${searchTerm}"`;
    renderFeed(filteredVideos);
}

// Manejador de envío de formulario de perfil
function handleProfileSubmit(e) {
    e.preventDefault();

    const profileNameInput = document.getElementById('profile-name');
    const profileEmailInput = document.getElementById('profile-email');
    const profileRelevantDataInput = document.getElementById('profile-relevant-data');
    const saveSuccessMessage = document.getElementById('save-success-message');

    // Actualizar el objeto currentUser simulado
    currentUser.name = profileNameInput.value;
    currentUser.email = profileEmailInput.value;
    currentUser.relevantData = profileRelevantDataInput.value;

    // Volver a renderizar el perfil en la sidebar
    renderUserProfile();

    // Mostrar mensaje de éxito
    saveSuccessMessage.classList.remove('hidden');
    setTimeout(() => {
        saveSuccessMessage.classList.add('hidden');
        // Volver al feed después de guardar
        showPage('feed');
    }, 2000);
}
