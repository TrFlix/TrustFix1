// API URL
const API_URL = 'http://localhost:3000/api';

// Registration Form Handler
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        full_name: document.getElementById('full_name').value,
        email: document.getElementById('email').value,
        phone_number: document.getElementById('phone_number').value,
        password: document.getElementById('password').value,
        service_category: document.getElementById('service_category').value,
        experience: document.getElementById('experience').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        description: document.getElementById('description').value
    };

    // Validate password length
    if (formData.password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register/provider`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            showAlert('Registration successful! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showAlert(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Registration failed. Please try again.', 'error');
    }
});

// Show alert function
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.className = type === 'success' ? 'alert alert-success' : 'alert alert-error';
    alertBox.classList.remove('hidden');
    alertBox.textContent = message;

    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 5000);
}
