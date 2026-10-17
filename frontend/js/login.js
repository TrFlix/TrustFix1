// API URL
const API_URL = 'http://localhost:3000/api';

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Validate
    if (!role) {
        showAlert('Please select your role', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, role })
        });

        const data = await response.json();

        if (data.success) {
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.user));

            showAlert('Login successful! Redirecting...', 'success');

            // Redirect based on role
            setTimeout(() => {
                if (role === 'customer') {
                    window.location.href = 'customer-dashboard.html';
                } else {
                    window.location.href = 'provider-dashboard.html';
                }
            }, 1000);
        } else {
            showAlert(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Login failed. Please try again.', 'error');
    }
});

// Show alert function
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.className = type === 'success' ? 'alert alert-success' : 'alert alert-error';
    alertBox.textContent = message;
    alertBox.classList.remove('hidden');

    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 5000);
}
