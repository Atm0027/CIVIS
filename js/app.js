// ===== LÓGICA PRINCIPAL DE LA APLICACIÓN CIVIS =====

// Variable global para el usuario actual
let currentUser = {};

// Espera a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Cargar el usuario autenticado
    currentUser = getCurrentUser();

    if (!currentUser) {
        // Si no hay usuario, redirigir a login (por seguridad adicional)
        window.location.href = 'pages/login.html';
        return;
    }

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
        searchBtn: document.getElementById('search-btn'),
        clearSearchBtn: document.getElementById('clear-search'),

        profileForm: document.getElementById('profile-edit-form'),
        profileNameInput: document.getElementById('profile-name'),
        profileEmailInput: document.getElementById('profile-email'),
        profileDniInput: document.getElementById('profile-dni'),
        profilePhoneInput: document.getElementById('profile-phone'),
        profileDateOfBirthInput: document.getElementById('profile-dateOfBirth'),
        profileAddressInput: document.getElementById('profile-address'),
        profileCityInput: document.getElementById('profile-city'),
        profilePostalCodeInput: document.getElementById('profile-postalCode'),
        profileProvinceInput: document.getElementById('profile-province'),
        profileRelevantDataInput: document.getElementById('profile-relevant-data'),
        saveSuccessMessage: document.getElementById('save-success-message'),
        logoutBtn: document.getElementById('logout-btn')
    };
}// ===== CONFIGURAR EVENT LISTENERS =====
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

    // Lógica de Búsqueda - Solo al presionar Enter o hacer clic en botón
    // Mostrar/ocultar botón de limpiar mientras se escribe
    elements.searchBar.addEventListener('input', (e) => {
        const clearSearchBtn = elements.clearSearchBtn;
        const searchTerm = e.target.value.trim();

        // Mostrar/ocultar botón de limpiar inmediatamente
        if (clearSearchBtn) {
            if (searchTerm !== '') {
                clearSearchBtn.classList.remove('hidden');
            } else {
                clearSearchBtn.classList.add('hidden');
            }
        }
    });

    // Buscar al presionar Enter
    elements.searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch({ target: elements.searchBar });
        }
    });

    // Buscar al hacer clic en el botón
    if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', () => {
            handleSearch({ target: elements.searchBar });
        });
    }

    // Botón para limpiar búsqueda
    if (elements.clearSearchBtn) {
        elements.clearSearchBtn.addEventListener('click', () => {
            elements.searchBar.value = '';
            elements.clearSearchBtn.classList.add('hidden');
            handleSearch({ target: { value: '' } });
        });
    }

    // Lógica de Editar Perfil
    elements.profileForm.addEventListener('submit', handleProfileSubmit);

    // Botón de cerrar sesión
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                logoutUser();
                window.location.href = 'pages/login.html';
            }
        });
    }
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
    } else if (pageId === 'profile') {
        loadProfileData();
    }
}

// Carga los datos del perfil en el formulario
function loadProfileData() {
    document.getElementById('profile-name').value = currentUser.name || '';
    document.getElementById('profile-email').value = currentUser.email || '';
    document.getElementById('profile-dni').value = currentUser.dni || '';
    document.getElementById('profile-phone').value = currentUser.phone || '';
    document.getElementById('profile-dateOfBirth').value = currentUser.dateOfBirth || '';
    document.getElementById('profile-address').value = currentUser.address || '';
    document.getElementById('profile-city').value = currentUser.city || '';
    document.getElementById('profile-postalCode').value = currentUser.postalCode || '';
    document.getElementById('profile-province').value = currentUser.province || '';
    document.getElementById('profile-relevant-data').value = currentUser.relevantData || '';
}

// ===== HANDLERS DE EVENTOS =====

// Manejador de búsqueda
function handleSearch(e) {
    const feedTitle = document.getElementById('feed-title');
    const searchTerm = e.target.value.toLowerCase().trim();

    // Asegurarse de que estamos en la página de feed
    showPage('feed');

    if (searchTerm === '') {
        feedTitle.textContent = 'Videoteca de Trámites';
        feedTitle.classList.remove('text-blue-600', 'text-red-600');
        renderFeed(mockDB.videos);
        return;
    }

    // Búsqueda mejorada
    const filteredVideos = mockDB.videos.filter(video => {
        const titleMatch = video.title.toLowerCase().includes(searchTerm);
        const descMatch = video.description.toLowerCase().includes(searchTerm);
        const tagsMatch = video.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        return titleMatch || descMatch || tagsMatch;
    });

    // Actualizar título con contador de resultados
    const resultCount = filteredVideos.length;
    feedTitle.classList.remove('text-blue-600', 'text-red-600');

    if (resultCount === 0) {
        feedTitle.textContent = `No se encontraron resultados para "${searchTerm}"`;
        feedTitle.classList.add('text-red-600');
    } else if (resultCount === 1) {
        feedTitle.textContent = `1 resultado para "${searchTerm}"`;
        feedTitle.classList.add('text-blue-600');
    } else {
        feedTitle.textContent = `${resultCount} resultados para "${searchTerm}"`;
        feedTitle.classList.add('text-blue-600');
    }

    renderFeed(filteredVideos);

    // Hacer scroll al inicio de los resultados
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Manejador de envío de formulario de perfil
function handleProfileSubmit(e) {
    e.preventDefault();

    const saveSuccessMessage = document.getElementById('save-success-message');

    // Recoger todos los datos del formulario
    const updates = {
        name: document.getElementById('profile-name').value,
        email: document.getElementById('profile-email').value,
        dni: document.getElementById('profile-dni').value,
        phone: document.getElementById('profile-phone').value,
        dateOfBirth: document.getElementById('profile-dateOfBirth').value,
        address: document.getElementById('profile-address').value,
        city: document.getElementById('profile-city').value,
        postalCode: document.getElementById('profile-postalCode').value,
        province: document.getElementById('profile-province').value,
        relevantData: document.getElementById('profile-relevant-data').value
    };

    // Actualizar el usuario usando el sistema de autenticación
    const result = updateCurrentUser(updates);

    if (result.success) {
        // Actualizar la variable global
        currentUser = result.user;

        // Volver a renderizar el perfil en la sidebar
        renderUserProfile();

        // Mostrar mensaje de éxito
        saveSuccessMessage.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'border-red-200');
        saveSuccessMessage.classList.add('bg-green-50', 'text-green-700', 'border', 'border-green-200');
        saveSuccessMessage.textContent = result.message;

        setTimeout(() => {
            saveSuccessMessage.classList.add('hidden');
        }, 3000);
    } else {
        // Mostrar mensaje de error
        saveSuccessMessage.classList.remove('hidden', 'bg-green-50', 'text-green-700', 'border-green-200');
        saveSuccessMessage.classList.add('bg-red-50', 'text-red-700', 'border', 'border-red-200');
        saveSuccessMessage.textContent = result.message;
    }
}
