document.addEventListener('DOMContentLoaded', () => {
    const loginFormContainer = document.getElementById('login-form-container');
    const loggedInContainer = document.getElementById('logged-in-container');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const errorMessageEl = document.getElementById('error-message');

    // Check if user might already be logged in (e.g., has a token)
    // For simplicity, we'll use localStorage. Production should use secure cookies or more robust token handling.
    const token = localStorage.getItem('authToken'); // We'll assume a token is stored on successful login
    if (token) {
        loginFormContainer.classList.add('hidden');
        loggedInContainer.classList.remove('hidden');
    } else {
        loginFormContainer.classList.remove('hidden');
        loggedInContainer.classList.add('hidden');
    }

    // Handle Login Form Submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessageEl.classList.add('hidden'); // Hide previous errors
        errorMessageEl.textContent = '';

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Login successful:', result);
                
                // --- Authentication Handling ---
                // In a real app with JWT:
                // localStorage.setItem('authToken', result.token); 
                // localStorage.setItem('username', result.username); 
                
                // For this simple example, we'll just store a flag
                localStorage.setItem('authToken', 'dummy-token-logged-in'); // Simple flag
                localStorage.setItem('username', username);

                // Redirect to admin dashboard
                window.location.href = '/admin/dashboard.html';

            } else {
                // Handle login failure (e.g., wrong password)
                const errorData = await response.json();
                errorMessageEl.textContent = errorData.message || 'Invalid username or password.';
                errorMessageEl.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessageEl.textContent = 'An error occurred during login. Please try again.';
            errorMessageEl.classList.remove('hidden');
        }
    });

    // Handle Logout Button Click
    logoutButton.addEventListener('click', async () => {
        // Clear stored authentication info
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');

        // Optionally call a backend logout endpoint if using server sessions
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout API call failed:', error);
        }

        // Show login form again
        loginFormContainer.classList.remove('hidden');
        loggedInContainer.classList.add('hidden');
        // Optionally redirect to home or login page
        // window.location.href = '/'; 
    });
});