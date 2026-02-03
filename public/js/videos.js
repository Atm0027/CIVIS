// ===== LÓGICA PARA SUBIR VIDEOS (ADMIN) =====

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar categorías al iniciar
    await loadCategories();

    // 2. Comprobar si estamos en MODO EDICIÓN
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    if (videoId) {
        enableEditMode(videoId);
    }

    // 3. Manejar envío del formulario
    const form = document.getElementById('upload-form');
    if (form) {
        form.addEventListener('submit', (e) => handleUploadSubmit(e, videoId));
    }
});

async function enableEditMode(id) {
    // Cambiar UI
    document.title = 'Civis · Editar Video';
    const titleEl = document.querySelector('.view-title');
    if (titleEl) titleEl.textContent = 'Editar Video';

    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Guardar Cambios';

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
