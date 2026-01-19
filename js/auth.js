
// ===== SISTEMA DE AUTENTICACIÓN - CIVIS =====
// Este archivo maneja la lógica de autenticación en las páginas de login/register

// ===== INICIALIZACIÓN DE PÁGINA DE LOGIN =====
function initLoginPage() {
    // Verificar si ya está autenticado
    if (hasToken()) {
        window.location.href = '../index.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const errorContainer = document.getElementById('login-error');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validación básica
        if (!email || !password) {
            showAuthError(errorContainer, 'Por favor, completa todos los campos');
            return;
        }

        if (!validateEmail(email)) {
            showAuthError(errorContainer, 'Por favor, ingresa un email válido');
            return;
        }

        // Deshabilitar botón mientras se procesa
        submitButton.disabled = true;
        submitButton.textContent = 'Iniciando sesión...';
        errorContainer.classList.add('hidden');

        try {
            // Llamar a la API de login
            await login(email, password);

            // Si llega aquí, el login fue exitoso
            window.location.href = '../index.html';

        } catch (error) {
            showAuthError(errorContainer, error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
            submitButton.disabled = false;
            submitButton.textContent = 'Iniciar Sesión';
        }
    });
}

// ===== INICIALIZACIÓN DE PÁGINA DE REGISTRO =====
function initRegisterPage() {
    // Verificar si ya está autenticado
    if (hasToken()) {
        window.location.href = '../index.html';
        return;
    }

    const registerForm = document.getElementById('register-form');
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const errorContainer = document.getElementById('register-error');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validaciones
        if (!name || !email || !password || !confirmPassword) {
            showAuthError(errorContainer, 'Por favor, completa todos los campos');
            return;
        }

        if (!validateEmail(email)) {
            showAuthError(errorContainer, 'Por favor, ingresa un email válido');
            return;
        }

        if (password.length < 6) {
            showAuthError(errorContainer, 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            showAuthError(errorContainer, 'Las contraseñas no coinciden');
            return;
        }

        // Deshabilitar botón mientras se procesa
        submitButton.disabled = true;
        submitButton.textContent = 'Creando cuenta...';
        errorContainer.classList.add('hidden');

        try {
            // Llamar a la API de registro
            await register({ name, email, password });

            // Si llega aquí, el registro fue exitoso
            // Redirigir al index (ya estará logueado)
            window.location.href = '../index.html';

        } catch (error) {
            showAuthError(errorContainer, error.message || 'Error al crear la cuenta. Intenta nuevamente.');
            submitButton.disabled = false;
            submitButton.textContent = 'Crear Cuenta';
        }
    });
}

// ===== FUNCIÓN AUXILIAR PARA MOSTRAR ERRORES =====
function showAuthError(container, message) {
    container.textContent = message;
    container.classList.remove('hidden');
}

// ===== LOGOUT DEL USUARIO =====
async function logoutUser() {
    try {
        await logout(); // Llamar al endpoint de logout
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
    
    // Redirigir siempre al login
    window.location.href = 'pages/login.html';
}

// ===== AUTO-INICIALIZACIÓN SEGÚN LA PÁGINA =====
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    if (currentPath.includes('login.html')) {
        initLoginPage();
    } else if (currentPath.includes('register.html')) {
        initRegisterPage();
    }
});