// Check authentication on page load
checkAuth();

// Check admin role
const userRole = localStorage.getItem('userRole');
if (userRole !== 'admin') {
    window.location.href = '/dashboard.html';
}

// Handle navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if (!item.classList.contains('logout')) {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            if (section) {
                showSection(section);
                setActiveNavItem(item);
            }
        }
    });
});

function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
}

function setActiveNavItem(activeItem) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}

// Vehicle Management
const addVehicleBtn = document.getElementById('addVehicleBtn');
const vehicleModal = document.getElementById('vehicleModal');
const closeModal = document.querySelector('.close');
const vehicleForm = document.getElementById('vehicleForm');

if (addVehicleBtn) {
    addVehicleBtn.addEventListener('click', () => {
        vehicleModal.style.display = 'block';
        vehicleForm.reset();
        vehicleForm.dataset.mode = 'add';
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        vehicleModal.style.display = 'none';
    });
}

// Handle vehicle form submission
if (vehicleForm) {
    vehicleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const vehicleData = {
            name: document.getElementById('vehicleName').value,
            type: document.getElementById('vehicleTypeSelect').value,
            price: document.getElementById('vehiclePrice').value,
            capacity: document.getElementById('vehicleCapacity').value,
            description: document.getElementById('vehicleDescription').value,
            imageUrl: document.getElementById('vehicleImage').value
        };
        
        try {
            if (vehicleForm.dataset.mode === 'add') {
                await mockAddVehicle(vehicleData);
            } else {
                await mockUpdateVehicle(vehicleForm.dataset.vehicleId, vehicleData);
            }
            
            vehicleModal.style.display = 'none';
            loadVehicles();
        } catch (error) {
            console.error('Error saving vehicle:', error);
            alert('Failed to save vehicle. Please try again.');
        }
    });
}

// Load dashboard stats
async function loadDashboardStats() {
    try {
        const stats = await mockGetDashboardStats();
        document.querySelectorAll('.stat-number').forEach(stat => {
            const statType = stat.parentElement.querySelector('h3').textContent.toLowerCase();
            stat.textContent = stats[statType] || '0';
        });
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Load vehicles
async function loadVehicles() {
    try {
        const vehicles = await mockGetVehicles();
        const vehiclesList = document.getElementById('vehiclesList');
        
        if (vehiclesList) {
            vehiclesList.innerHTML = '';
            
            vehicles.forEach(vehicle => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${vehicle.id}</td>
                    <td>${vehicle.name}</td>
                    <td>${vehicle.type}</td>
                    <td>${vehicle.status}</td>
                    <td>${vehicle.price}DH</td>
                    <td class="action-buttons">
                        <button class="btn-edit" data-id="${vehicle.id}">Edit</button>
                        <button class="btn-delete" data-id="${vehicle.id}">Delete</button>
                    </td>
                `;
                
                // Add event listeners for edit and delete
                const editBtn = row.querySelector('.btn-edit');
                const deleteBtn = row.querySelector('.btn-delete');
                
                editBtn.addEventListener('click', () => editVehicle(vehicle));
                deleteBtn.addEventListener('click', () => deleteVehicle(vehicle.id));
                
                vehiclesList.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading vehicles:', error);
    }
}

// Edit vehicle
async function editVehicle(vehicle) {
    vehicleForm.dataset.mode = 'edit';
    vehicleForm.dataset.vehicleId = vehicle.id;
    
    document.getElementById('vehicleName').value = vehicle.name;
    document.getElementById('vehicleTypeSelect').value = vehicle.type;
    document.getElementById('vehiclePrice').value = vehicle.price;
    document.getElementById('vehicleCapacity').value = vehicle.capacity;
    document.getElementById('vehicleDescription').value = vehicle.description;
    document.getElementById('vehicleImage').value = vehicle.imageUrl;
    
    vehicleModal.style.display = 'block';
}

// Delete vehicle
async function deleteVehicle(vehicleId) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
        try {
            await mockDeleteVehicle(vehicleId);
            loadVehicles();
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            alert('Failed to delete vehicle. Please try again.');
        }
    }
}

// Mock API functions (Replace these with actual API calls)
async function mockGetDashboardStats() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        'total reservations': 25,
        'active vehicles': 8,
        'total users': 50,
        'revenue': '25000 DH'
    };
}

async function mockGetVehicles() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
        {
            id: 1,
            name: 'Yamaha FX Limited SVHO',
            type: 'jetski',
            status: 'Available',
            price: 800,
            capacity: 2,
            description: 'High-performance jet ski',
            imageUrl: '/images/jetski1.jpg'
        },
        {
            id: 2,
            name: 'Luxury Yacht',
            type: 'bateau',
            status: 'Available',
            price: 5000,
            capacity: 12,
            description: 'Premium luxury yacht',
            imageUrl: '/images/yacht1.jpg'
        }
    ];
}

async function mockAddVehicle(vehicleData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}

async function mockUpdateVehicle(id, vehicleData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}

async function mockDeleteVehicle(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}

// Initialize admin panel
loadDashboardStats();
loadVehicles();

// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.isAdmin) {
        window.location.href = 'login.html';
        return;
    }

    // Handle navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            loadSection(this.querySelector('span').textContent.toLowerCase());
        });
    });

    // Handle logout
    const logoutLink = document.querySelector('.nav-link:last-child');
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    // Load dashboard data
    loadDashboardData();

    // Handle booking actions
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('i').className;
            const bookingId = this.closest('tr').querySelector('td').textContent;
            handleBookingAction(action, bookingId);
        });
    });
});

// Load dashboard data
async function loadDashboardData() {
    try {
        // Here you would typically fetch data from your backend
        // For now, we'll use mock data
        const mockData = {
            totalBookings: 156,
            bookingsChange: 12,
            revenue: 24500,
            revenueChange: 8,
            activeEquipment: 12,
            totalEquipment: 15,
            customerSatisfaction: 4.8,
            satisfactionChange: 0.2,
            recentBookings: [
                {
                    id: '#BK001',
                    customer: 'John Doe',
                    package: 'Premium Package',
                    date: '2025-02-17',
                    amount: 199,
                    status: 'confirmed'
                },
                // Add more bookings here
            ]
        };

        updateDashboardStats(mockData);
        updateBookingsTable(mockData.recentBookings);

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading dashboard data', 'error');
    }
}

// Update dashboard statistics
function updateDashboardStats(data) {
    document.querySelector('.stat-card:nth-child(1) .value').textContent = data.totalBookings;
    document.querySelector('.stat-card:nth-child(1) .change span').textContent = 
        `${data.bookingsChange}% from last month`;

    document.querySelector('.stat-card:nth-child(2) .value').textContent = 
        `$${data.revenue.toLocaleString()}`;
    document.querySelector('.stat-card:nth-child(2) .change span').textContent = 
        `${data.revenueChange}% from last month`;

    document.querySelector('.stat-card:nth-child(3) .value').textContent = 
        `${data.activeEquipment}/${data.totalEquipment}`;
    
    document.querySelector('.stat-card:nth-child(4) .value').textContent = 
        `${data.customerSatisfaction}/5`;
    document.querySelector('.stat-card:nth-child(4) .change span').textContent = 
        `${data.satisfactionChange} from last month`;
}

// Update bookings table
function updateBookingsTable(bookings) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    bookings.forEach(booking => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.customer}</td>
            <td>${booking.package}</td>
            <td>${booking.date}</td>
            <td>$${booking.amount}</td>
            <td><span class="status ${booking.status}">${booking.status}</span></td>
            <td>
                <button class="action-btn"><i class="fas fa-eye"></i></button>
                <button class="action-btn"><i class="fas fa-edit"></i></button>
                <button class="action-btn"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Handle booking actions
function handleBookingAction(action, bookingId) {
    if (action.includes('fa-eye')) {
        viewBooking(bookingId);
    } else if (action.includes('fa-edit')) {
        editBooking(bookingId);
    } else if (action.includes('fa-trash')) {
        deleteBooking(bookingId);
    }
}

// View booking details
function viewBooking(bookingId) {
    // Here you would typically fetch booking details from your backend
    // For now, we'll show a mock alert
    alert(`Viewing booking ${bookingId}`);
}

// Edit booking
function editBooking(bookingId) {
    // Here you would typically open a modal with booking edit form
    // For now, we'll show a mock alert
    alert(`Editing booking ${bookingId}`);
}

// Delete booking
function deleteBooking(bookingId) {
    if (confirm(`Are you sure you want to delete booking ${bookingId}?`)) {
        // Here you would typically send a delete request to your backend
        // For now, we'll just remove the row from the table
        const row = document.querySelector(`td:first-child:contains('${bookingId}')`).closest('tr');
        row.remove();
        showNotification('Booking deleted successfully', 'success');
    }
}

// Load different sections
function loadSection(section) {
    // Here you would typically load different sections of the admin panel
    // For now, we'll just log the section name
    console.log(`Loading ${section} section`);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Admin Dashboard Functionality
const API_URL = 'backend/api';

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuth();
    
    // Initialize Charts
    initializeCharts();
    
    // Load Data
    loadAdminData();
    
    // Setup Event Listeners
    setupEventListeners();
});

// Check if user is authenticated and is admin
async function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
    }
}

// Initialize all charts
async function initializeCharts() {
    try {
        // Get revenue data
        const revenueData = await fetch(`${API_URL}/admin/dashboard.php?action=revenue`)
            .then(res => res.json());
        
        // Get distribution data
        const distributionData = await fetch(`${API_URL}/admin/dashboard.php?action=distribution`)
            .then(res => res.json());

        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
        if (revenueCtx) {
            new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: revenueData.map(item => item.month),
                    datasets: [{
                        label: 'Revenue',
                        data: revenueData.map(item => item.revenue),
                        borderColor: '#4CAF50',
                        tension: 0.4,
                        fill: true,
                        backgroundColor: 'rgba(76, 175, 80, 0.1)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: true,
                                color: 'rgba(200, 200, 200, 0.2)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Bookings Distribution Chart
        const bookingsCtx = document.getElementById('bookingsChart')?.getContext('2d');
        if (bookingsCtx) {
            new Chart(bookingsCtx, {
                type: 'doughnut',
                data: {
                    labels: distributionData.map(item => item.vehicle_type),
                    datasets: [{
                        data: distributionData.map(item => item.count),
                        backgroundColor: [
                            '#2196F3',
                            '#FF9800'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error initializing charts:', error);
        showNotification('Error loading chart data', 'error');
    }
}

// Load admin dashboard data
async function loadAdminData() {
    try {
        // Get dashboard stats
        const stats = await fetch(`${API_URL}/admin/dashboard.php?action=stats`)
            .then(res => res.json());
        
        // Get recent bookings
        const bookings = await fetch(`${API_URL}/admin/dashboard.php?action=bookings`)
            .then(res => res.json());

        updateDashboardStats(stats);
        updateRecentBookings(bookings);

    } catch (error) {
        console.error('Error loading admin data:', error);
        showNotification('Error loading dashboard data', 'error');
    }
}

// Update dashboard statistics
function updateDashboardStats(data) {
    document.querySelector('[data-stat="revenue"]').textContent = `$${parseFloat(data.total_revenue).toLocaleString()}`;
    document.querySelector('[data-stat="bookings"]').textContent = data.total_bookings;
    document.querySelector('[data-stat="users"]').textContent = data.active_users;
}

// Update recent bookings table
function updateRecentBookings(bookings) {
    const tbody = document.querySelector('.bookings-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    bookings.forEach(booking => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${booking.id}</td>
            <td>${booking.user_name}</td>
            <td>${booking.vehicle_type}</td>
            <td>${new Date(booking.booking_date).toLocaleDateString()}</td>
            <td><span class="status ${booking.status}">${booking.status}</span></td>
            <td>$${parseFloat(booking.total_amount).toLocaleString()}</td>
            <td>
                <button class="action-btn edit" data-id="${booking.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" data-id="${booking.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Date range picker
    const dateRange = document.querySelector('.date-range');
    if (dateRange) {
        dateRange.addEventListener('change', (e) => {
            loadAdminData();
        });
    }

    // Booking actions
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.action-btn')) {
            const btn = e.target.closest('.action-btn');
            const id = btn.dataset.id;
            
            if (btn.classList.contains('edit')) {
                editBooking(id);
            } else if (btn.classList.contains('delete')) {
                deleteBooking(id);
            }
        }
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            searchBookings(e.target.value);
        }, 300));
    }
}

// Edit booking
async function editBooking(id) {
    const newStatus = prompt('Enter new status (pending/confirmed/completed/cancelled):');
    if (newStatus && ['pending', 'confirmed', 'completed', 'cancelled'].includes(newStatus)) {
        try {
            const response = await fetch(`${API_URL}/admin/dashboard.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'update_status',
                    booking_id: id,
                    status: newStatus
                })
            }).then(res => res.json());

            if (response.error) {
                throw new Error(response.error);
            }

            showNotification('Booking status updated successfully', 'success');
            loadAdminData();
        } catch (error) {
            showNotification('Error updating booking status', 'error');
        }
    }
}

// Delete booking
async function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        try {
            const response = await fetch(`${API_URL}/admin/dashboard.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'delete_booking',
                    booking_id: id
                })
            }).then(res => res.json());

            if (response.error) {
                throw new Error(response.error);
            }

            showNotification('Booking deleted successfully', 'success');
            loadAdminData();
        } catch (error) {
            showNotification('Error deleting booking', 'error');
        }
    }
}

// Search bookings
function searchBookings(query) {
    const rows = document.querySelectorAll('.bookings-table tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(200%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // Check admin authentication
    checkAdminAuth();
    
    // Load dashboard data
    loadDashboardData();
    
    // Handle navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('logout')) {
                handleLogout();
                return;
            }
            
            const section = item.dataset.section;
            if (section) {
                e.preventDefault();
                showSection(section);
                loadSectionData(section);
            }
        });
    });
});

async function checkAdminAuth() {
    try {
        const response = await fetch('backend/api/admin/check-auth.php');
        if (!response.ok) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = 'login.html';
    }
}

async function loadDashboardData() {
    try {
        const response = await fetch('backend/api/admin/dashboard.php');
        const data = await response.json();
        
        // Update dashboard stats
        document.getElementById('total-bookings').textContent = data.totalBookings;
        document.getElementById('total-revenue').textContent = `$${data.totalRevenue}`;
        document.getElementById('active-vehicles').textContent = data.activeVehicles;
        
        // Update recent bookings
        const bookingsList = document.querySelector('.recent-bookings');
        if (bookingsList && data.recentBookings) {
            bookingsList.innerHTML = data.recentBookings.map(booking => `
                <div class="booking-item">
                    <div class="booking-info">
                        <h4>${booking.vehicleType}</h4>
                        <p>Customer: ${booking.customerName}</p>
                        <p>Date: ${booking.bookingDate}</p>
                    </div>
                    <div class="booking-status ${booking.status.toLowerCase()}">
                        ${booking.status}
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

async function loadSectionData(section) {
    try {
        const response = await fetch(`backend/api/admin/${section}.php`);
        const data = await response.json();
        
        const sectionElement = document.getElementById(section);
        if (!sectionElement) return;
        
        switch(section) {
            case 'vehicles':
                renderVehicles(data);
                break;
            case 'reservations':
                renderReservations(data);
                break;
            case 'users':
                renderUsers(data);
                break;
        }
    } catch (error) {
        console.error(`Failed to load ${section} data:`, error);
    }
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });
}

function handleLogout() {
    fetch('backend/api/auth/logout.php')
        .then(() => {
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error('Logout failed:', error);
        });
}

// Helper functions for rendering different sections
function renderVehicles(data) {
    const vehiclesContainer = document.querySelector('#vehicles .vehicles-grid');
    if (!vehiclesContainer) return;
    
    vehiclesContainer.innerHTML = data.map(vehicle => `
        <div class="vehicle-card">
            <img src="${vehicle.image}" alt="${vehicle.name}">
            <div class="vehicle-info">
                <h3>${vehicle.name}</h3>
                <p>${vehicle.description}</p>
                <div class="vehicle-status ${vehicle.status.toLowerCase()}">
                    ${vehicle.status}
                </div>
            </div>
            <div class="vehicle-actions">
                <button onclick="editVehicle(${vehicle.id})">Edit</button>
                <button onclick="toggleVehicleStatus(${vehicle.id})">
                    ${vehicle.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
            </div>
        </div>
    `).join('');
}

function renderReservations(data) {
    const reservationsContainer = document.querySelector('#reservations .reservations-list');
    if (!reservationsContainer) return;
    
    reservationsContainer.innerHTML = data.map(reservation => `
        <div class="reservation-item">
            <div class="reservation-details">
                <h4>Booking #${reservation.id}</h4>
                <p>Vehicle: ${reservation.vehicleType}</p>
                <p>Customer: ${reservation.customerName}</p>
                <p>Date: ${reservation.bookingDate}</p>
                <p>Amount: $${reservation.amount}</p>
            </div>
            <div class="reservation-status ${reservation.status.toLowerCase()}">
                ${reservation.status}
            </div>
            <div class="reservation-actions">
                <select onchange="updateReservationStatus(${reservation.id}, this.value)">
                    <option value="pending" ${reservation.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${reservation.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="completed" ${reservation.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${reservation.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </div>
        </div>
    `).join('');
}

function renderUsers(data) {
    const usersContainer = document.querySelector('#users .users-list');
    if (!usersContainer) return;
    
    usersContainer.innerHTML = data.map(user => `
        <div class="user-item">
            <div class="user-info">
                <h4>${user.name}</h4>
                <p>Email: ${user.email}</p>
                <p>Joined: ${user.joinDate}</p>
                <p>Bookings: ${user.totalBookings}</p>
            </div>
            <div class="user-actions">
                <button onclick="toggleUserStatus(${user.id})">
                    ${user.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
            </div>
        </div>
    `).join('');
}
