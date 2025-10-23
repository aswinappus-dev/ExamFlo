// Function to create the sidebar HTML
function createSidebarHTML(isAuthenticated) {
    const linkClass = "flex items-center mt-2 py-2 px-6 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-md transition-all transform hover:scale-105";
    const activeLinkClass = "bg-gray-200/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100"; // We'll add this dynamically

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

    const publicNav = `
        <a href="/" data-path="/" class="${linkClass}">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> Home
        </a>
        <a href="/student.html" data-path="/student.html" class="${linkClass}">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Find My Seat
        </a>
        <a href="/invigilator.html" data-path="/invigilator.html" class="${linkClass}">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> Invigilator Dashboard
        </a>
        <hr class="my-3 border-gray-200 dark:border-gray-700" />
        <a href="/about.html" data-path="/about.html" class="${linkClass}">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> About
        </a>
        <a href="/support.html" data-path="/support.html" class="${linkClass}">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 1.846-1.21 3.4-3 3.86-1.02.28-2 .28-2 .28m0 0s-1 0-1 1v2m0 0s-1 0-1-1-1.405-2.28-2.288-3.162C4.305 10.22 4 9.477 4 8.64C4 6.63 5.63 5 7.64 5c1.29 0 2.48.53 3.36 1.36"></path></svg> Support
        </a>
        <hr class="my-3 border-t border-gray-200 dark:border-gray-700" />
        <a href="/admin-login.html" data-path="/admin-login.html" class="${linkClass}">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg> Admin Login
        </a>
    `;

    const adminNav = `
        <a href="/admin/dashboard.html" data-path="/admin/dashboard.html" class="${linkClass}">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> Admin Dashboard
        </a>
        <a href="/admin/students.html" data-path="/admin/students.html" class="${linkClass}">
           <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> Manage Students
        </a>
        <a href="/admin/halls.html" data-path="/admin/halls.html" class="${linkClass}">
           <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-11h1m-1 4h1m-1 4h1"></path></svg> Manage Halls
        </a>
        <a href="/admin/slots.html" data-path="/admin/slots.html" class="${linkClass}">
           <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> Manage Slots
        </a>
        <hr class="my-3 border-gray-200 dark:border-gray-700" />
        <a href="/admin/notifications.html" data-path="/admin/notifications.html" class="${linkClass}">
           <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg> Notifications
        </a>
        <a href="/about.html" data-path="/about.html" class="${linkClass}">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> About
        </a>
        <a href="/support.html" data-path="/support.html" class="${linkClass}">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 1.846-1.21 3.4-3 3.86-1.02.28-2 .28-2 .28m0 0s-1 0-1 1v2m0 0s-1 0-1-1-1.405-2.28-2.288-3.162C4.305 10.22 4 9.477 4 8.64C4 6.63 5.63 5 7.64 5c1.29 0 2.48.53 3.36 1.36"></path></svg> Support
        </a>
        <hr class="my-3 border-t border-gray-200 dark:border-gray-700" />
        <button id="sidebar-logout-button" class="${linkClass} w-full">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Logout
        </button>
    `;

    return `
        <div id="sidebar-overlay" class="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden hidden"></div>
        <div id="sidebar" class="fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out -translate-x-full">
            ${logoHTML}
            <div class="flex flex-col justify-between flex-1 overflow-y-auto">
                <nav class="px-2 py-4">
                    ${isAuthenticated ? adminNav : publicNav}
                </nav>
            </div>
        </div>
    `;
}

// Function to initialize the sidebar
function initializeSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    const hoverZone = document.getElementById('sidebar-hover-zone');
    const mobileToggle = document.getElementById('mobile-sidebar-toggle');
    
    // Check login state (using the same logic as admin-login.js)
    const isAuthenticated = !!localStorage.getItem('authToken'); 

    // Inject sidebar HTML
    sidebarContainer.innerHTML = createSidebarHTML(isAuthenticated);

    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebarLinks = sidebar.querySelectorAll('.sidebar-link'); // Add class="sidebar-link" to all <a> tags inside sidebar nav

    const openSidebar = () => {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        // Trigger logo animation
        const logo = sidebar.querySelector('.animated-svg-logo');
        if (logo) {
            logo.classList.remove('animated-svg-logo'); // Remove to reset
            void logo.offsetWidth; // Trigger reflow
            logo.classList.add('animated-svg-logo'); // Re-add to restart animation
        }
    };
    const closeSidebar = () => {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    };

    // Desktop hover
    if (hoverZone) {
       hoverZone.addEventListener('mouseenter', openSidebar);
    }
    sidebarContainer.addEventListener('mouseleave', closeSidebar); // Close when mouse leaves the sidebar area

    // Mobile toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', openSidebar);
    }
    overlay.addEventListener('click', closeSidebar);

    // Close sidebar when a link is clicked
    sidebarLinks.forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // Highlight active link
    const currentPath = window.location.pathname;
    const activeLinkClass = "bg-gray-200/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100";
    sidebar.querySelectorAll('nav a').forEach(link => {
        const linkPath = link.getAttribute('data-path');
        // Handle exact match for home page, prefix match for others
        if ((linkPath === '/' && currentPath === '/') || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
             link.classList.add(...activeLinkClass.split(' '));
        }
    });
    
    // Logout button inside sidebar
    const sidebarLogoutButton = document.getElementById('sidebar-logout-button');
    if (sidebarLogoutButton) {
        sidebarLogoutButton.addEventListener('click', async () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
            } catch (error) {
                console.error('Logout API call failed:', error);
            }
            window.location.href = '/admin-login.html'; // Redirect to login
        });
    }
}