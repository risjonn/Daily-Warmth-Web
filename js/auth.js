/* ============================================
   AUTHENTICATION LOGIC - auth.js
   ============================================ */

// Configuration
const CONFIG = {
  // TODO: Change this to your actual special date!
  // Format: "DDMMYYYY" or "DDMMYY" or whatever format you prefer
  SECRET_PIN: "010523", // Replace with your actual date
  AUTH_KEY: "dailyComfortAuth",
  REDIRECT_PAGE: "home.html",
};

// Check if user is already logged in when page loads
document.addEventListener("DOMContentLoaded", function () {
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
  const loginForm = document.getElementById("loginForm");
  const pinInput = document.getElementById("pinInput");
  const errorMessage = document.getElementById("errorMessage");

  if (!loginForm || !pinInput) return;

  // Store actual PIN value
  let actualValue = "";

  // Handle input to show hearts
  pinInput.addEventListener("input", function (e) {
    const inputValue = e.target.value;

    // Check if user is deleting (backspace)
    if (inputValue.length < actualValue.length) {
      actualValue = actualValue.slice(0, inputValue.length);
    } else {
      // User is typing - get the new character
      const newChar = inputValue[inputValue.length - 1];
      // Only add if it's not already a heart
      if (newChar !== "♥") {
        actualValue += newChar;
      }
    }

    if (actualValue.length > 0) {
      pinInput.classList.add("typing");
      // Display hearts
      e.target.value = "♥".repeat(actualValue.length);
    } else {
      pinInput.classList.remove("typing");
    }

    // Clear error message when user starts typing
    if (!errorMessage.classList.contains("hidden")) {
      errorMessage.classList.add("hidden");
    }
  });

  // Handle form submission
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Use actual value for validation
    if (validatePin(actualValue)) {
      // Success! Show celebration and redirect
      createHeartBurst();
      handleSuccessfulLogin();
    } else {
      // Wrong PIN, show error
      handleFailedLogin(errorMessage, pinInput);
      actualValue = "";
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
  const loginBtn = document.querySelector(".login-btn");
  const pinInput = document.getElementById("pinInput");

  // Hide the input field to prevent hearts showing during celebration
  if (pinInput) {
    pinInput.style.display = "none";
  }

  // Add loading state
  loginBtn.classList.add("loading");
  loginBtn.textContent = "Welcome";

  // Save authentication state
  localStorage.setItem(CONFIG.AUTH_KEY, "true");

  // Wait for heart burst animation to complete before redirect
  setTimeout(() => {
    window.location.href = CONFIG.REDIRECT_PAGE;
  }, 1800);
}

/**
 * Handle failed login attempt
 * @param {HTMLElement} errorMessage - Error message element
 * @param {HTMLElement} pinInput - PIN input field
 */
function handleFailedLogin(errorMessage, pinInput) {
  // Show error message
  errorMessage.classList.remove("hidden");

  // Clear the input
  pinInput.value = "";
  pinInput.classList.remove("typing");

  // Shake the input field
  pinInput.style.animation = "shake 0.5s";

  // Remove animation after it completes
  setTimeout(() => {
    pinInput.style.animation = "";
  }, 500);

  // Focus back on input
  pinInput.focus();
}

/**
 * Create full-screen heart celebration animation - floating upward
 */
function createHeartBurst() {
  const celebrationContainer = document.createElement("div");
  celebrationContainer.className = "heart-celebration";

  // Create 50 hearts floating up from bottom
  for (let i = 0; i < 50; i++) {
    const heart = document.createElement("span");
    heart.className = "celebration-heart";
    heart.textContent = "♥";

    // Random horizontal position across screen width
    const leftPosition = Math.random() * 100;
    // Random size variation - larger hearts
    const size = 2 + Math.random() * 2.5; // 2rem to 4.5rem
    // Random delay for staggered effect
    const delay = i * 0.03;
    // Random duration for variety
    const duration = 1.2 + Math.random() * 0.6; // 1.2s to 1.8s

    heart.style.setProperty("--left-pos", `${leftPosition}%`);
    heart.style.setProperty("--size", `${size}rem`);
    heart.style.animationDelay = `${delay}s`;
    heart.style.animationDuration = `${duration}s`;

    celebrationContainer.appendChild(heart);
  }

  document.body.appendChild(celebrationContainer);

  // Remove after animation completes
  setTimeout(() => {
    celebrationContainer.remove();
  }, 2500);
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
  window.location.href = "index.html";
}

// Make logout available globally
window.logout = logout;
