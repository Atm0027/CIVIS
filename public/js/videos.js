// ===== LÓGICA PARA SUBIR VIDEOS (ADMIN) =====

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar categorías al iniciar
    await loadCategories();

    // 2. Manejar envío del formulario
    const form = document.getElementById('upload-form');
    if (form) {
        form.addEventListener('submit', handleUploadSubmit);
    }
});

/**
 * Carga las categorías y rellena el select
 */
async function loadCategories() {
    const categorySelect = document.getElementById('category_id');
    if (!categorySelect) return;

    try {
        const categories = await fetchAPI('/categories');

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
 * Maneja el envío del formulario de subida
 */
async function handleUploadSubmit(e) {
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

    try {
        await fetchAPI('/videos', {
            method: 'POST',
            body: JSON.stringify(videoData)
        });

        // Mostrar éxito
        if (successMsg) {
            successMsg.textContent = '¡Video publicado correctamente!';
            successMsg.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'border-red-200');
            successMsg.classList.add('bg-green-50', 'text-green-700', 'border', 'border-green-200', 'show'); // show class for styles if any
            successMsg.style.display = 'block'; // Ensure visibility
        }

        // Resetear formulario
        form.reset();

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
