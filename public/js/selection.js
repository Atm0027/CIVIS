/**
 * Módulo para gestionar la selección múltiple y eliminación de videos
 */

let isSelectionMode = false;
let selectedVideos = new Set();

/**
 * Alterna el modo de selección
 */
function toggleSelectionMode() {
    isSelectionMode = !isSelectionMode;
    selectedVideos.clear();

    // Actualizar UI
    const selectionBar = document.getElementById('selection-bar');
    const btnSelect = document.getElementById('btn-toggle-selection');

    if (isSelectionMode) {
        // Entrando en modo selección
        selectionBar.classList.remove('hidden');
        btnSelect.textContent = 'Cancelar selección';
        btnSelect.classList.add('active');
        document.body.classList.add('selection-mode-active');
    } else {
        // Saliendo de modo selección
        selectionBar.classList.add('hidden');
        btnSelect.textContent = 'Seleccionar';
        btnSelect.classList.remove('active');
        document.body.classList.remove('selection-mode-active');
    }

    updateSelectionUI();

    // Re-renderizar videos para mostrar/ocultar checkboxes
    // Necesitamos acceder a la lista actual de videos que está en app.js o memoria
    // Como app.js no expone la lista globalmente de forma fácil, disparamos un evento
    document.dispatchEvent(new CustomEvent('selectionModeChanged', {
        detail: { isSelectionMode }
    }));
}

/**
 * Maneja la selección/deselección de un video
 */
function toggleVideoSelection(videoId) {
    if (!isSelectionMode) return;

    videoId = parseInt(videoId);

    if (selectedVideos.has(videoId)) {
        selectedVideos.delete(videoId);
    } else {
        selectedVideos.add(videoId);
    }

    updateSelectionUI();
    updateVideoCardUI(videoId);
}

/**
 * Maneja el clic en una tarjeta de video
 * @param {Event} event - El evento del click
 * @param {number} videoId - ID del video
 */
function handleVideoClick(event, videoId) {
    if (isSelectionMode) {
        event.preventDefault();
        event.stopPropagation();
        toggleVideoSelection(videoId);
    } else {
        // Navegación normal
        window.location.href = `plantilla.html?id=${videoId}`;
    }
}

/**
 * Actualiza la UI de la barra de selección
 */
function updateSelectionUI() {
    const countSpan = document.getElementById('selection-count');
    const deleteBtn = document.getElementById('btn-delete-selected');

    if (countSpan) countSpan.textContent = selectedVideos.size;

    if (deleteBtn) {
        deleteBtn.disabled = selectedVideos.size === 0;
    }
}

/**
 * Actualiza la apariencia de una card específica
 */
function updateVideoCardUI(videoId) {
    const card = document.querySelector(`.video-card[data-video-id="${videoId}"]`);
    if (!card) return;

    const checkbox = card.querySelector('.video-checkbox');
    const isSelected = selectedVideos.has(parseInt(videoId));

    if (isSelected) {
        card.classList.add('selected');
        if (checkbox) checkbox.checked = true;
    } else {
        card.classList.remove('selected');
        if (checkbox) checkbox.checked = false;
    }
}

/**
 * Inicia el proceso de eliminación masiva
 */
function initiateBulkDelete() {
    if (selectedVideos.size === 0) return;

    const countSpan = document.getElementById('bulk-delete-count');
    const modal = document.getElementById('bulk-delete-modal');

    if (countSpan) countSpan.textContent = selectedVideos.size;
    if (modal) {
        modal.classList.remove('hidden');
        // Asegurar que se visualiza
        modal.style.display = 'flex';
        // Forzar reflow para que la transición de opacidad funcione
        void modal.offsetWidth;
        modal.classList.add('active');
    }
}

/**
 * Ejecuta la eliminación masiva
 */
async function performBulkDelete() {
    const confirmBtn = document.getElementById('bulk-modal-confirm');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Eliminando...';
    }

    // Función auxiliar para cerrar modal
    const closeBulkModal = () => {
        const modal = document.getElementById('bulk-delete-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.style.display = '';
            }, 300);
        }
    };

    try {
        const response = await fetchAPI(CONFIG.api.endpoints.bulkDeleteVideos, {
            method: 'DELETE',
            body: JSON.stringify({ ids: Array.from(selectedVideos) })
        });

        // Cerrar modal
        closeBulkModal();

        // Mostrar mensaje éxito
        alert(`Se han eliminado ${selectedVideos.size} videos correctamente.`);

        // Salir de modo selección y recargar
        toggleSelectionMode();

        // Recargar videos (disparar evento para app.js)
        document.dispatchEvent(new CustomEvent('videosDeleted'));

    } catch (error) {
        console.error('Error eliminando videos:', error);
        alert('Error al eliminar los videos: ' + (error.message || 'Error desconocido'));
        // Si hay error, reactivar botón pero NO cerrar modal
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Sí, eliminar';
        }
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {

    // Botón activar selección (sidebar)
    const btnToggle = document.getElementById('btn-toggle-selection');
    if (btnToggle) {
        btnToggle.addEventListener('click', toggleSelectionMode);
    }

    // Botón cancelar (barra flotante)
    const btnCancel = document.getElementById('btn-cancel-selection');
    if (btnCancel) {
        btnCancel.addEventListener('click', toggleSelectionMode);
    }

    // Botón eliminar (barra flotante)
    const btnDelete = document.getElementById('btn-delete-selected');
    if (btnDelete) {
        btnDelete.addEventListener('click', initiateBulkDelete);
    }

    // Botones modal
    const modalCancel = document.getElementById('bulk-modal-cancel');
    const modalConfirm = document.getElementById('bulk-modal-confirm');

    if (modalCancel) {
        modalCancel.addEventListener('click', () => {
            const modal = document.getElementById('bulk-delete-modal');
            if (modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.style.display = '';
                }, 300);
            }
        });
    }

    if (modalConfirm) {
        modalConfirm.addEventListener('click', performBulkDelete);
    }
});

// Exponer funciones globales para usar en atributos onclick
window.toggleVideoSelection = toggleVideoSelection;
window.handleVideoClick = handleVideoClick; // Nueva función expuesta
window.isSelectionModeActive = () => isSelectionMode;
window.isVideoSelected = (id) => selectedVideos.has(parseInt(id));
