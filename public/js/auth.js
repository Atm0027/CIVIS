
// ===== SISTEMA DE AUTENTICACIÓN - CIVIS =====
// Este archivo maneja la lógica de autenticación en las páginas de login/register

// ===== INICIALIZACIÓN DE PÁGINA DE LOGIN =====
function initLoginPage() {
    // Verificar si ya está autenticado
    if (hasToken()) {
        window.location.href = 'index.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const usernameOrEmailInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const errorContainer = document.getElementById('message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usernameOrEmail = usernameOrEmailInput.value.trim();
        const password = passwordInput.value;

        // Validación básica
        if (!usernameOrEmail || !password) {
            showAuthError(errorContainer, 'Por favor, completa todos los campos');
            return;
        }

        // Deshabilitar botón mientras se procesa
        submitButton.disabled = true;
        submitButton.textContent = 'Iniciando sesión...';
        errorContainer.classList.add('hidden');

        try {
            // Llamar a la API de login (ahora acepta usuario o email)
            await login(usernameOrEmail, password);

            // Si llega aquí, el login fue exitoso
            window.location.href = 'index.html';

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
        window.location.href = 'index.html';
        return;
    }

    const registerForm = document.getElementById('register-form');
    // Mapear campos según los IDs en register.html
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const dniInput = document.getElementById('dni');
    const phoneInput = document.getElementById('phone');
    const dateOfBirthInput = document.getElementById('dateOfBirth');
    const addressInput = document.getElementById('address');
    const cityInput = document.getElementById('city');
    const postalCodeInput = document.getElementById('postalCode');
    const provinceInput = document.getElementById('province');

    const submitButton = registerForm.querySelector('button[type="submit"]');
    const messageContainer = document.getElementById('message');

    // validar email
    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // obtener valor seguro de input
    const getVal = (input) => input ? input.value : '';

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log('Formulario enviado'); // Debug

        try {
            const username = getVal(usernameInput).trim();
            const email = getVal(emailInput).trim();
            const password = getVal(passwordInput);
            const confirmPassword = getVal(confirmPasswordInput);
            const name = getVal(nameInput).trim();

            // Validaciones básicas
            if (!username || !name || !email || !password || !confirmPassword) {
                showAuthError(messageContainer, 'Por favor, completa todos los campos obligatorios');
                return;
            }

            if (!isValidEmail(email)) {
                showAuthError(messageContainer, 'Por favor, ingresa un email válido');
                return;
            }

            if (password.length < 6) {
                showAuthError(messageContainer, 'La contraseña debe tener al menos 6 caracteres');
                return;
            }

            if (password !== confirmPassword) {
                showAuthError(messageContainer, 'Las contraseñas no coinciden');
                return;
            }

            // Deshabilitar botón mientras se procesa
            submitButton.disabled = true;
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Creando cuenta...';
            messageContainer.classList.add('hidden');

            try {
                // Preparar datos completos para la API
                const userData = {
                    username,
                    email,
                    password,
                    name,
                    surname: getVal(surnameInput).trim() || null,
                    dni: getVal(dniInput).trim() || null,
                    phone: getVal(phoneInput).trim() || null,
                    dateOfBirth: getVal(dateOfBirthInput) || null,
                    address: getVal(addressInput).trim() || null,
                    city: getVal(cityInput).trim() || null,
                    postalCode: getVal(postalCodeInput).trim() || null,
                    province: getVal(provinceInput).trim() || null
                };

                // Llamar a la API de registro
                await register(userData);

                // Si llega aquí, el registro fue exitoso
                messageContainer.textContent = '¡Registro exitoso! Iniciando sesión...';
                messageContainer.classList.remove('hidden', 'message-error');
                messageContainer.classList.add('message-success');

                // Redirigir al index después de un breve delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);

            } catch (error) {
                console.error('API Error:', error);
                showAuthError(messageContainer, error.message || 'Error al crear la cuenta. Intenta nuevamente.');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        } catch (err) {
            console.error('Critical Error in Register Handler:', err);
            alert('Error interno en el formulario: ' + err.message);
        }
    });
}

// ===== FUNCIÓN AUXILIAR PARA MOSTRAR ERRORES =====
function showAuthError(container, message) {
    container.textContent = message;
    container.classList.remove('hidden', 'message-success');
    container.classList.add('message-error');
}

// ===== LOGOUT DEL USUARIO =====
async function logoutUser() {
    try {
        await logout(); // Llamar al endpoint de logout
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }

    // Redirigir siempre al login
    window.location.href = 'login.html';
}

// ===== AUTO-INICIALIZACIÓN SEGÚN LA PÁGINA =====
// ===== AUTO-INICIALIZACIÓN SEGÚN EXISTENCIA DE ELEMENTOS =====
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si existe formulario de login
    if (document.getElementById('login-form')) {
        console.log('Iniciando página de Login...');
        initLoginPage();
    }

    // Verificar si existe formulario de registro
    if (document.getElementById('register-form')) {
        console.log('Iniciando página de Registro...');
        initRegisterPage();
    }
});
