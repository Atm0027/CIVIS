// ===== LÓGICA PRINCIPAL DE LA APLICACIÓN CIVIS =====
// Todos los datos se obtienen desde la API Laravel

// Variable global para el usuario actual (null si no está logueado)
let currentUser = null;

// Espera a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', async () => {
    const path = window.location.pathname;
    const isIndex = !path.includes('.html') || path.includes('index.html');

    // OPTIMIZACIÓN: En index.html, arrancar el feed de vídeos DE INMEDIATO
    // mientras cargamos la sesión en paralelo (evita pantalla en blanco tras login)
    if (isIndex) {
        loadVideoFeed(); // No awaited → arranca en paralelo
    }

    // Cargar usuario (puede implicar llamada a /auth/me)
    await loadCurrentUser();

    // Inicializar la UI (sidebar, plazos, notificaciones, etc.)
    initializeApp();

    // Escuchar evento de videos eliminados para recargar la lista
    document.addEventListener('videosDeleted', () => {
        loadVideoFeed();
    });
});

// ===== CARGAR USUARIO ACTUAL =====
async function loadCurrentUser() {
    try {
        // Primero intentar desde localStorage (más rápido)
        currentUser = getCurrentUserFromStorage();

        // Si no hay datos locales y tenemos token, obtener desde API
        if (!currentUser && hasToken()) {
            currentUser = await getUserProfile();
            saveCurrentUser(currentUser);
        }

    } catch (error) {
        // Si falla (token inválido), limpiamos sesión pero NO redirigimos aquí
        removeToken();
        removeCurrentUser();
        currentUser = null;
    }
}

// ===== FUNCIÓN PRINCIPAL DE INICIALIZACIÓN =====
function initializeApp() {
    // Detectar página actual
    const path = window.location.pathname;
    const isProtectedPage = path.includes('calendario.html') || path.includes('usuario.html');

    // Si es página protegida y no hay usuario, redirigir a login
    if (isProtectedPage && !currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Obtener referencias a elementos del DOM
    const elements = getElements();

    // Configurar event listeners
    setupEventListeners(elements);

    // Renderizar contenido inicial según estado de sesión
    if (currentUser) {
        renderUserProfile();
    } else {
        renderAuthButtons(); // Mostrar botones Login/Registro
    }

    // Inicializar Notificaciones si el usuario está logueado
    if (currentUser) {
        initNotificationsUI();
    }

    // Cargar contenido específico de la página
    if (path.includes('calendario.html')) {
        loadCalendarPage();
    } else if (path.includes('preguntasFrecuentes.html')) {
        loadFaqPage();
    } else if (path.includes('usuario.html')) {
        loadProfileData();
    } else {
        // index.html: el feed de vídeos ya está cargando en paralelo (ver DOMContentLoaded).
        // Aquí solo añadimos lo que depende de saber si hay usuario logueado.
        if (currentUser) {
            loadUpcomingDeadlines();
        } else {
            const deadlinesEl = document.getElementById('deadlines-list');
            if (deadlinesEl) deadlinesEl.innerHTML = '<p class="text-sm text-slate-400">Inicia sesión para ver tus plazos.</p>';
        }
        // NO llamamos loadVideoFeed() aquí porque ya se lanzó en DOMContentLoaded en paralelo
    }
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
        upcomingDeadlinesEl: document.getElementById('deadlines-list'),

        videoFeedGrid: document.getElementById('tramites-grid'),
        feedTitle: document.getElementById('feed-title'),
        noResultsEl: document.getElementById('no-results'),

        calendarFullList: document.querySelector('.calendar-wrapper'),
        faqList: document.getElementById('faqs-list'),

        searchBar: document.getElementById('search-bar'),
        searchBtn: document.getElementById('search-btn'),
        clearSearchBtn: document.getElementById('clear-search'),

        profileForm: document.getElementById('profile-edit-form'),
        profileNameInput: document.getElementById('profile-name'),
        profileSurnameInput: document.getElementById('profile-surname'),
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
}

// ===== CONFIGURAR EVENT LISTENERS =====
function setupEventListeners(elements) {
    // Control de la Sidebar Móvil (solo si existen los elementos)
    if (elements.openSidebarBtn && elements.sidebar) {
        elements.openSidebarBtn.addEventListener('click', () => {
            elements.sidebar.classList.toggle('sidebar-open');
            if (elements.sidebarOverlay) {
                elements.sidebarOverlay.classList.toggle(
                    'hidden',
                    !elements.sidebar.classList.contains('sidebar-open')
                );
            }
        });
    }

    if (elements.closeSidebarBtn && elements.sidebar) {
        elements.closeSidebarBtn.addEventListener('click', () => {
            elements.sidebar.classList.remove('sidebar-open');
            if (elements.sidebarOverlay) elements.sidebarOverlay.classList.add('hidden');
        });
    }

    if (elements.sidebarOverlay && elements.sidebar) {
        elements.sidebarOverlay.addEventListener('click', () => {
            elements.sidebar.classList.add('-translate-x-full');
            elements.sidebarOverlay.classList.add('hidden');
        });
    }

    // Navegación principal (solo enlaces con data-page)
    if (elements.navLinks && elements.navLinks.length > 0) {
        elements.navLinks.forEach(link => {
            if (link.dataset.page) {
                link.addEventListener('click', (e) => {
                    // Si el link apunta a un HTML distinto, dejar que navegue
                    const href = link.getAttribute('href');
                    if (href && href.includes('.html') && href !== 'index.html') {
                        return;
                    }

                    e.preventDefault();
                    showPage('videoteca'); // Default to videoteca for now as invalid 'feed' was used

                    // En móvil, cerrar la sidebar
                    if (window.innerWidth < 768 && elements.sidebar && elements.sidebarOverlay) {
                        elements.sidebar.classList.add('-translate-x-full');
                        elements.sidebarOverlay.classList.add('hidden');
                    }
                });
            }
        });
    }

    // Lógica de Búsqueda (solo si existe search-bar o search-input)
    const searchInput = elements.searchBar || document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const clearSearchBtn = elements.clearSearchBtn;
            const searchTerm = e.target.value.trim();

            // Mostrar/ocultar botón de limpiar
            if (clearSearchBtn) {
                if (searchTerm !== '') {
                    clearSearchBtn.classList.remove('hidden');
                } else {
                    clearSearchBtn.classList.add('hidden');
                }
            }
        });

        // Buscar al presionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch({ target: searchInput });
            }
        });
    }

    // Buscar al hacer clic en el botón
    if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', () => {
            const searchInput = elements.searchBar || document.getElementById('search-input');
            if (searchInput) handleSearch({ target: searchInput });
        });
    }

    // Botón para limpiar búsqueda
    if (elements.clearSearchBtn) {
        elements.clearSearchBtn.addEventListener('click', () => {
            const searchInput = elements.searchBar || document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = '';
                elements.clearSearchBtn.classList.add('hidden');
                handleSearch({ target: { value: '' } });
            }
        });
    }

    // Botón volver en detalle
    const btnBack = document.getElementById('btn-back');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            showPage('videoteca');
        });
    }

    // Lógica de Editar Perfil
    if (elements.profileForm) {
        elements.profileForm.addEventListener('submit', handleProfileSubmit);
    }

    // Botón de cerrar sesión
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', async () => {
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                await logoutUser();
            }
        });
    }
}

// ===== FUNCIONES DE RENDERIZADO =====

// Renderiza el perfil en la barra lateral
function renderUserProfile() {
    const userProfileSidebar = document.getElementById('user-profile-sidebar');
    if (!userProfileSidebar) return;

    // Usar estructura HTML compatible con styles.css
    userProfileSidebar.innerHTML = `
        <div class="user-avatar"></div>
        <p class="user-name">${currentUser.name || 'Usuario'}</p>
        <p class="user-email">${currentUser.email || ''}</p>
        <div class="user-card-actions">
            <button class="btn-edit-profile" onclick="window.location.href='usuario.html'">
                Ver perfil
            </button>
            <button class="btn-logout-sidebar" id="logout-btn-sidebar">
                Cerrar sesión
            </button>
        </div>
    `;

    // Configurar listener para el nuevo botón de logout en la sidebar
    const logoutBtnSidebar = document.getElementById('logout-btn-sidebar');
    if (logoutBtnSidebar) {
        logoutBtnSidebar.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                logoutUser();
            }
        });
    }

    // Mostrar sección de admin si el usuario tiene rol 'admin'
    const adminSection = document.getElementById('admin-section');
    if (adminSection) {
        if (currentUser.role === 'admin') {
            adminSection.classList.remove('hidden');
        } else {
            adminSection.classList.add('hidden');
        }
    }
}

// Renderiza botones de login/registro para invitados
function renderAuthButtons() {
    const userProfileSidebar = document.getElementById('user-profile-sidebar');
    if (!userProfileSidebar) return;

    userProfileSidebar.innerHTML = `
        <p class="user-name" style="font-size: 1rem; margin-bottom: 1rem;">Bienvenido</p>
        <a href="login.html" class="btn-edit-profile" style="display: block; text-align: center; margin-bottom: 0.5rem; text-decoration: none;">
            Iniciar Sesión
        </a>
        <a href="register.html" class="btn-edit-profile" style="display: block; text-align: center; background: transparent; border: 1px solid var(--color-primary); text-decoration: none;">
            Registrarse
        </a>
    `;

    // Ocultar sección de admin para invitados
    const adminSection = document.getElementById('admin-section');
    if (adminSection) {
        adminSection.classList.add('hidden');
    }
}

// Carga y renderiza los plazos cercanos desde API
async function loadUpcomingDeadlines() {
    const upcomingDeadlinesEl = document.getElementById('deadlines-list');

    try {
        showLoader(upcomingDeadlinesEl);

        const deadlines = await getUpcomingDeadlines(2);

        if (deadlines.length === 0) {
            upcomingDeadlinesEl.innerHTML = '<p class="text-sm text-slate-400">No hay plazos cercanos.</p>';
            return;
        }

        upcomingDeadlinesEl.innerHTML = deadlines.map(deadline => DeadlineItem(deadline)).join('');

    } catch (error) {
        console.error('Error cargando plazos:', error);
        upcomingDeadlinesEl.innerHTML = '<p class="text-sm text-red-400">Error al cargar plazos</p>';
    }
}

// Carga y renderiza el feed de videos desde API
async function loadVideoFeed() {
    const videoFeedGrid = document.getElementById('tramites-grid');
    const noResultsEl = document.getElementById('no-results');

    // Guardia: si no existe el contenedor de vídeos en esta página, no hacer nada
    if (!videoFeedGrid) return;

    try {
        showLoader(videoFeedGrid);
        if (noResultsEl) noResultsEl.classList.add('hidden');

        const response = await getVideos();
        // Handle pagination structure (Laravel default) or direct array
        const videos = response.data || response;

        if (!Array.isArray(videos) || videos.length === 0) {
            videoFeedGrid.innerHTML = '';
            if (noResultsEl) noResultsEl.classList.remove('hidden');
            return;
        }

        renderVideos(videos);

    } catch (error) {
        console.error('Error cargando videos:', error);
        videoFeedGrid.innerHTML = ErrorMessage('Error al cargar los videos. Intenta nuevamente.');
    }
}

// Renderiza videos en el grid
function renderVideos(videos) {
    const videoFeedGrid = document.getElementById('tramites-grid');
    const noResultsEl = document.getElementById('no-results');

    videoFeedGrid.innerHTML = '';

    if (videos.length === 0) {
        noResultsEl.classList.remove('hidden');
        return;
    }

    // Cachear el array para que rerenderVideoCard pueda reusar los datos del vídeo
    window._cachedVideos = videos;

    noResultsEl.classList.add('hidden');
    videoFeedGrid.innerHTML = videos.map(video => VideoCard(video)).join('');
}

// Carga y renderiza el calendario completo desde API
async function loadCalendarPage() {
    const calendarFullList = document.querySelector('.calendar-wrapper');

    try {
        showLoader(calendarFullList);

        const calendar = await getCalendar();

        // Ordenar por fecha
        const sortedCalendar = calendar.sort((a, b) => new Date(a.date) - new Date(b.date));

        calendarFullList.innerHTML = sortedCalendar.map(item => CalendarListItem(item)).join('');

    } catch (error) {
        console.error('Error cargando calendario:', error);
        calendarFullList.innerHTML = ErrorMessage('Error al cargar el calendario');
    }
}

// Carga y renderiza las FAQs desde API
async function loadFaqPage() {
    const faqList = document.getElementById('faqs-list');

    try {
        showLoader(faqList);

        const faqs = await getFaqs();

        faqList.innerHTML = faqs.map(faq => FaqCard(faq)).join('');

    } catch (error) {
        console.error('Error cargando FAQs:', error);
        faqList.innerHTML = ErrorMessage('Error al cargar las preguntas frecuentes');
    }
}

// ===== SISTEMA DE NOTIFICACIONES (UI) =====

function initNotificationsUI() {
    const bellBtn = document.getElementById('notification-bell');
    const dropdown = document.getElementById('notification-dropdown');
    const dot = document.getElementById('notification-dot');
    const list = document.getElementById('notification-list');
    const markAllBtn = document.getElementById('mark-all-read');

    if (!bellBtn || !dropdown || !Notifications) return;

    // Toggle dropdown
    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');

        // Al abrir, si hay unread, podríamos querer marcarlas, pero mejor que el usuario lo vea primero
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== bellBtn) {
            dropdown.classList.remove('active');
        }
    });

    // Marcar todo como leído
    if (markAllBtn) {
        markAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            Notifications.markAllAsRead();
            renderNotificationList();
        });
    }

    // Escuchar actualizaciones
    document.addEventListener('notificationsUpdated', () => {
        updateNotificationBadge();
        renderNotificationList();
    });

    // Inicializar estado
    updateNotificationBadge();
    renderNotificationList();

    // Chequear alertas del sistema (ej: DNI faltante)
    if (currentUser) {
        Notifications.checkSystemAlerts(currentUser);
    }
}

function updateNotificationBadge() {
    const dot = document.getElementById('notification-dot');
    if (!dot) return;

    const count = Notifications.getUnreadCount();
    if (count > 0) {
        dot.classList.add('active');
    } else {
        dot.classList.remove('active');
    }
}

function renderNotificationList() {
    const list = document.getElementById('notification-list');
    if (!list) return;

    const notifications = Notifications.getAll();

    if (notifications.length === 0) {
        list.innerHTML = '<div class="notification-empty">No tienes avisos pendientes</div>';
        return;
    }

    list.innerHTML = notifications.map(n => `
        <li class="notification-item ${n.read ? '' : 'unread'}" onclick="handleNotificationClick(event, ${n.id})">
            <div class="notification-title">${n.title}</div>
            <div class="notification-msg">${n.message}</div>
            <div class="notification-time">${new Date(n.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
        </li>
    `).join('');
}

window.handleNotificationClick = (e, id) => {
    e.stopPropagation();
    Notifications.markAsRead(id);
    const notifications = Notifications.getAll();
    const n = notifications.find(item => item.id === id);
    if (n && n.link) {
        window.location.href = n.link;
    } else {
        renderNotificationList();
        updateNotificationBadge();
    }
};

// ===== LOGOUT DEL USUARIO =====
async function logoutUser() {
    try {
        // Mostrar loader si estamos en una vista con botón
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.disabled = true;
            logoutBtn.innerHTML = '<span class="spinner-sm"></span> Cerrando...';
        }

        // Si api.js tiene logout(), usarlo
        if (typeof logout === 'function') {
            await logout();
        }
    } catch (error) {
        // Fail gracefully
    } finally {
        // Limpieza profunda de localStorage
        removeToken();
        removeCurrentUser();
        // Opcional: limpiar también favoritos/notificaciones si se desea sesión limpia total
        // Por ahora mantenemos favoritos locales.

        window.location.href = 'login.html';
    }
}

// ===== HANDLERS DE EVENTOS =====

// ===== LIBRERÍA PERSONAL: FAVORITOS, VISTOS Y VALORACIONES =====

window.handleToggleFavorite = (e, videoId) => {
    e.stopPropagation();
    if (!window.UserLibrary || !window._cachedVideos) return;
    const video = window._cachedVideos.find(v => String(v.id) === String(videoId));
    if (!video) return;
    const result = window.UserLibrary.toggleFavorite(video);

    if (result.action === 'added') {
        window.Toast && window.Toast.show({ message: '❤️ Añadido a favoritos', type: 'success', duration: 2000 });
    } else {
        window.Toast && window.Toast.show({ message: 'Eliminado de favoritos', type: 'info', duration: 2000 });
    }
    rerenderVideoCard(videoId);
};

window.handleToggleWatched = (e, videoId) => {
    e.stopPropagation();
    if (!window.UserLibrary || !window._cachedVideos) return;
    const video = window._cachedVideos.find(v => String(v.id) === String(videoId));
    if (!video) return;
    const result = window.UserLibrary.toggleWatched(video);

    if (result.action === 'added') {
        window.Toast && window.Toast.show({ message: '✓ Marcado como visto', type: 'success', duration: 2000 });
    } else {
        window.Toast && window.Toast.show({ message: 'Marcado como no visto', type: 'info', duration: 2000 });
    }
    rerenderVideoCard(videoId);
};

window.handleToggleRating = (e, videoId, value) => {
    e.stopPropagation();
    if (!window.UserLibrary) return;
    const result = window.UserLibrary.toggleRating(videoId, value);

    if (result.rating !== null) {
        window.Toast && window.Toast.show({ message: '¡Gracias por tu valoración!', type: 'success', duration: 2500 });
    } else {
        window.Toast && window.Toast.show({ message: 'Valoración eliminada', type: 'info', duration: 2000 });
    }
    rerenderVideoCard(videoId);
};

/**
 * Re-renderiza una tarjeta de vídeo en el grid para reflejar cambios de estado.
 * Usa insertAdjacentHTML + remove() para reemplazar el elemento de forma fiable.
 */
function rerenderVideoCard(videoId) {
    const card = document.querySelector(`[data-video-id="${videoId}"]`);
    if (!card || !window._cachedVideos) return;

    const video = window._cachedVideos.find(v => String(v.id) === String(videoId));
    if (!video) return;

    // Insertar la nueva card justo antes de la actual, luego eliminar la antigua
    card.insertAdjacentHTML('beforebegin', VideoCard(video));
    card.remove();
}


// Manejador de búsqueda
async function handleSearch(e) {
    const feedTitle = document.getElementById('feed-title');
    const videoFeedGrid = document.getElementById('tramites-grid');
    const searchTerm = e.target.value.toLowerCase().trim();

    // Asegurarse de que estamos en la página de feed (videoteca)
    showPage('videoteca');

    if (searchTerm === '') {
        feedTitle.textContent = 'Videoteca de Trámites';
        feedTitle.classList.remove('text-blue-600', 'text-red-600');
        await loadVideoFeed();
        return;
    }

    // Validar longitud mínima
    if (searchTerm.length < CONFIG.search.minCharacters) {
        return;
    }

    try {
        showLoader(videoFeedGrid);

        // Buscar en la API
        const response = await searchVideos(searchTerm);
        const videos = response.data || response;

        // Actualizar título con contador de resultados
        const resultCount = videos.length;
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

        renderVideos(videos);

        // Hacer scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error en búsqueda:', error);
        videoFeedGrid.innerHTML = ErrorMessage('Error al buscar. Intenta nuevamente.');
    }
}

// Manejador de envío de formulario de perfil
async function handleProfileSubmit(e) {
    e.preventDefault();

    const saveSuccessMessage = document.getElementById('save-success-message');
    const submitButton = e.target.querySelector('button[type="submit"]');

    // Recoger todos los datos del formulario
    const updates = {
        name: document.getElementById('profile-name').value,
        surname: document.getElementById('profile-surname').value,
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

    // Deshabilitar botón
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';

    try {
        // Actualizar perfil en la API
        const updatedUser = await updateUserProfile(updates);

        // Actualizar variable global y localStorage
        currentUser = updatedUser;
        saveCurrentUser(updatedUser);

        // Volver a renderizar el perfil en la sidebar
        renderUserProfile();

        // Mostrar mensaje de éxito
        saveSuccessMessage.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'border-red-200');
        saveSuccessMessage.classList.add('bg-green-50', 'text-green-700', 'border', 'border-green-200');
        saveSuccessMessage.textContent = 'Perfil actualizado correctamente';

        setTimeout(() => {
            saveSuccessMessage.classList.add('hidden');
        }, 3000);

    } catch (error) {
        console.error('Error actualizando perfil:', error);

        // Mostrar mensaje de error
        saveSuccessMessage.classList.remove('hidden', 'bg-green-50', 'text-green-700', 'border-green-200');
        saveSuccessMessage.classList.add('bg-red-50', 'text-red-700', 'border', 'border-red-200');
        saveSuccessMessage.textContent = error.message || 'Error al actualizar el perfil';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Guardar Cambios';
    }
}

// ===== PERFIL: CARGAR DATOS EN EL FORMULARIO =====
function loadProfileData() {
    if (!currentUser) return;

    const fields = {
        'profile-username': currentUser.username || '',
        'profile-name': currentUser.name || '',
        'profile-surname': currentUser.surname || '',
        'profile-email': currentUser.email || '',
        'profile-dni': currentUser.dni || '',
        'profile-phone': currentUser.phone || '',
        'profile-dateOfBirth': currentUser.dateOfBirth || '',
        'profile-address': currentUser.address || '',
        'profile-city': currentUser.city || '',
        'profile-postalCode': currentUser.postalCode || '',
        'profile-province': currentUser.province || '',
    };
    Object.entries(fields).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    });

    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email');
    if (nameEl) nameEl.textContent = currentUser.name || currentUser.username || 'Usuario';
    if (emailEl) emailEl.textContent = currentUser.email || '';

    const form = document.getElementById('profile-edit-form');
    if (form) form.addEventListener('submit', handleProfileSubmit);

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);

    // Cargar Mi Carpeta
    loadMiCarpeta();
}

// ===== MI CARPETA: FAVORITOS Y VISTOS =====
function loadMiCarpeta() {
    // 1) Leer datos: UserLibrary si está listo, o localStorage directamente como fallback
    let favorites = [];
    let watched = [];

    if (window.UserLibrary) {
        favorites = window.UserLibrary.getFavorites();
        watched = window.UserLibrary.getWatched();
    } else {
        try { favorites = JSON.parse(localStorage.getItem('civis_favorites') || '[]'); } catch (e) { }
        try { watched = JSON.parse(localStorage.getItem('civis_watched') || '[]'); } catch (e) { }
    }

    // 2) Resolver vídeo completo: caché del feed → metadata guardada
    const resolveVideo = (savedItem) => {
        if (window._cachedVideos) {
            const cached = window._cachedVideos.find(v => String(v.id) === String(savedItem.id));
            if (cached) return cached;
        }
        return savedItem;
    };

    // 3) Helper para renderizar un bloque (favoritos o vistos)
    const renderBlock = (items, gridId, emptyId, countId) => {
        const grid = document.getElementById(gridId);
        const empty = document.getElementById(emptyId);
        const count = document.getElementById(countId);
        if (!grid) return;
        if (items.length === 0) {
            grid.innerHTML = '';
            if (empty) empty.classList.remove('hidden');
        } else {
            if (empty) empty.classList.add('hidden');
            grid.innerHTML = items.map(item => VideoCard(resolveVideo(item))).join('');
        }
        if (count) count.textContent = items.length;
    };

    renderBlock(favorites, 'favorites-grid', 'favorites-empty', 'fav-count');
    renderBlock(watched, 'watched-grid', 'watched-empty', 'watched-count');
}


