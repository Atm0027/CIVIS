// ===== LÓGICA PARA SUBIR VIDEOS (ADMIN) =====

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar categorías al iniciar
    await loadCategories();

    // 2. Configurar botones de nueva categoría
    setupCategoryCreation();

    // 3. Configurar modal de eliminación
    setupDeleteModal();

    // 4. Comprobar si estamos en MODO EDICIÓN
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    if (videoId) {
        enableEditMode(videoId);
    }

    // 5. Manejar envío del formulario
    const form = document.getElementById('upload-form');
    if (form) {
        form.addEventListener('submit', (e) => handleUploadSubmit(e, videoId));
    }
});

/**
 * Configura los event listeners para crear nuevas categorías
 */
function setupCategoryCreation() {
    const btnAdd = document.getElementById('btn-add-category');
    const btnSave = document.getElementById('btn-save-category');
    const btnCancel = document.getElementById('btn-cancel-category');
    const container = document.getElementById('new-category-container');
    const input = document.getElementById('new-category-name');
    const errorEl = document.getElementById('category-error');

    if (!btnAdd || !container) return;

    // Mostrar input para nueva categoría
    btnAdd.addEventListener('click', () => {
        container.classList.remove('hidden');
        btnAdd.classList.add('hidden');
        input.focus();
    });

    // Cancelar creación
    btnCancel.addEventListener('click', () => {
        container.classList.add('hidden');
        btnAdd.classList.remove('hidden');
        input.value = '';
        if (errorEl) errorEl.classList.add('hidden');
    });

    // Guardar nueva categoría
    btnSave.addEventListener('click', async () => {
        await createNewCategory();
    });

    // También crear al presionar Enter
    input.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await createNewCategory();
        }
    });
}

/**
 * Crea una nueva categoría en la API y la añade al select
 */
async function createNewCategory() {
    const input = document.getElementById('new-category-name');
    const container = document.getElementById('new-category-container');
    const btnAdd = document.getElementById('btn-add-category');
    const btnSave = document.getElementById('btn-save-category');
    const errorEl = document.getElementById('category-error');
    const categorySelect = document.getElementById('category_id');

    const name = input.value.trim();

    if (!name) {
        showCategoryError('Por favor introduce un nombre para la categoría');
        return;
    }

    // Deshabilitar botón mientras se procesa
    btnSave.disabled = true;
    btnSave.textContent = 'Creando...';

    try {
        const newCategory = await fetchAPI(CONFIG.api.endpoints.categories, {
            method: 'POST',
            body: JSON.stringify({ name })
        });

        // Añadir al select
        const option = document.createElement('option');
        option.value = newCategory.id;
        option.textContent = newCategory.name;
        categorySelect.appendChild(option);

        // Seleccionar la nueva categoría
        categorySelect.value = newCategory.id;

        // Limpiar y ocultar input
        input.value = '';
        container.classList.add('hidden');
        btnAdd.classList.remove('hidden');
        if (errorEl) errorEl.classList.add('hidden');

    } catch (error) {
        console.error('Error creando categoría:', error);
        showCategoryError(error.message || 'Error al crear la categoría');
    } finally {
        btnSave.disabled = false;
        btnSave.textContent = 'Crear';
    }
}

/**
 * Muestra un mensaje de error en la sección de categorías
 */
function showCategoryError(message) {
    const errorEl = document.getElementById('category-error');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }
}

async function enableEditMode(id) {
    // Cambiar UI
    document.title = 'Civis · Editar Video';
    const titleEl = document.querySelector('.view-title');
    if (titleEl) titleEl.textContent = 'Editar Video';

    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Guardar Cambios';

    // Mostrar botón de eliminar y configurar handler
    const deleteBtn = document.getElementById('btn-delete-video');
    if (deleteBtn) {
        deleteBtn.classList.remove('hidden');

        // Desvincular handlers anteriores (aunque onclick sobrescribe, es buena práctica si usamos addEventListener)
        // Usar un handler limpio
        deleteBtn.onclick = (e) => {
            console.log('Click en eliminar video');
            e.preventDefault();
            e.stopPropagation(); // Detener propagación
            handleDeleteVideo(id);
        };
    }

    // Cargar datos
    try {
        const video = await fetchAPI(CONFIG.api.endpoints.videoById.replace(':id', id));

        document.getElementById('titulo').value = video.title || '';
        document.getElementById('url_video').value = video.url || '';
        document.getElementById('descripcion').value = video.description || '';
        document.getElementById('process_start_date').value = video.process_start_date || '';
        document.getElementById('process_end_date').value = video.process_end_date || '';

        // Esperar un momento para asegurar que las categorías cargaron
        const catSelect = document.getElementById('category_id');
        if (catSelect && video.category_id) {
            catSelect.value = video.category_id;
        } else if (catSelect && video.category && video.category.id) {
            catSelect.value = video.category.id;
        }

    } catch (error) {
        console.error('Error cargando video para editar:', error);
        alert('Error al cargar datos del video.');
        window.location.href = 'index.html';
    }
}

/**
 * Maneja la eliminación de un video usando modal personalizado
 */
let currentVideoIdToDelete = null;

function handleDeleteVideo(videoId) {
    console.log('Abriendo modal para eliminar video', videoId);
    currentVideoIdToDelete = videoId;
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.classList.remove('hidden');
        // Asegurar que se visualiza
        modal.style.display = 'flex';
    } else {
        console.error('No se encontró el modal #delete-modal');
        // Fallback a confirm nativo si falla el modal
        if (confirm('¿Estás seguro de eliminar este video?')) {
            performDelete(videoId);
        }
    }
}

/**
 * Configura los event listeners del modal de eliminación
 */
function setupDeleteModal() {
    const modal = document.getElementById('delete-modal');
    const cancelBtn = document.getElementById('modal-cancel');
    const confirmBtn = document.getElementById('modal-confirm');

    if (!modal || !cancelBtn || !confirmBtn) return;

    // Función para cerrar modal limpia
    const closeModal = () => {
        modal.classList.add('hidden');
        modal.style.display = ''; // Limpiar inline style si se usó
        currentVideoIdToDelete = null;
    };

    // Cancelar - cerrar modal
    cancelBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
    };

    // Confirmar eliminación
    confirmBtn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentVideoIdToDelete) return;

        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Eliminando...';

        await performDelete(currentVideoIdToDelete, confirmBtn, closeModal);
    };

    // Cerrar modal al hacer clic fuera (en el overlay)
    modal.onclick = (e) => {
        if (e.target === modal) {
            console.log('Click en background del modal -> cerrar');
            closeModal();
        }
    };
}

// Nueva función separada para la lógica de borrado API
async function performDelete(videoId, btnElement = null, callback = null) {
    try {
        await fetchAPI(CONFIG.api.endpoints.videoById.replace(':id', videoId), {
            method: 'DELETE'
        });

        if (callback) callback();
        alert('Video eliminado correctamente.');
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Error eliminando video:', error);
        alert('Error al eliminar el video: ' + (error.message || 'Error desconocido'));

        if (btnElement) {
            btnElement.disabled = false;
            btnElement.textContent = 'Sí, eliminar';
        }
    }
}

/**
 * Carga las categorías y rellena el select
 */
async function loadCategories() {
    const categorySelect = document.getElementById('category_id');
    if (!categorySelect) return;

    try {
        const response = await fetchAPI(CONFIG.api.endpoints.categories);
        const categories = response.data || response; // Handle {data: []} or []

        // Limpiar opciones (manteniendo la default)
        categorySelect.innerHTML = '<option value="" disabled selected>Selecciona una categoría</option>';

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error cargando categorías:', error);
        categorySelect.innerHTML = '<option value="" disabled>Error al cargar categorías</option>';
    }
}

/**
 * Maneja el envío del formulario de subida (o edición)
 */
async function handleUploadSubmit(e, videoId = null) {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const successMsg = document.getElementById('upload-success-message');
    const form = e.target;

    // Obtener datos
    const title = document.getElementById('titulo').value;
    const url = document.getElementById('url_video').value;
    const description = document.getElementById('descripcion').value;
    const categoryId = document.getElementById('category_id').value;

    if (!categoryId) {
        alert('Por favor selecciona una categoría');
        return;
    }

    // Validar URL (Usando API nativa para máxima compatibilidad)
    try {
        new URL(url);
    } catch (_) {
        alert('Por favor introduce una URL válida (ej: https://...)');
        return;
    }

    // Deshabilitar botón
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Publicando...';
    }

    const videoData = {
        title: title,
        url: url,
        description: description,
        category_id: categoryId,
        categoryId: categoryId,
        process_start_date: document.getElementById('process_start_date').value || null,
        process_end_date: document.getElementById('process_end_date').value || null,
        // duration: null, // Opcional
    };

    const isEdit = !!videoId;
    const endpoint = isEdit ? CONFIG.api.endpoints.videoById.replace(':id', videoId) : CONFIG.api.endpoints.videos;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        await fetchAPI(endpoint, {
            method: method,
            body: JSON.stringify(videoData)
        });

        // Mostrar éxito
        if (successMsg) {
            successMsg.textContent = isEdit ? '¡Video actualizado correctamente!' : '¡Video publicado correctamente!';
            successMsg.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'border-red-200');
            successMsg.classList.add('bg-green-50', 'text-green-700', 'border', 'border-green-200', 'show'); // show class for styles if any
            successMsg.style.display = 'block'; // Ensure visibility
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Resetear formulario (solo si es nuevo)
        if (!isEdit) {
            form.reset();
        }

        // Restaurar botón después de unos segundos
        setTimeout(() => {
            if (successMsg) successMsg.classList.add('hidden');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Publicar Video';
            }
        }, 3000);

    } catch (error) {
        console.error('Error al subir video:', error);

        // Mostrar error
        if (successMsg) {
            successMsg.textContent = error.message || 'Error al publicar el video';
            successMsg.classList.remove('hidden', 'bg-green-50', 'text-green-700', 'border-green-200');
            successMsg.classList.add('bg-red-50', 'text-red-700', 'border', 'border-red-200');
            successMsg.style.display = 'block';
        }

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Publicar Video';
        }
    }
}
