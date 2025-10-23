document.addEventListener('DOMContentLoaded', async () => {
    // --- Authentication Check ---
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Not logged in, redirect to login page
        window.location.href = '/admin-login.html';
        return; // Stop further execution
    }

    // --- DOM Elements ---
    const studentCountEl = document.getElementById('student-count');
    const hallCountEl = document.getElementById('hall-count');
    const slotCountEl = document.getElementById('slot-count');
    const pageLogoutButton = document.getElementById('page-logout-button');
    const mainContent = document.getElementById('main-content'); // Main content area for adjusting padding

    // --- Adjust main content padding based on sidebar state ---
    // (This improves the layout when the sidebar opens/closes)
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        // Use MutationObserver to watch for class changes on the sidebar
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'class') {
                    const isSidebarOpen = !sidebar.classList.contains('-translate-x-full');
                     // Check screen size - only apply padding on medium screens and up
                    if (window.innerWidth >= 768) { 
                        mainContent.style.paddingLeft = isSidebarOpen ? '16rem' : '0'; // 16rem = w-64
                    } else {
                        mainContent.style.paddingLeft = '0'; // No padding on mobile
                    }
                }
            });
        });
        observer.observe(sidebar, { attributes: true });
        
        // Initial check in case sidebar JS runs after this
        const isSidebarOpenInitially = !sidebar.classList.contains('-translate-x-full');
        if (window.innerWidth >= 768 && isSidebarOpenInitially) {
            mainContent.style.paddingLeft = '16rem';
        }
    }
     // Adjust padding on resize as well
    window.addEventListener('resize', () => {
        if (sidebar) {
             const isSidebarOpen = !sidebar.classList.contains('-translate-x-full');
             if (window.innerWidth >= 768) { 
                 mainContent.style.paddingLeft = isSidebarOpen ? '16rem' : '0';
             } else {
                 mainContent.style.paddingLeft = '0';
             }
        }
    });


    // --- Fetch Dashboard Data ---
    async function fetchDashboardStats() {
        try {
            // NOTE: We need to create this combined endpoint in the backend AdminController
            // It's more efficient than making 3 separate calls.
            const response = await fetch('/api/admin/dashboard-stats', {
                 headers: {
                    // Include Authorization header if using JWTs
                    Authorization: `Bearer ${token}`
                 }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) { // Unauthorized or Forbidden
                     console.error("Auth error fetching stats. Redirecting to login.");
                     localStorage.removeItem('authToken'); // Clear invalid token
                     window.location.href = '/admin-login.html';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const stats = await response.json();

            // Update the DOM
            studentCountEl.textContent = stats.studentCount ?? 'Error';
            hallCountEl.textContent = stats.hallCount ?? 'Error';
            slotCountEl.textContent = stats.slotCount ?? 'Error';

        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            studentCountEl.textContent = 'Error';
            hallCountEl.textContent = 'Error';
            slotCountEl.textContent = 'Error';
        }
    }

    // --- Logout Button Handler ---
    pageLogoutButton.addEventListener('click', async () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout API call failed:', error);
        }
        window.location.href = '/admin-login.html'; // Redirect to login
    });
    

    // --- Initial Load ---
    fetchDashboardStats();
});
