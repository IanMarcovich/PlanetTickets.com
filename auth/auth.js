/* ===== PLANETTICKETS.COM - AUTHENTICATION MODULE ===== */
/* Handles user registration, login, logout, and session management */
/* Uses localStorage for client-side user data persistence */

// ===== DOM CONTENT LOADED INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthForms();
});

// ===== AUTHENTICATION FORM INITIALIZATION =====
function initializeAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Initialize registration form if present
    if (registerForm) {
        setupRegistrationForm(registerForm);
    }

    // Initialize login form if present
    if (loginForm) {
        setupLoginForm(loginForm);
    }
}

// ===== UTILITY FUNCTIONS =====
/**
 * Display a message to the user with styling based on type
 * @param {string} message - The message to display
 * @param {string} type - Message type ('success' or 'error')
 */
function showMessage(message, type) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = message;
    messageContainer.className = `message-${type}`;
    messageContainer.style.display = 'block';
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}

/**
 * Validate email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password meets minimum requirements
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password is valid
 */
function isValidPassword(password) {
    return password.length >= 8;
}

// ===== REGISTRATION FUNCTIONALITY =====
/**
 * Setup registration form event handling and validation
 * @param {HTMLElement} registerForm - The registration form element
 */
function setupRegistrationForm(registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate input data
        if (!validateRegistrationData(name, email, password, confirmPassword)) {
            return;
        }
        
        // Check if user already exists
        const users = getStoredUsers();
        if (users.find(user => user.email === email)) {
            showMessage('Ya existe una cuenta con este email', 'error');
            return;
        }
        
        // Create and save new user
        const newUser = createUser(name, email, password);
        users.push(newUser);
        saveUsers(users);
        
        // Log in the new user
        setCurrentUser(newUser);
        
        showMessage('¡Cuenta creada exitosamente! Redirigiendo...', 'success');
        
        // Check if there's a redirect URL saved from purchase attempt
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        
        // Redirect to appropriate page
        setTimeout(() => {
            if (redirectUrl) {
                // Clear the redirect URL from storage
                localStorage.removeItem('redirectAfterLogin');
                // Redirect to the artist page that was originally requested
                window.location.href = '../' + redirectUrl.split('/').slice(-2).join('/');
            } else {
                // Normal redirect to home page
                window.location.href = '../index.html';
            }
        }, 2000);
    });
}

/**
 * Validate registration form data
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} confirmPassword - Password confirmation
 * @returns {boolean} - True if all data is valid
 */
function validateRegistrationData(name, email, password, confirmPassword) {
    if (!name) {
        showMessage('Por favor ingresa tu nombre completo', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Por favor ingresa un email válido', 'error');
        return false;
    }
    
    if (!isValidPassword(password)) {
        showMessage('La contraseña debe tener al menos 8 caracteres', 'error');
        return false;
    }
    
    if (password !== confirmPassword) {
        showMessage('Las contraseñas no coinciden', 'error');
        return false;
    }
    
    return true;
}

// ===== LOGIN FUNCTIONALITY =====
/**
 * Setup login form event handling and validation
 * @param {HTMLElement} loginForm - The login form element
 */
function setupLoginForm(loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate input
        if (!isValidEmail(email)) {
            showMessage('Por favor ingresa un email válido', 'error');
            return;
        }
        
        if (!password) {
            showMessage('Por favor ingresa tu contraseña', 'error');
            return;
        }
        
        // Find user in stored users
        const users = getStoredUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            showMessage('Email o contraseña incorrectos', 'error');
            return;
        }
        
        // Set current user session
        setCurrentUser(user);
        
        showMessage('¡Sesión iniciada exitosamente! Redirigiendo...', 'success');
        
        // Check if there's a redirect URL saved from purchase attempt
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        
        // Redirect to appropriate page
        setTimeout(() => {
            if (redirectUrl) {
                // Clear the redirect URL from storage
                localStorage.removeItem('redirectAfterLogin');
                // Redirect to the artist page that was originally requested
                window.location.href = '../' + redirectUrl.split('/').slice(-2).join('/');
            } else {
                // Normal redirect to home page
                window.location.href = '../index.html';
            }
        }, 2000);
    });
}

// ===== USER DATA MANAGEMENT =====
/**
 * Create a new user object
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} - New user object
 */
function createUser(name, email, password) {
    return {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
}

/**
 * Get all users from localStorage
 * @returns {Array} - Array of user objects
 */
function getStoredUsers() {
    return JSON.parse(localStorage.getItem('planetTicketsUsers') || '[]');
}

/**
 * Save users array to localStorage
 * @param {Array} users - Array of user objects to save
 */
function saveUsers(users) {
    localStorage.setItem('planetTicketsUsers', JSON.stringify(users));
}

/**
 * Set current logged-in user in localStorage
 * @param {Object} user - User object to set as current
 */
function setCurrentUser(user) {
    const userSession = {
        id: user.id,
        name: user.name,
        email: user.email
    };
    localStorage.setItem('planetTicketsCurrentUser', JSON.stringify(userSession));
}

// ===== PUBLIC API FUNCTIONS =====
/**
 * Get current logged-in user
 * @returns {Object|null} - Current user object or null if not logged in
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('planetTicketsCurrentUser');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Log out current user and redirect to login page
 */
function logout() {
    localStorage.removeItem('planetTicketsCurrentUser');
    
    // Detect current directory for proper redirect path
    const currentPath = window.location.pathname;
    if (currentPath.includes('/artistas/') || currentPath.includes('/auth/')) {
        window.location.href = '../../auth/login.html';
    } else {
        window.location.href = 'auth/login.html';
    }
}

/**
 * Require user authentication - redirect to login if not authenticated
 * @returns {Object|boolean} - Current user object or false if not authenticated
 */
function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/auth/login.html';
        return false;
    }
    return user;
}