// ===== LÓGICA PARA SUBIR VIDEOS (ADMIN) =====

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar categorías al iniciar
    await loadCategories();

    // 2. Configurar botones de nueva categoría
    setupCategoryCreation();

    // 3. Comprobar si estamos en MODO EDICIÓN
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    if (videoId) {
        enableEditMode(videoId);
    }

    // 4. Manejar envío del formulario
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
        const newCategory = await fetchAPI('/categories', {
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

    // Mostrar botón de eliminar
    const deleteBtn = document.getElementById('btn-delete-video');
    if (deleteBtn) {
        deleteBtn.classList.remove('hidden');
        deleteBtn.addEventListener('click', () => handleDeleteVideo(id));
    }

    // Cargar datos
    try {
        const video = await fetchAPI(`/videos/${id}`);

        document.getElementById('titulo').value = video.title || '';
        document.getElementById('url_video').value = video.url || '';
        document.getElementById('descripcion').value = video.description || '';

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
 * Maneja la eliminación de un video
 */
async function handleDeleteVideo(videoId) {
    const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este video? Esta acción no se puede deshacer.');

    if (!confirmDelete) return;

    const deleteBtn = document.getElementById('btn-delete-video');
    if (deleteBtn) {
        deleteBtn.disabled = true;
        deleteBtn.textContent = 'Eliminando...';
    }

    try {
        await fetchAPI(`/videos/${videoId}`, {
            method: 'DELETE'
        });

        alert('Video eliminado correctamente.');
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Error eliminando video:', error);
        alert('Error al eliminar el video: ' + (error.message || 'Error desconocido'));

        if (deleteBtn) {
            deleteBtn.disabled = false;
            deleteBtn.textContent = 'Eliminar Video';
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
        const response = await fetchAPI('/categories');
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

    // Validar URL
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+$/;

    if (!ytRegex.test(url) && !vimeoRegex.test(url)) {
        alert('Por favor introduce una URL válida de YouTube o Vimeo');
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
        // duration: null, // Opcional
    };

    const isEdit = !!videoId;
    const endpoint = isEdit ? `/videos/${videoId}` : '/videos';
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
