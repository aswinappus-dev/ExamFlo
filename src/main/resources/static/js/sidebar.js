/**
 * Creates the HTML structure for the sidebar based on authentication status.
 * @param {boolean} isAuthenticated - Whether the user is currently logged in.
 * @returns {string} - The HTML string for the sidebar.
 */
function createSidebarHTML(isAuthenticated) {
    // CSS classes for links (Tailwind)
    const linkClass = "sidebar-link flex items-center mt-2 py-2 px-6 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-md transition-all transform hover:scale-105";
    const activeLinkClass = "bg-gray-200/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100"; // Applied dynamically later

    // Reusable SVG icons (as functions for clarity)
    const HomeIcon = () => `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`;
    const SearchIcon = () => `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>`;
    const UserGroupIcon = () => `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`;
    const AboutIcon = () => `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    const SupportIcon = () => `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 1.846-1.21 3.4-3 3.86-1.02.28-2 .28-2 .28m0 0s-1 0-1 1v2m0 0s-1 0-1-1-1.405-2.28-2.288-3.162C4.305 10.22 4 9.477 4 8.64C4 6.63 5.63 5 7.64 5c1.29 0 2.48.53 3.36 1.36"></path></svg>`;
    const LoginIcon = () => `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>`;
    const LogoutIcon = () => `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>`;
    const DashboardIcon = () => `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`;
    const StudentsIcon = () => `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`;
    const HallsIcon = () => `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-11h1m-1 4h1m-1 4h1"></path></svg>`;
    const SlotsIcon = () => `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`;
    const NotificationIcon = () => `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>`;

    // Logo HTML (includes animation classes)
    const logoHTML = `
        <div class="flex items-center justify-center h-16 bg-gray-100 dark:bg-gray-900">
          <a href="/" class="sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" class="w-8 h-8 animated-svg-logo transition-transform duration-300 ease-in-out hover:scale-110">
              <rect x="10" y="10" width="100" height="100" rx="20" stroke="#1E88E5" stroke-width="6" fill="none" class="logo-frame" />
              <path d="M35 60 L52 77 L85 43" stroke="#1E88E5" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" class="logo-checkmark" />
              <path d="M15 80 Q55 95 105 60" stroke="#1E88E5" stroke-width="5" stroke-linecap="round" fill="none" class="logo-flow" />
            </svg>
          </a>
        </div>
    `;

    // Public navigation links
    const publicNav = `
        <a href="/" data-path="/" class="${linkClass}"> ${HomeIcon()} Home </a>
        <a href="/student.html" data-path="/student.html" class="${linkClass}"> ${SearchIcon()} Find My Seat </a>
        <a href="/invigilator.html" data-path="/invigilator.html" class="${linkClass}"> ${UserGroupIcon()} Invigilator Dashboard </a>
        <hr class="my-3 border-gray-200 dark:border-gray-700" />
        <a href="/about.html" data-path="/about.html" class="${linkClass}"> ${AboutIcon()} About </a>
        <a href="/support.html" data-path="/support.html" class="${linkClass}"> ${SupportIcon()} Support </a>
        <hr class="my-3 border-t border-gray-200 dark:border-gray-700" />
        <a href="/admin-login.html" data-path="/admin-login.html" class="${linkClass}"> ${LoginIcon()} Admin Login </a>
    `;

    // Admin navigation links
    const adminNav = `
        <a href="/admin/dashboard.html" data-path="/admin/dashboard.html" class="${linkClass}"> ${DashboardIcon()} Admin Dashboard </a>
        <a href="/admin/students.html" data-path="/admin/students.html" class="${linkClass}"> ${StudentsIcon()} Manage Students </a>
        <a href="/admin/halls.html" data-path="/admin/halls.html" class="${linkClass}"> ${HallsIcon()} Manage Halls </a>
        <a href="/admin/slots.html" data-path="/admin/slots.html" class="${linkClass}"> ${SlotsIcon()} Manage Slots </a>
        <hr class="my-3 border-gray-200 dark:border-gray-700" />
        <a href="/admin/notifications.html" data-path="/admin/notifications.html" class="${linkClass}"> ${NotificationIcon()} Notifications </a>
        <a href="/about.html" data-path="/about.html" class="${linkClass}"> ${AboutIcon()} About </a>
        <a href="/support.html" data-path="/support.html" class="${linkClass}"> ${SupportIcon()} Support </a>
        <hr class="my-3 border-t border-gray-200 dark:border-gray-700" />
        <button id="sidebar-logout-button" class="${linkClass} w-full text-left"> ${LogoutIcon()} Logout </button>
    `;

    // Return the full sidebar structure including overlay
    return `
        <div id="sidebar-overlay" class="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden hidden"></div>
        <div id="sidebar" class="fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out -translate-x-full">
            ${logoHTML}
            <div class="flex flex-col justify-between flex-1 overflow-y-auto">
                <nav class="px-2 py-4">
                    ${isAuthenticated ? adminNav : publicNav}
                </nav>
                 </div>
        </div>
    `;
}

/**
 * Initializes sidebar interactions (hover, click, active links, logout).
 */
function initializeSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) {
        console.error("Sidebar container (#sidebar-container) not found!");
        return;
    }

    // Check login state (using localStorage where token is stored)
    const isAuthenticated = !!localStorage.getItem('authToken');

    // Inject the correct sidebar HTML
    sidebarContainer.innerHTML = createSidebarHTML(isAuthenticated);

    // Get references to elements *after* HTML injection
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebarLinks = sidebar.querySelectorAll('nav a.sidebar-link'); // Select only nav links with class
    const hoverZone = document.getElementById('sidebar-hover-zone');
    const mobileToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebarLogoutButton = document.getElementById('sidebar-logout-button');
    const mainContent = document.getElementById('main-content'); // Main content area for padding adjustment

    if (!sidebar || !overlay) {
        console.error("Sidebar (#sidebar) or overlay (#sidebar-overlay) element not found after injection!");
        return;
    }

    // --- Sidebar Open/Close Functions ---
    const openSidebar = () => {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden'); // Show overlay for mobile
        // Adjust main content padding on desktop
        if (window.innerWidth >= 768 && mainContent) {
            mainContent.style.paddingLeft = '16rem'; // w-64 = 16rem
        }
        // Trigger logo animation by resetting the class
        const logo = sidebar.querySelector('.animated-svg-logo');
        if (logo) {
            logo.classList.remove('animated-svg-logo');
            void logo.offsetWidth; // Force reflow
            logo.classList.add('animated-svg-logo');
        }
    };

    const closeSidebar = () => {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden'); // Hide overlay
         // Reset main content padding on desktop
        if (window.innerWidth >= 768 && mainContent) {
            mainContent.style.paddingLeft = '0';
        }
    };

    // --- Event Listeners ---

    // Desktop: Open on hover zone enter
    if (hoverZone) {
       hoverZone.addEventListener('mouseenter', openSidebar);
    }
    // Desktop: Close when mouse leaves the sidebar area itself
    if (sidebar) {
       sidebar.addEventListener('mouseleave', closeSidebar);
    }

    // Mobile: Open on button click
    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering other listeners
            openSidebar();
        });
    }

    // Mobile: Close on overlay click
    overlay.addEventListener('click', closeSidebar);

    // Close sidebar when any navigation link is clicked
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Allow default navigation but still close the sidebar
            closeSidebar();
        });
    });

    // --- Active Link Highlighting ---
    const currentPath = window.location.pathname; // e.g., "/", "/admin/students.html"
    const activeLinkClass = "bg-gray-200/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 font-semibold"; // Added font-semibold
    sidebar.querySelectorAll('nav a').forEach(link => {
        const linkPath = link.getAttribute('data-path'); // Get the path stored in data-path
        if (linkPath) {
            // Exact match for home '/', endsWith for others to match file names
            if ((linkPath === '/' && currentPath === '/') || (linkPath !== '/' && currentPath.endsWith(linkPath))) {
                 link.classList.add(...activeLinkClass.split(' ')); // Apply active styles
                 link.setAttribute('aria-current', 'page'); // Improve accessibility
            }
        }
    });

    // --- Logout Button (Admin only) ---
    if (sidebarLogoutButton) {
        sidebarLogoutButton.addEventListener('click', async () => {
            // Clear authentication from localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            // Attempt to call backend logout endpoint (optional for JWT, good practice)
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
            } catch (error) {
                console.warn('Logout API call failed:', error);
            }
            // Redirect to the admin login page
            window.location.href = '/admin-login.html';
        });
    }

     // --- Adjust main content padding on resize ---
     // Ensures layout is correct if window size changes while sidebar is open/closed
     window.addEventListener('resize', () => {
         if (sidebar) {
              const isSidebarOpen = !sidebar.classList.contains('-translate-x-full');
              if (window.innerWidth >= 768) { // Check if on desktop size
                  mainContent.style.paddingLeft = isSidebarOpen ? '16rem' : '0';
              } else {
                  mainContent.style.paddingLeft = '0'; // No padding on mobile
              }
         }
     });

     // Initial padding adjustment check
     const isSidebarOpenInitially = !sidebar.classList.contains('-translate-x-full');
     if (window.innerWidth >= 768 && isSidebarOpenInitially && mainContent) {
         mainContent.style.paddingLeft = '16rem';
     }

}

// Make sure initializeSidebar is called, usually from main.js or after DOM content is loaded
// Example (if this file is loaded directly):
// document.addEventListener('DOMContentLoaded', initializeSidebar);