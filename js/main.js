/* ============================================
   MAIN.JS - Message System & Comfort Mode
   ============================================ */

// Configuration
const CONFIG = {
  AUTH_KEY: "dailyComfortAuth",
  LAST_MESSAGE_DATE: "lastMessageDate",
  TODAY_MESSAGE_INDEX: "todayMessageIndex",
  MESSAGES_FILE: "data/messages.json",
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
};

// Global variables
let messagesData = null;
let sessionTimeout = null;

/* ============================================
   INITIALIZATION
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  // Check authentication first
  checkAuth();

  // Load messages and initialize
  loadMessages()
    .then(() => {
      initializeDailyMessage();
      initializeButtons();
      // Initialize auto-logout feature only after everything is loaded
      initializeSessionTimeout();
    })
    .catch((error) => {
      console.error("Failed to initialize home page:", error);
      // Show fallback message
      const messageElement = document.getElementById("dailyMessage");
      if (messageElement) {
        messageElement.textContent = "Welcome home! 💚";
      }
      initializeButtons();
      initializeSessionTimeout();
    });
});

/**
 * Check if user is authenticated
 * Redirect to login if not
 */
function checkAuth() {
  const isAuthenticated = localStorage.getItem(CONFIG.AUTH_KEY);

  if (isAuthenticated !== "true") {
    // Not logged in, redirect to login page (only once)
    if (window.location.pathname !== "/login.html") {
      window.location.href = "login.html";
    }
  }
}

/**
 * Initialize session timeout for auto-logout
 */
function initializeSessionTimeout() {
  // Set initial timeout
  resetSessionTimeout();

  // Reset timeout on user activity
  document.addEventListener("click", resetSessionTimeout);
  document.addEventListener("keypress", resetSessionTimeout);
  document.addEventListener("mousemove", resetSessionTimeout);
  document.addEventListener("scroll", resetSessionTimeout);
}

/**
 * Reset the session timeout (called on user activity)
 */
function resetSessionTimeout() {
  // Clear existing timeout
  if (sessionTimeout) {
    clearTimeout(sessionTimeout);
  }

  // Set new timeout
  sessionTimeout = setTimeout(() => {
    performAutoLogout();
  }, CONFIG.SESSION_TIMEOUT);
}

/**
 * Perform automatic logout
 */
function performAutoLogout() {
  // Clear auth data
  localStorage.removeItem(CONFIG.AUTH_KEY);

  // Show message and redirect
  alert("Your session has expired. Please log in again.");
  window.location.href = "index.html";
}

/**
 * Load messages from JSON file
 */
async function loadMessages() {
  try {
    const response = await fetch(CONFIG.MESSAGES_FILE);
    if (!response.ok) {
      throw new Error("Failed to load messages");
    }
    messagesData = await response.json();
    console.log("Messages loaded successfully");
  } catch (error) {
    console.error("Error loading messages:", error);
    // Fallback messages if file doesn't load
    messagesData = {
      daily: [
        "You are loved more than you know. 💚",
        "Your smile makes my whole day brighter.",
        "I'm so proud of you, always.",
        "You don't have to be perfect for me to love you.",
      ],
      extra: [
        "It's okay to rest today.",
        "You are more capable than you think.",
        "Bad days don't define you.",
        "Take it one step at a time.",
      ],
      comfort: [
        "I'm always here for you, no matter what.",
        "You've survived 100% of your worst days. You're doing amazing.",
        "Breathe. You are safe. You are loved.",
        "If today feels heavy, I wish I could hug you right now. 💚",
      ],
    };
  }
}

/* ============================================
   DAILY MESSAGE SYSTEM
   ============================================ */

/**
 * Initialize and display the daily message
 */
function initializeDailyMessage() {
  const today = getTodayDate();
  const lastDate = localStorage.getItem(CONFIG.LAST_MESSAGE_DATE);

  if (today !== lastDate) {
    // New day! Generate new message
    generateNewDailyMessage(today);
  } else {
    // Same day, show saved message
    displaySavedDailyMessage();
  }
}

/**
 * Get today's date as string (YYYY-MM-DD)
 */
function getTodayDate() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

/**
 * Generate and save a new daily message
 */
function generateNewDailyMessage(today) {
  const dailyMessages = messagesData.daily;
  const randomIndex = Math.floor(Math.random() * dailyMessages.length);
  const message = dailyMessages[randomIndex];

  // Save to localStorage
  localStorage.setItem(CONFIG.LAST_MESSAGE_DATE, today);
  localStorage.setItem(CONFIG.TODAY_MESSAGE_INDEX, randomIndex);

  // Display with animation
  displayMessage("dailyMessage", message);
}

/**
 * Display the saved daily message
 */
function displaySavedDailyMessage() {
  const savedIndex = localStorage.getItem(CONFIG.TODAY_MESSAGE_INDEX);
  const dailyMessages = messagesData.daily;

  if (savedIndex !== null && dailyMessages[savedIndex]) {
    displayMessage("dailyMessage", dailyMessages[savedIndex]);
  } else {
    // Fallback if no saved message
    generateNewDailyMessage(getTodayDate());
  }
}

/**
 * Display a message with fade-in animation
 */
function displayMessage(elementId, message) {
  const messageElement = document.getElementById(elementId);

  // Fade out
  messageElement.style.opacity = "0";

  setTimeout(() => {
    messageElement.textContent = message;
    // Fade in
    messageElement.style.transition = "opacity 0.5s ease-in";
    messageElement.style.opacity = "1";
  }, 300);
}

/* ============================================
   BUTTON INTERACTIONS
   ============================================ */

/**
 * Initialize all button event listeners
 */
function initializeButtons() {
  // Generate Message Button
  const generateBtn = document.getElementById("generateBtn");
  generateBtn.addEventListener("click", handleGenerateMessage);

  // Fox Clickable
  const foxClickable = document.getElementById("foxClickable");
  if (foxClickable) {
    foxClickable.addEventListener("click", openComfortModal);
  }

  // Close modal when clicking outside (on the modal background)
  const modal = document.getElementById("comfortModal");
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeComfortModal();
    }
  });
}

/**
 * Handle Generate Message button click
 */
function handleGenerateMessage() {
  const generateBtn = document.getElementById("generateBtn");
  const extraMessages = messagesData.extra;

  // Store original text
  const originalText = generateBtn.textContent;

  // Change button text to "Generating..."
  generateBtn.textContent = "Generating...";
  generateBtn.classList.add("loading");
  generateBtn.disabled = true;

  // Get random extra message
  const randomIndex = Math.floor(Math.random() * extraMessages.length);
  const message = extraMessages[randomIndex];

  // Display after short delay
  setTimeout(() => {
    displayMessage("dailyMessage", message);
    generateBtn.classList.remove("loading");
    generateBtn.textContent = originalText;
    generateBtn.disabled = false;
  }, 600);
}

/* ============================================
   COMFORT MODE MODAL
   ============================================ */

/**
 * Open comfort mode modal
 */
function openComfortModal() {
  const modal = document.getElementById("comfortModal");
  const comfortMessages = messagesData.comfort;

  // Get random comfort message
  const randomIndex = Math.floor(Math.random() * comfortMessages.length);
  const message = comfortMessages[randomIndex];

  // Display message
  document.getElementById("comfortMessage").textContent = message;

  // Show modal
  modal.classList.add("active");

  // Prevent body scroll and compensate for scrollbar
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = scrollbarWidth + "px";
}

/**
 * Close comfort mode modal
 */
function closeComfortModal() {
  const modal = document.getElementById("comfortModal");

  // Add closing animation
  modal.classList.add("closing");

  // Wait for animation to complete before hiding
  setTimeout(() => {
    modal.classList.remove("active");
    modal.classList.remove("closing");
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0px";
  }, 300); // 300ms matches the animation duration
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Get a random item from array
 */
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
