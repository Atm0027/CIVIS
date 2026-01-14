// ===== SISTEMA DE AUTENTICACIÓN CIVIS =====

// Clave para almacenar usuarios en localStorage
const USERS_STORAGE_KEY = 'civis_users';
const CURRENT_USER_KEY = 'civis_current_user';
const SESSION_TOKEN_KEY = 'civis_session_token';

/**
 * Inicializa la base de datos de usuarios si no existe
 */
function initializeUsersDB() {
    const users = getFromLocalStorage(USERS_STORAGE_KEY);
    if (!users) {
        // Crear usuario por defecto para pruebas
        const defaultUsers = [
            {
                id: generateId(),
                username: 'demo',
                email: 'demo@civis.com',
                password: hashPassword('demo123'), // En producción usar bcrypt
                name: 'Usuario Demo',
                dni: '12345678A',
                phone: '666777888',
                address: 'Calle Principal 123',
                city: 'Madrid',
                postalCode: '28001',
                province: 'Madrid',
                country: 'España',
                dateOfBirth: '1995-05-15',
                avatarUrl: 'https://placehold.co/100x100/E0E7FF/4F46E5?text=UD',
                relevantData: 'Usuario de demostración del sistema',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: true
            }
        ];
        saveToLocalStorage(USERS_STORAGE_KEY, defaultUsers);
    }
}

/**
 * Hash simple de contraseña (EN PRODUCCIÓN USAR BCRYPT)
 * @param {string} password - Contraseña a hashear
 * @returns {string} - Hash de la contraseña
 */
function hashPassword(password) {
    // Esto es solo para demostración. En producción usar bcrypt o similar
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Object} - { success: boolean, message: string, user?: Object }
 */
function registerUser(userData) {
    const users = getFromLocalStorage(USERS_STORAGE_KEY) || [];

    // Validaciones
    if (!userData.username || userData.username.length < 3) {
        return { success: false, message: 'El nombre de usuario debe tener al menos 3 caracteres' };
    }

    if (!validateEmail(userData.email)) {
        return { success: false, message: 'El email no es válido' };
    }

    if (!userData.password || userData.password.length < 6) {
        return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find(u =>
        u.username === userData.username || u.email === userData.email
    );

    if (existingUser) {
        return {
            success: false,
            message: 'El usuario o email ya está registrado'
        };
    }

    // Crear nuevo usuario
    const newUser = {
        id: generateId(),
        username: userData.username,
        email: userData.email,
        password: hashPassword(userData.password),
        name: userData.name || userData.username,
        dni: userData.dni || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        postalCode: userData.postalCode || '',
        province: userData.province || '',
        country: userData.country || 'España',
        dateOfBirth: userData.dateOfBirth || '',
        avatarUrl: userData.avatarUrl || `https://placehold.co/100x100/E0E7FF/4F46E5?text=${userData.username.substring(0, 2).toUpperCase()}`,
        relevantData: userData.relevantData || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
    };

    users.push(newUser);
    saveToLocalStorage(USERS_STORAGE_KEY, users);

    return {
        success: true,
        message: 'Usuario registrado correctamente',
        user: sanitizeUser(newUser)
    };
}

/**
 * Inicia sesión de usuario
 * @param {string} usernameOrEmail - Usuario o email
 * @param {string} password - Contraseña
 * @returns {Object} - { success: boolean, message: string, user?: Object, token?: string }
 */
function loginUser(usernameOrEmail, password) {
    const users = getFromLocalStorage(USERS_STORAGE_KEY) || [];

    // Buscar usuario
    const user = users.find(u =>
        (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
        u.isActive
    );

    if (!user) {
        return {
            success: false,
            message: 'Usuario o contraseña incorrectos'
        };
    }

    // Verificar contraseña
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
        return {
            success: false,
            message: 'Usuario o contraseña incorrectos'
        };
    }

    // Generar token de sesión
    const sessionToken = generateSessionToken();

    // Guardar sesión
    saveToLocalStorage(SESSION_TOKEN_KEY, {
        token: sessionToken,
        userId: user.id,
        createdAt: new Date().toISOString()
    });

    saveToLocalStorage(CURRENT_USER_KEY, sanitizeUser(user));

    return {
        success: true,
        message: 'Inicio de sesión exitoso',
        user: sanitizeUser(user),
        token: sessionToken
    };
}

/**
 * Cierra la sesión del usuario actual
 */
function logoutUser() {
    removeFromLocalStorage(SESSION_TOKEN_KEY);
    removeFromLocalStorage(CURRENT_USER_KEY);
    return { success: true, message: 'Sesión cerrada correctamente' };
}

/**
 * Obtiene el usuario actualmente autenticado
 * @returns {Object|null} - Usuario actual o null
 */
function getCurrentUser() {
    const session = getFromLocalStorage(SESSION_TOKEN_KEY);
    if (!session) return null;

    // Verificar si la sesión es válida (menos de 24 horas)
    const sessionAge = new Date() - new Date(session.createdAt);
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas

    if (sessionAge > maxAge) {
        logoutUser();
        return null;
    }

    return getFromLocalStorage(CURRENT_USER_KEY);
}

/**
 * Verifica si hay un usuario autenticado
 * @returns {boolean}
 */
function isAuthenticated() {
    return getCurrentUser() !== null;
}

/**
 * Actualiza los datos del usuario actual
 * @param {Object} updates - Datos a actualizar
 * @returns {Object} - { success: boolean, message: string, user?: Object }
 */
function updateCurrentUser(updates) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return { success: false, message: 'No hay usuario autenticado' };
    }

    const users = getFromLocalStorage(USERS_STORAGE_KEY) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) {
        return { success: false, message: 'Usuario no encontrado' };
    }

    // Validar email si se está actualizando
    if (updates.email && !validateEmail(updates.email)) {
        return { success: false, message: 'El email no es válido' };
    }

    // Verificar si el email ya existe en otro usuario
    if (updates.email && updates.email !== users[userIndex].email) {
        const emailExists = users.find(u => u.email === updates.email && u.id !== currentUser.id);
        if (emailExists) {
            return { success: false, message: 'El email ya está en uso' };
        }
    }

    // Actualizar usuario
    const updatedUser = {
        ...users[userIndex],
        ...updates,
        id: users[userIndex].id, // No permitir cambiar el ID
        password: users[userIndex].password, // No permitir cambiar contraseña por aquí
        createdAt: users[userIndex].createdAt,
        updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    saveToLocalStorage(USERS_STORAGE_KEY, users);
    saveToLocalStorage(CURRENT_USER_KEY, sanitizeUser(updatedUser));

    return {
        success: true,
        message: 'Perfil actualizado correctamente',
        user: sanitizeUser(updatedUser)
    };
}

/**
 * Cambia la contraseña del usuario actual
 * @param {string} currentPassword - Contraseña actual
 * @param {string} newPassword - Nueva contraseña
 * @returns {Object} - { success: boolean, message: string }
 */
function changePassword(currentPassword, newPassword) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return { success: false, message: 'No hay usuario autenticado' };
    }

    const users = getFromLocalStorage(USERS_STORAGE_KEY) || [];
    const user = users.find(u => u.id === currentUser.id);

    if (!user) {
        return { success: false, message: 'Usuario no encontrado' };
    }

    // Verificar contraseña actual
    if (user.password !== hashPassword(currentPassword)) {
        return { success: false, message: 'La contraseña actual es incorrecta' };
    }

    // Validar nueva contraseña
    if (!newPassword || newPassword.length < 6) {
        return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' };
    }

    // Actualizar contraseña
    user.password = hashPassword(newPassword);
    user.updatedAt = new Date().toISOString();

    saveToLocalStorage(USERS_STORAGE_KEY, users);

    return { success: true, message: 'Contraseña actualizada correctamente' };
}

/**
 * Genera un token de sesión único
 * @returns {string} - Token de sesión
 */
function generateSessionToken() {
    return generateId() + '-' + Date.now().toString(36);
}

/**
 * Elimina la contraseña del objeto usuario para enviarlo al frontend
 * @param {Object} user - Usuario con contraseña
 * @returns {Object} - Usuario sin contraseña
 */
function sanitizeUser(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

/**
 * Protege una página requiriendo autenticación
 * Redirige a login si no está autenticado
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'pages/login.html';
        return false;
    }
    return true;
}

/**
 * Redirige a la página principal si ya está autenticado
 */
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = 'index.html';
        return true;
    }
    return false;
}

// Inicializar la base de datos de usuarios al cargar el script
initializeUsersDB();