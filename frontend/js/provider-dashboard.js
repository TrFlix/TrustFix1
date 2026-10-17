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
    if (currentUser.role !== 'provider') {
        window.location.href = 'login.html';
        return null;
    }
    return currentUser;
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (!user) return;

    document.getElementById('providerName').textContent = user.full_name;
    document.getElementById('welcomeText').textContent = `Welcome, ${user.full_name}`;

    loadStats();
    loadCategories();
    loadBookings();
});

// Tab functionality
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    if (tabName === 'bookings') {
        document.getElementById('bookingsTab').classList.remove('hidden');
        event.target.classList.add('active');
        loadBookings();
    } else if (tabName === 'services') {
        document.getElementById('servicesTab').classList.remove('hidden');
        event.target.classList.add('active');
        loadServices();
    } else if (tabName === 'profile') {
        document.getElementById('profileTab').classList.remove('hidden');
        event.target.classList.add('active');
        loadProfile();
    }
}

// Load dashboard stats
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/provider/${currentUser.id}/stats`);
        const data = await response.json();

        if (data.success) {
            document.getElementById('totalBookings').textContent = data.stats.totalBookings;
            document.getElementById('pendingBookings').textContent = data.stats.pendingBookings;
            document.getElementById('completedBookings').textContent = data.stats.completedBookings;
            document.getElementById('totalServices').textContent = data.stats.totalServices;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();

        if (data.success) {
            const select = document.getElementById('categoryId');
            select.innerHTML = '<option value="">Select Category</option>';
            data.categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load bookings
async function loadBookings() {
    try {
        const response = await fetch(`${API_URL}/bookings/provider/${currentUser.id}`);
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
            <td>${booking.customer_name}<br><small>${booking.customer_phone}</small></td>
            <td>${booking.service_name}</td>
            <td>${new Date(booking.preferred_date).toLocaleDateString()}</td>
            <td><span class="badge badge-${booking.status}">${booking.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="viewBookingDetails(${booking.id})" style="margin-bottom: 0.25rem;">View</button>
                ${booking.status === 'pending' ? `
                    <button class="btn btn-sm btn-secondary" onclick="updateBookingStatus(${booking.id}, 'accepted')">Accept</button>
                    <button class="btn btn-sm btn-danger" onclick="updateBookingStatus(${booking.id}, 'rejected')">Reject</button>
                ` : ''}
                ${booking.status === 'accepted' ? `
                    <button class="btn btn-sm btn-primary" onclick="updateBookingStatus(${booking.id}, 'in_progress')">Start</button>
                ` : ''}
                ${booking.status === 'in_progress' ? `
                    <button class="btn btn-sm btn-secondary" onclick="updateBookingStatus(${booking.id}, 'completed')">Complete</button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// View booking details
async function viewBookingDetails(bookingId) {
    try {
        const response = await fetch(`${API_URL}/bookings/provider/${currentUser.id}`);
        const data = await response.json();

        if (data.success) {
            const booking = data.bookings.find(b => b.id === bookingId);
            if (booking) {
                const content = document.getElementById('bookingDetailsContent');
                content.innerHTML = `
                    <div style="display: grid; gap: 1rem;">
                        <p><strong>Booking ID:</strong> #${booking.id}</p>
                        <p><strong>Customer:</strong> ${booking.customer_name}</p>
                        <p><strong>Contact:</strong> ${booking.customer_phone}</p>
                        <p><strong>Service:</strong> ${booking.service_name}</p>
                        <p><strong>Price:</strong> ₹${booking.price}</p>
                        <p><strong>Preferred Date:</strong> ${new Date(booking.preferred_date).toLocaleDateString()}</p>
                        <p><strong>Address:</strong> ${booking.address}</p>
                        <p><strong>Contact Number:</strong> ${booking.contact_number}</p>
                        <p><strong>Problem Description:</strong><br>${booking.problem_description}</p>
                        <p><strong>Status:</strong> <span class="badge badge-${booking.status}">${booking.status}</span></p>
                        <p><strong>Booked On:</strong> ${new Date(booking.created_at).toLocaleString()}</p>
                    </div>
                `;
                document.getElementById('bookingDetailsModal').style.display = 'flex';
            }
        }
    } catch (error) {
        console.error('Error loading booking details:', error);
    }
}

// Close booking details modal
function closeBookingDetailsModal() {
    document.getElementById('bookingDetailsModal').style.display = 'none';
}

// Update booking status
async function updateBookingStatus(bookingId, status) {
    const confirmMessage = status === 'rejected' ?
        'Are you sure you want to reject this booking?' :
        `Are you sure you want to mark this booking as ${status.replace('_', ' ')}?`;

    if (!confirm(confirmMessage)) return;

    try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        const data = await response.json();

        if (data.success) {
            alert('Booking status updated successfully');
            loadBookings();
            loadStats();
        } else {
            alert(data.message || 'Failed to update booking');
        }
    } catch (error) {
        console.error('Error updating booking:', error);
        alert('Failed to update booking');
    }
}

// Load services
async function loadServices() {
    try {
        const response = await fetch(`${API_URL}/providers/${currentUser.id}/services`);
        const data = await response.json();

        if (data.success) {
            displayServices(data.services);
        }
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// Display services
function displayServices(services) {
    const tbody = document.getElementById('servicesTableBody');
    tbody.innerHTML = '';

    if (services.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No services added yet. Click "Add New Service" to get started.</td></tr>';
        return;
    }

    services.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.service_name}</td>
            <td>${service.category_name}</td>
            <td>₹${service.price}</td>
            <td>${service.description || '-'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editService(${service.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteService(${service.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Open add service modal
function openAddServiceModal() {
    document.getElementById('serviceModalTitle').textContent = 'Add New Service';
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceId').value = '';
    document.getElementById('serviceModal').style.display = 'flex';
}

// Edit service
async function editService(serviceId) {
    try {
        const response = await fetch(`${API_URL}/providers/${currentUser.id}/services`);
        const data = await response.json();

        if (data.success) {
            const service = data.services.find(s => s.id === serviceId);
            if (service) {
                document.getElementById('serviceModalTitle').textContent = 'Edit Service';
                document.getElementById('serviceId').value = service.id;
                document.getElementById('serviceName').value = service.service_name;
                document.getElementById('categoryId').value = service.category_id;
                document.getElementById('servicePrice').value = service.price;
                document.getElementById('serviceDescription').value = service.description || '';
                document.getElementById('serviceModal').style.display = 'flex';
            }
        }
    } catch (error) {
        console.error('Error loading service:', error);
    }
}

// Close service modal
function closeServiceModal() {
    document.getElementById('serviceModal').style.display = 'none';
    document.getElementById('serviceForm').reset();
}

// Handle service form submission
document.getElementById('serviceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const serviceId = document.getElementById('serviceId').value;
    const serviceData = {
        provider_id: currentUser.id,
        service_name: document.getElementById('serviceName').value,
        category_id: document.getElementById('categoryId').value,
        price: document.getElementById('servicePrice').value,
        description: document.getElementById('serviceDescription').value
    };

    try {
        let response;
        if (serviceId) {
            // Update existing service
            response = await fetch(`${API_URL}/services/${serviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceData)
            });
        } else {
            // Add new service
            response = await fetch(`${API_URL}/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceData)
            });
        }

        const data = await response.json();

        if (data.success) {
            showAlert(serviceId ? 'Service updated successfully!' : 'Service added successfully!', 'success');
            setTimeout(() => {
                closeServiceModal();
                loadServices();
                loadStats();
            }, 1500);
        } else {
            showAlert(data.message || 'Operation failed', 'error');
        }
    } catch (error) {
        console.error('Service operation error:', error);
        showAlert('Operation failed. Please try again.', 'error');
    }
});

// Delete service
async function deleteService(serviceId) {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
        const response = await fetch(`${API_URL}/services/${serviceId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            alert('Service deleted successfully');
            loadServices();
            loadStats();
        } else {
            alert(data.message || 'Failed to delete service');
        }
    } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service');
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
            <p><strong>Service Category:</strong> ${currentUser.service_category}</p>
            <p><strong>Experience:</strong> ${currentUser.experience} years</p>
            <p><strong>Address:</strong> ${currentUser.address}</p>
            <p><strong>City:</strong> ${currentUser.city}</p>
            <p><strong>Description:</strong> ${currentUser.description || 'Not provided'}</p>
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
