document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const loginFormContainer = document.getElementById('login-form-container');
    const loggedInContainer = document.getElementById('logged-in-container');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const errorMessageEl = document.getElementById('error-message');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // --- Check Initial Login State ---
    // Check if a JWT token exists in localStorage from a previous session.
    const token = localStorage.getItem('authToken');
    if (token) {
        // If token exists, assume user is logged in: show the logged-in view.
        loginFormContainer.classList.add('hidden');
        loggedInContainer.classList.remove('hidden');
    } else {
        // If no token, show the login form.
        loginFormContainer.classList.remove('hidden');
        loggedInContainer.classList.add('hidden');
    }

    // --- Handle Login Form Submission ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default HTML form submission
        errorMessageEl.classList.add('hidden'); // Hide any previous error messages
        errorMessageEl.textContent = ''; // Clear previous error text

        const username = usernameInput.value.trim();
        const password = passwordInput.value; // Don't trim password

        // Basic frontend validation
        if (!username || !password) {
            errorMessageEl.textContent = 'Please enter both username and password.';
            errorMessageEl.classList.remove('hidden');
            return;
        }

        try {
            // Send login request to the backend API endpoint
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Send username and password in JSON format
            });

            if (response.ok) {
                // Login successful (status code 2xx)
                const result = await response.json(); // Parse the JSON response body (expecting { token: "...", username: "..." })

                // Store the received JWT token and username in localStorage
                if (result.token && result.username) {
                    localStorage.setItem('authToken', result.token); // Store the actual JWT
                    localStorage.setItem('username', result.username);

                    // Redirect the user to the admin dashboard upon successful login
                    window.location.href = '/admin/dashboard.html';
                } else {
                    // Handle unexpected success response format
                    errorMessageEl.textContent = 'Login successful, but invalid response received from server.';
                    errorMessageEl.classList.remove('hidden');
                }

            } else {
                // Handle login failure (status code 4xx or 5xx)
                let errorMsg = 'Invalid username or password.'; // Default error
                try {
                    // Try to get a more specific error message from the response body
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorData.error || errorMsg;
                } catch (jsonError) {
                    // Ignore if the response body is not JSON or empty
                }
                errorMessageEl.textContent = errorMsg;
                errorMessageEl.classList.remove('hidden'); // Show the error message
            }
        } catch (error) {
            // Handle network errors or other issues during the fetch call
            console.error('Login fetch error:', error);
            errorMessageEl.textContent = 'An error occurred during login. Please check your network connection and try again.';
            errorMessageEl.classList.remove('hidden');
        }
    });

    // --- Handle Logout Button Click ---
    logoutButton.addEventListener('click', async () => {
        // Clear stored authentication info (token and username)
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');

        // Optionally call a backend logout endpoint (though less critical with stateless JWTs)
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.warn('Logout API call failed (this might be expected if server session is not used):', error);
        }

        // Update UI: Show the login form again and hide the logged-in view
        loginFormContainer.classList.remove('hidden');
        loggedInContainer.classList.add('hidden');
        // Optionally, redirect to the home page or stay on the login page
        // window.location.href = '/';
    });
});