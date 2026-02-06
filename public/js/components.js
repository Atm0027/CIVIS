/**
 * Componente: Tarjeta de Video
 * @param {Object} video - Objeto con datos del video
 * @returns {string} - HTML de la tarjeta
 */
function VideoCard(video) {
    // Generar thumbnail desde URL de YouTube/Vimeo
    const thumbnail = getVideoThumbnail(video.url);
    const description = video.description ? video.description.substring(0, 100) + (video.description.length > 100 ? '...' : '') : 'Sin descripción';
    const categoryName = video.category ? video.category.name : 'Sin categoría';

    // Verificar estado de selección (usando funciones globales de selection.js si existen)
    const isSelected = window.isVideoSelected ? window.isVideoSelected(video.id) : false;

    // Usamos handleVideoClick para decidir en tiempo de ejecución si seleccionar o navegar
    const clickAction = `window.handleVideoClick(event, ${video.id})`;

    const selectedClass = isSelected ? 'selected' : '';
    const checkboxChecked = isSelected ? 'checked' : '';

    // Eliminamos la clase 'hidden' condicional. La visibilidad se controlará por CSS
    // usando la clase .selection-mode-active en el body
    const checkboxHidden = '';

    return `
        <div class="video-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer ${selectedClass}"
             data-video-id="${video.id}"
             onclick="${clickAction}">

            <div class="video-card-overlay ${checkboxHidden}">
                <input type="checkbox" class="video-checkbox" ${checkboxChecked} readonly>
            </div>

            <img class="w-full h-48 object-cover" src="${thumbnail}" alt="Miniatura de ${video.title}" onerror="this.src='https://placehold.co/320x180?text=Video'">
            <div class="p-5">
                <h3 class="text-lg font-bold text-gray-900 mb-2">${video.title}</h3>
                <p class="text-sm text-gray-600 mb-4">${description}</p>
                <div class="flex flex-wrap gap-2">
                    <span class="text-xs font-medium bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">${categoryName}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Obtiene el thumbnail de un video de YouTube o Vimeo
 * @param {string} url - URL del video
 * @returns {string} - URL del thumbnail
 */
function getVideoThumbnail(url) {
    if (!url) return 'https://placehold.co/320x180?text=Video';

    // YouTube
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[1]) {
        return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
    }

    // Vimeo - usar placeholder ya que Vimeo requiere API para thumbnails
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
        return 'https://placehold.co/320x180/1ab7ea/ffffff?text=Vimeo';
    }

    // NotebookLM
    if (url.includes('notebooklm.google.com')) {
        return 'https://placehold.co/320x180/0f172a/ffffff?text=NotebookLM+Overview';
    }

    // Genérico / Otros
    return 'https://placehold.co/320x180/334155/ffffff?text=Video';
}

/**
 * Componente: Item de Plazo
 * @param {Object} deadline - Objeto con datos del plazo
 * @returns {string} - HTML del item
 */
function DeadlineItem(deadline) {
    const itemDate = new Date(deadline.start_date);
    const formattedDate = itemDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

    return `
        <div class="flex items-center space-x-3">
            <div class="shrink-0 p-2 bg-slate-700 rounded-full">
                <svg class="w-4 h-4 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <p class="text-sm font-medium text-white">${deadline.title}</p>
                <p class="text-xs text-slate-400">${formattedDate}</p>
            </div>
        </div>
    `;
}

/**
 * Componente: Item de Calendario Completo
 * @param {Object} item - Objeto con datos del plazo
 * @returns {string} - HTML del item
 */
function CalendarListItem(item) {
    // Use 'date' field from API (DeadlineController@index returns 'date', not 'start_date')
    const itemDate = new Date(item.date);
    const formattedDate = itemDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    const isPast = new Date(item.date) < new Date();

    return `
        <li class="py-4 flex justify-between items-center">
            <div>
                <p class="text-md font-medium text-gray-900">${item.title}</p>
                <p class="text-sm text-gray-500">${formattedDate}</p>
            </div>
            <span class="text-sm font-semibold ${isPast ? 'text-red-600' : 'text-green-600'}">
                ${isPast ? 'Plazo finalizado' : 'Plazo abierto'}
            </span>
        </li>
    `;
}

/**
 * Componente: Card de FAQ
 * @param {Object} faq - Objeto con pregunta y respuesta
 * @returns {string} - HTML de la FAQ
 */
function FaqCard(faq) {
    return `
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${faq.question}</h3>
            <p class="text-gray-700">${faq.answer}</p>
        </div>
    `;
}

/**
 * Componente: Badge de Tag
 * @param {string} tag - Texto del tag
 * @param {string} color - Color del badge (blue, green, red, etc.)
 * @returns {string} - HTML del badge
 */
function TagBadge(tag, color = 'blue') {
    return `<span class="text-xs font-medium bg-${color}-100 text-${color}-800 px-2.5 py-0.5 rounded-full">${tag}</span>`;
}

/**
 * Componente: Mensaje de Éxito
 * @param {string} message - Mensaje a mostrar
 * @returns {string} - HTML del mensaje
 */
function SuccessMessage(message) {
    return `
        <div class="mt-4 p-3 rounded-md bg-green-50 text-green-700 border border-green-200">
            ${message}
        </div>
    `;
}

/**
 * Componente: Mensaje de Error
 * @param {string} message - Mensaje de error
 * @returns {string} - HTML del mensaje
 */
function ErrorMessage(message) {
    return `
        <div class="mt-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200">
            <div class="flex">
                <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>${message}</span>
            </div>
        </div>
    `;
}

/**
 * Componente: Skeleton Loader (para carga)
 * @returns {string} - HTML del skeleton
 */
function SkeletonCard() {
    return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div class="w-full h-48 bg-gray-300"></div>
            <div class="p-5">
                <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-300 rounded w-full mb-2"></div>
                <div class="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
        </div>
    `;
}

/**
 * Componente: Empty State (sin resultados)
 * @param {string} message - Mensaje a mostrar
 * @returns {string} - HTML del empty state
 */
function EmptyState(message = "No hay resultados") {
    return `
        <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">${message}</h3>
        </div>
    `;
}

/**
 * Componente: Perfil de Usuario Sidebar
 * @param {Object} user - Objeto con datos del usuario
 * @returns {string} - HTML del perfil
 */
function UserProfileSidebar(user) {
    return `
        <div class="flex flex-col items-center text-center">
            <img class="h-20 w-20 rounded-full object-cover" src="${user.avatarUrl}" alt="Avatar de usuario">
            <h4 class="mt-3 text-lg font-semibold text-white">${user.name}</h4>
            <p class="text-sm text-slate-400">${user.email}</p>
            <button class="nav-link-profile mt-4 text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors" data-page="profile">
                Editar Perfil
            </button>
        </div>
    `;
}

/**
 * Componente: Modal genérico
 * @param {string} title - Título del modal
 * @param {string} content - Contenido del modal
 * @returns {string} - HTML del modal
 */
function Modal(title, content) {
    return `
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="modal">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3">
                    <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">${title}</h3>
                    <div class="mt-2 px-7 py-3">
                        ${content}
                    </div>
                    <div class="items-center px-4 py-3">
                        <button id="modal-close" class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

