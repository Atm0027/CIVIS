// ===== DETALLE DE VIDEO (plantilla.html) =====

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verificar Autenticación
    let currentUser = null;
    try {
        currentUser = getCurrentUserFromStorage();
        if (!currentUser && hasToken()) {
            currentUser = await getUserProfile();
            saveCurrentUser(currentUser);
        }
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }
        // Fill basic user info
        const userNameEl = document.getElementById('user-name');
        const userEmailEl = document.getElementById('user-email');

        if (userNameEl) userNameEl.textContent = currentUser.name || 'Usuario';
        if (userEmailEl) userEmailEl.textContent = currentUser.email || '';

        // SETUP ADMIN UI
        if (currentUser.role === 'admin') {
            const adminSection = document.getElementById('admin-section');
            if (adminSection) adminSection.classList.remove('hidden');

            // Edit button handler will be set after getting videoId
        }
    } catch (error) {
        console.error('Session error:', error);
        removeToken();
        window.location.href = 'login.html';
        return;
    }

    // 2. Obtener ID del video de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    if (!videoId) {
        alert('No se especificó un video.');
        window.location.href = 'index.html';
        return;
    }

    // Update Edit Button Link (if admin)
    const editBtn = document.getElementById('btn-edit-video');
    if (editBtn) {
        editBtn.onclick = () => window.location.href = `videos.html?id=${videoId}`;
    }

    // 3. Cargar datos del video
    try {
        await loadVideoDetails(videoId);
    } catch (error) {
        console.error('Error loading video:', error);
        const titleEl = document.getElementById('video-title-text');
        const descEl = document.getElementById('video-description');

        if (titleEl) titleEl.textContent = 'Error al cargar el video';
        if (descEl) descEl.innerHTML = `<p class="error-text">No se pudo cargar el video. ${error.message}</p>`;
    }
});

async function loadVideoDetails(id) {
    console.log('--- DEPURACIÓN VIDEO ---');
    console.log('ID solicitado:', id);

    // Fetch video data
    const video = await getVideoById(id);
    console.log('Datos del video recibidos:', video);
    console.log('URL del video:', video.url);

    // Update DOM
    document.title = `Civis · ${video.title}`;

    const titleEl = document.getElementById('video-title-text');
    const descEl = document.getElementById('video-description');

    if (titleEl) titleEl.textContent = video.title;
    if (descEl) {
        descEl.innerHTML = video.description
            ? `<p>${video.description.replace(/\n/g, '<br>')}</p>`
            : '<p>Sin descripción.</p>';
    }

    // Update Video Player
    const iframe = document.getElementById('video-iframe');
    const videoContainer = document.querySelector('.video-player');
    const embedUrl = getEmbedUrl(video.url);

    // Check if it's a direct video file
    const isDirectVideo = /\.(mp4|webm|ogg)$/i.test(video.url);
    // Check if it's NotebookLM
    const isNotebookLM = video.url && video.url.includes('notebooklm.google.com');

    // Reset container for fresh render
    if (videoContainer) {
        const existingVideo = videoContainer.querySelector('video');
        if (existingVideo) existingVideo.remove();
        const existingOverlay = videoContainer.querySelector('.notebooklm-overlay');
        if (existingOverlay) existingOverlay.remove();
    }

    if (iframe) iframe.style.display = 'none';

    if (isDirectVideo && videoContainer) {
        const videoHtml = `
            <video controls class="w-full h-full rounded-lg shadow-lg">
                <source src="${video.url}" type="video/${video.url.split('.').pop()}">
                Tu navegador no soporta la reproducción de video.
            </video>
        `;
        videoContainer.insertAdjacentHTML('beforeend', videoHtml);
    } else if (isNotebookLM && videoContainer) {
        // SOLUTION: Load in iframe but keep it hidden until overlay is removed
        if (iframe) {
            iframe.style.display = 'none';
            iframe.src = video.url;
        }

        const overlayHtml = `
            <div class="notebooklm-overlay">
                <div class="notebooklm-overlay-icon">
                    <svg class="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24" style="width: 48px; height: 48px;">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                    </svg>
                </div>
                <h2>NotebookLM Overview</h2>
                <p>
                    Este contenido es una generación de NotebookLM. Google puede restringir su visualización directa aquí.
                </p>
                <div class="notebooklm-actions">
                    <a href="${video.url}" target="_blank" class="btn-notebooklm-primary">
                        <span>Abrir en NotebookLM</span>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                    <button onclick="const ov = this.closest('.notebooklm-overlay'); if(ov) ov.remove(); document.getElementById('video-iframe').style.display='block';" class="btn-notebooklm-secondary">
                        Intentar ver aquí de todos modos
                    </button>
                </div>
            </div>
        `;
        videoContainer.classList.add('relative'); // Apply utility
        videoContainer.insertAdjacentHTML('beforeend', overlayHtml);
    } else if (embedUrl && iframe) {
        iframe.style.display = 'block';
        iframe.src = embedUrl;
    } else if (videoContainer) {
        videoContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full p-5 bg-white text-gray-900 rounded-lg shadow-md">
                <svg width="64" height="64" class="mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <p class="text-lg font-medium mb-4 text-center">No se puede reproducir este enlace directamente</p>
                <a href="${video.url}" target="_blank" class="btn-notebooklm-primary">
                    Ver en pestaña nueva
                </a>
            </div>
        `;
    }

    // Update Meta/Tags (Category)
    const metaContainer = document.getElementById('video-meta-container');
    if (metaContainer) {
        metaContainer.innerHTML = '';

        if (video.category) {
            metaContainer.innerHTML += `<span class="meta-tag" style="background-color: #e0f2fe; color: #0369a1;">${video.category.name}</span>`;
        }

        if (video.tags && Array.isArray(video.tags)) {
            video.tags.forEach(tag => {
                metaContainer.innerHTML += `<span class="meta-tag" style="background-color: #f1f5f9; color: #475569;">${tag.name || tag}</span>`;
            });
        }
    }
}

/**
 * Convierte URL de YouTube/Vimeo a Embed URL
 */
function getEmbedUrl(url) {
    if (!url) return null;

    // YouTube
    // Supports: youtube.com/watch?v=ID, youtube.com/embed/ID, youtu.be/ID
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Return original if likely already an embed or unknown (fallback)
    // This allows platforms like NotebookLM or others with embed links to work
    return url;
}
