/* ============================================
   AUTHENTICATION LOGIC - auth.js
   ============================================ */

// Configuration
const CONFIG = {
    // TODO: Change this to your actual special date!
    // Format: "DDMMYYYY" or "DDMMYY" or whatever format you prefer
    SECRET_PIN: "010523", // Replace with your actual date
    AUTH_KEY: "dailyComfortAuth",
    REDIRECT_PAGE: "home.html"
};

// Check if user is already logged in when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkExistingAuth();
    initializeLoginForm();
});

/**
 * Check if user is already authenticated
 * If yes, redirect to home page
 */
function checkExistingAuth() {
    const isAuthenticated = localStorage.getItem(CONFIG.AUTH_KEY);
    
    if (isAuthenticated === "true") {
        // User is already logged in, redirect to home
        window.location.href = CONFIG.REDIRECT_PAGE;
    }
}

/**
 * Initialize login form event listeners
 */
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const pinInput = document.getElementById('pinInput');
    const errorMessage = document.getElementById('errorMessage');
    
    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent page reload
        
        const enteredPin = pinInput.value.trim();
        
        // Validate PIN
        if (validatePin(enteredPin)) {
            // Success! Save auth and redirect
            handleSuccessfulLogin();
        } else {
            // Wrong PIN, show error
            handleFailedLogin(errorMessage, pinInput);
        }
    });
    
    // Clear error message when user starts typing again
    pinInput.addEventListener('input', function() {
        if (!errorMessage.classList.contains('hidden')) {
            errorMessage.classList.add('hidden');
        }
    });
}

/**
 * Validate the entered PIN
 * @param {string} pin - The PIN entered by user
 * @returns {boolean} - True if PIN is correct
 */
function validatePin(pin) {
    return pin === CONFIG.SECRET_PIN;
}

/**
 * Handle successful login
 */
function handleSuccessfulLogin() {
    const loginBtn = document.querySelector('.login-btn');
    
    // Add loading state
    loginBtn.classList.add('loading');
    loginBtn.textContent = 'Welcome';
    
    // Save authentication state
    localStorage.setItem(CONFIG.AUTH_KEY, "true");
    
    // Add smooth transition before redirect
    setTimeout(() => {
        window.location.href = CONFIG.REDIRECT_PAGE;
    }, 800);
}

/**
 * Handle failed login attempt
 * @param {HTMLElement} errorMessage - Error message element
 * @param {HTMLElement} pinInput - PIN input field
 */
function handleFailedLogin(errorMessage, pinInput) {
    // Show error message
    errorMessage.classList.remove('hidden');
    
    // Clear the input
    pinInput.value = '';
    
    // Shake the input field
    pinInput.style.animation = 'shake 0.5s';
    
    // Remove animation after it completes
    setTimeout(() => {
        pinInput.style.animation = '';
    }, 500);
    
    // Focus back on input
    pinInput.focus();
}

/* ============================================
   LOGOUT FUNCTIONALITY
   (Can be called from other pages)
   ============================================ */

/**
 * Logout user and redirect to landing page
 */
function logout() {
    localStorage.removeItem(CONFIG.AUTH_KEY);
    window.location.href = 'index.html';
}

// Make logout available globally
window.logout = logout;