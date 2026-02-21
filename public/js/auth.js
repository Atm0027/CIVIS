
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

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usernameOrEmail = usernameOrEmailInput.value.trim();
        const password = passwordInput.value;

        // Validación básica
        if (!usernameOrEmail || !password) {
            Toast.show({ message: 'Por favor, completa todos los campos', type: 'warning' });
            return;
        }

        // Deshabilitar botón mientras se procesa
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-sm"></span> Iniciando sesión...';

        try {
            await login(usernameOrEmail, password);
            window.location.href = 'index.html';

        } catch (error) {
            Toast.show({
                message: error.message || 'Error al iniciar sesión. Verifica tus credenciales.',
                type: 'error'
            });
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

    // Activar validación en tiempo real si el módulo está disponible
    if (typeof FormValidator !== 'undefined') {
        FormValidator.init(registerForm, {
            username: { minLength: 3, pattern: /^[a-zA-Z0-9_]+$/, patternMsg: 'Solo letras, números y guion bajo' },
            email: { isEmail: true },
            password: { minLength: 6 },
            'confirm-password': { matchField: 'password', matchMsg: 'Las contraseñas no coinciden' },
            name: { required: true },
            dni: { pattern: /^[0-9]{8}[A-Za-z]$/, patternMsg: 'Formato: 12345678A', optional: true },
            phone: { pattern: /^[6789][0-9]{8}$/, patternMsg: 'Teléfono español de 9 dígitos', optional: true },
            postalCode: { pattern: /^[0-9]{5}$/, patternMsg: '5 dígitos', optional: true },
        });
    }

    // obtener valor seguro de input
    const getVal = (input) => input ? input.value : '';

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Verificar validación en tiempo real si está activa
        if (typeof FormValidator !== 'undefined' && !FormValidator.isValid(registerForm)) {
            Toast.show({ message: 'Por favor, corrige los errores del formulario antes de continuar.', type: 'warning' });
            return;
        }

        const username = getVal(usernameInput).trim();
        const email = getVal(emailInput).trim();
        const password = getVal(passwordInput);
        const confirmPassword = getVal(confirmPasswordInput);
        const name = getVal(nameInput).trim();

        // Validaciones básicas (fallback si FormValidator no está activo)
        if (!username || !name || !email || !password || !confirmPassword) {
            Toast.show({ message: 'Por favor, completa todos los campos obligatorios', type: 'warning' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Toast.show({ message: 'Por favor, ingresa un email válido', type: 'error' });
            return;
        }

        if (password.length < 6) {
            Toast.show({ message: 'La contraseña debe tener al menos 6 caracteres', type: 'error' });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({ message: 'Las contraseñas no coinciden', type: 'error' });
            return;
        }

        // Deshabilitar botón mientras se procesa
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-sm"></span> Creando cuenta...';

        try {
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

            await register(userData);

            Toast.show({ message: '¡Cuenta creada con éxito! Redirigiendo...', type: 'success', duration: 3000 });

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1200);

        } catch (error) {
            Toast.show({
                message: error.message || 'Error al crear la cuenta. Intenta nuevamente.',
                type: 'error'
            });
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// ===== LOGOUT DEL USUARIO =====
async function logoutUser() {
    try {
        await logout();
    } catch (error) {
        // Error silencioso en logout — siempre se redirige
    }

    window.location.href = 'login.html';
}

// ===== AUTO-INICIALIZACIÓN SEGÚN EXISTENCIA DE ELEMENTOS =====
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('login-form')) {
        initLoginPage();
    }

    if (document.getElementById('register-form')) {
        initRegisterPage();
    }
});
