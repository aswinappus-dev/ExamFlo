// --- Theme Toggle Logic (from ThemeToggle.tsx) ---
function initializeThemeToggle() {
    // Check if the button already exists to prevent duplicates
    if (document.getElementById('theme-toggle-button')) {
        return;
    }

    const themeToggleButton = document.createElement('button');
    themeToggleButton.id = 'theme-toggle-button'; // Add an ID
    themeToggleButton.setAttribute('aria-label', 'Toggle dark mode');
    themeToggleButton.className = "fixed top-5 right-5 z-50 p-2 rounded-full bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all shadow-lg";

    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;

    const root = document.documentElement;

    function updateIcon() {
        if (root.classList.contains('dark')) {
            themeToggleButton.innerHTML = sunIcon;
        } else {
            themeToggleButton.innerHTML = moonIcon;
        }
    }

    themeToggleButton.addEventListener('click', () => {
        if (root.classList.contains('dark')) {
            root.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            root.classList.add('dark');
            localStorage.theme = 'dark';
        }
        updateIcon();
    });

    updateIcon(); // Set initial icon
    // Append only if it doesn't exist
    if (!document.getElementById('theme-toggle-button')) {
         document.body.appendChild(themeToggleButton);
    }
}

// --- Helper for formatting dates (Can be used by other JS files) ---
function formatDateTime(isoString) {
    if (!isoString) return 'N/A';
    try {
        const date = new Date(isoString);
        // Basic check for invalid date
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        return date.toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true // Example format
        });
    } catch(e) {
        console.error("Error formatting date:", isoString, e);
        return 'Invalid Date';
    }
}

// --- Get Auth Token Helper ---
// Central place to get the token, can add validation later if needed
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// --- Create Auth Headers Helper ---
// Creates the headers object needed for authenticated API calls
function createAuthHeaders() {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json', // Default content type
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// --- Check Auth and Redirect Helper ---
// Use this at the start of admin pages
function checkAuthAndRedirect() {
    const token = getAuthToken();
    // Allow access also on the login page itself to avoid redirect loop
    if (!token && window.location.pathname !== '/admin-login.html') {
        console.log("No auth token found, redirecting to login.");
        window.location.href = '/admin-login.html';
        return false; // Indicate redirection is happening
    }
     // Optional: Add token validation check here if needed in future
    return true; // Indicate user is likely authenticated
}


// --- Initialize Common Elements ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sidebar logic (expects sidebar.js to be loaded)
    if (typeof initializeSidebar === 'function') {
        initializeSidebar();
    } else {
        console.error("initializeSidebar function not found. Make sure sidebar.js is loaded before main.js or included in the page.");
    }
    // Initialize theme toggle button
    initializeThemeToggle();

    // Initialize live background (expects live-background.js to be loaded)
    if (typeof initializeLiveBackground === 'function') {
        const canvas = document.getElementById('live-background-canvas');
        if (canvas) { // Only initialize if the canvas exists on the page
             initializeLiveBackground();
        }
    } else {
         console.warn("initializeLiveBackground function not found. Include live-background.js if needed.");
    }

});
