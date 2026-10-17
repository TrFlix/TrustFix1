// API URL
const API_URL = 'http://localhost:3000/api';

// Check authentication
let currentUser = null;

function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    currentUser = JSON.parse(user);
    if (currentUser.role !== 'customer') {
        window.location.href = 'login.html';
        return null;
    }
    return currentUser;
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (!user) return;

    document.getElementById('customerName').textContent = user.full_name;
    document.getElementById('welcomeText').textContent = `Welcome, ${user.full_name}`;

    loadCategories();
    loadProviders();
});

// Tab functionality
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    if (tabName === 'browse') {
        document.getElementById('browseTab').classList.remove('hidden');
        document.querySelector(`[data-tab="browse"]`).classList.add('active');
        loadProviders();
    } else if (tabName === 'bookings') {
        document.getElementById('bookingsTab').classList.remove('hidden');
        document.querySelector(`[data-tab="bookings"]`).classList.add('active');
        loadBookings();
    } else if (tabName === 'profile') {
        document.getElementById('profileTab').classList.remove('hidden');
        document.querySelector(`[data-tab="profile"]`).classList.add('active');
        loadProfile();
    }
}

// Load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();

        if (data.success) {
            const select = document.getElementById('categoryFilter');
            data.categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.name;
                option.textContent = cat.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load providers
async function loadProviders(category = '', city = '') {
    try {
        let url = `${API_URL}/providers?`;
        if (category) url += `category=${category}&`;
        if (city) url += `city=${city}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            displayProviders(data.providers);
        }
    } catch (error) {
        console.error('Error loading providers:', error);
    }
}

// Display providers
function displayProviders(providers) {
    const grid = document.getElementById('providersGrid');
    grid.innerHTML = '';

    if (providers.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-light);">No service providers found</p>';
        return;
    }

    providers.forEach(provider => {
        const card = document.createElement('div');
        card.className = 'provider-card';
        card.innerHTML = `
            <h3>${provider.full_name}</h3>
            <p class="provider-info">📍 ${provider.city}</p>
            <p class="provider-info">🔧 ${provider.service_category}</p>
            <p class="provider-info">⏱️ ${provider.experience} years experience</p>
            <p class="provider-info" style="margin-top: 1rem;">${provider.description || 'Professional service provider'}</p>
            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="openBookingModal(${provider.id}, '${provider.full_name}')">
                Book Service
            </button>
        `;
        grid.appendChild(card);
    });
}

// Search providers
function searchProviders() {
    const category = document.getElementById('categoryFilter').value;
    const city = document.getElementById('cityFilter').value;
    loadProviders(category, city);
}

// Open booking modal
async function openBookingModal(providerId, providerName) {
    document.getElementById('selectedProviderId').value = providerId;
    document.getElementById('modalProviderName').textContent = providerName;

    // Load provider services
    try {
        const response = await fetch(`${API_URL}/providers/${providerId}/services`);
        const data = await response.json();

        if (data.success) {
            const select = document.getElementById('serviceSelect');
            select.innerHTML = '<option value="">Select a service</option>';

            data.services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.id;
                option.textContent = `${service.service_name} - ₹${service.price}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading services:', error);
    }

    // Set default values
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('preferredDate').min = today;
    document.getElementById('bookingAddress').value = currentUser.address || '';
    document.getElementById('contactNumber').value = currentUser.phone_number || '';

    document.getElementById('bookingModal').style.display = 'flex';
}

// Close booking modal
function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
    document.getElementById('bookingForm').reset();
}

// Handle booking form submission
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookingData = {
        customer_id: currentUser.id,
        service_id: document.getElementById('serviceSelect').value,
        provider_id: document.getElementById('selectedProviderId').value,
        problem_description: document.getElementById('problemDescription').value,
        preferred_date: document.getElementById('preferredDate').value,
        address: document.getElementById('bookingAddress').value,
        contact_number: document.getElementById('contactNumber').value
    };

    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();

        if (data.success) {
            showAlert('Booking created successfully!', 'success');
            setTimeout(() => {
                closeBookingModal();
                showTab('bookings');
            }, 1500);
        } else {
            showAlert(data.message || 'Booking failed', 'error');
        }
    } catch (error) {
        console.error('Booking error:', error);
        showAlert('Booking failed. Please try again.', 'error');
    }
});

// Load bookings
async function loadBookings() {
    try {
        const response = await fetch(`${API_URL}/bookings/customer/${currentUser.id}`);
        const data = await response.json();

        if (data.success) {
            displayBookings(data.bookings);
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

// Display bookings
function displayBookings(bookings) {
    const tbody = document.getElementById('bookingsTableBody');
    tbody.innerHTML = '';

    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No bookings found</td></tr>';
        return;
    }

    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${booking.id}</td>
            <td>${booking.service_name}</td>
            <td>${booking.provider_name}<br><small>${booking.provider_phone}</small></td>
            <td>${new Date(booking.preferred_date).toLocaleDateString()}</td>
            <td><span class="badge badge-${booking.status}">${booking.status}</span></td>
            <td>
                ${booking.status === 'pending' || booking.status === 'accepted' ?
                    `<button class="btn btn-danger btn-sm" onclick="cancelBooking(${booking.id})">Cancel</button>` :
                    '<span style="color: var(--text-light);">-</span>'
                }
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Cancel booking
async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
            method: 'PUT'
        });

        const data = await response.json();

        if (data.success) {
            alert('Booking cancelled successfully');
            loadBookings();
        } else {
            alert(data.message || 'Failed to cancel booking');
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking');
    }
}

// Load profile
function loadProfile() {
    const profileDiv = document.getElementById('profileInfo');
    profileDiv.innerHTML = `
        <div style="display: grid; gap: 1rem;">
            <p><strong>Name:</strong> ${currentUser.full_name}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Phone:</strong> ${currentUser.phone_number}</p>
            <p><strong>Address:</strong> ${currentUser.address}</p>
            <p><strong>City:</strong> ${currentUser.city}</p>
        </div>
    `;
}

// Logout
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Show alert
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.className = type === 'success' ? 'alert alert-success' : 'alert alert-error';
    alertBox.textContent = message;
    alertBox.classList.remove('hidden');

    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 3000);
}

// Add CSS for tabs
const style = document.createElement('style');
style.textContent = `
    .tab-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        background: transparent;
        border-bottom: 3px solid transparent;
        font-weight: 600;
        cursor: pointer;
        color: var(--text-light);
        transition: all 0.3s;
    }
    .tab-btn:hover {
        color: var(--primary-color);
    }
    .tab-btn.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
    }
`;
document.head.appendChild(style);
