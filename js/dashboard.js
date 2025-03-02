// Check authentication on page load
checkAuth();

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
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
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

// Load user data
async function loadUserData() {
    try {
        // Here you would typically make an API call to get user data
        const userData = await mockGetUserData();
        
        // Update user name in header
        document.getElementById('userName').textContent = userData.fullName;
        
        // Update profile form
        document.getElementById('profileName').value = userData.fullName;
        document.getElementById('profileEmail').value = userData.email;
        document.getElementById('profilePhone').value = userData.phone;
        
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Load reservations
async function loadReservations() {
    try {
        const reservations = await mockGetReservations();
        const reservationsGrid = document.querySelector('.reservations-grid');
        
        reservationsGrid.innerHTML = ''; // Clear existing reservations
        
        reservations.forEach(reservation => {
            const card = createReservationCard(reservation);
            reservationsGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading reservations:', error);
    }
}

function createReservationCard(reservation) {
    const card = document.createElement('div');
    card.className = 'reservation-card';
    card.innerHTML = `
        <h3>${reservation.vehicleType} - ${reservation.vehicleName}</h3>
        <p><strong>Date:</strong> ${reservation.date}</p>
        <p><strong>Time:</strong> ${reservation.time}</p>
        <p><strong>Duration:</strong> ${reservation.duration} hours</p>
        <p><strong>Status:</strong> <span class="status-${reservation.status.toLowerCase()}">${reservation.status}</span></p>
        ${reservation.status === 'Pending' ? '<button class="btn-primary cancel-reservation">Cancel Reservation</button>' : ''}
    `;
    
    // Add cancel functionality if applicable
    const cancelBtn = card.querySelector('.cancel-reservation');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => cancelReservation(reservation.id));
    }
    
    return card;
}

async function cancelReservation(reservationId) {
    try {
        // Here you would typically make an API call to cancel the reservation
        await mockCancelReservation(reservationId);
        loadReservations(); // Reload reservations after cancellation
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        alert('Failed to cancel reservation. Please try again.');
    }
}

// Handle profile form submission
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const updatedData = {
            fullName: document.getElementById('profileName').value,
            email: document.getElementById('profileEmail').value,
            phone: document.getElementById('profilePhone').value
        };
        
        try {
            // Here you would typically make an API call to update user data
            await mockUpdateUserData(updatedData);
            alert('Profile updated successfully!');
            loadUserData(); // Reload user data
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    });
}

// Mock API functions (Replace these with actual API calls)
async function mockGetUserData() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
    };
}

async function mockGetReservations() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
        {
            id: 1,
            vehicleType: 'Jet Ski',
            vehicleName: 'Yamaha FX Limited SVHO',
            date: '2024-02-20',
            time: '10:00',
            duration: 2,
            status: 'Confirmed'
        },
        {
            id: 2,
            vehicleType: 'Bateau',
            vehicleName: 'Luxury Yacht',
            date: '2024-02-25',
            time: '14:00',
            duration: 4,
            status: 'Pending'
        }
    ];
}

async function mockUpdateUserData(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}

async function mockCancelReservation(reservationId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}

// Initialize dashboard
loadUserData();
loadReservations();

// User Dashboard Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Update user information
    updateUserInfo(user);
    
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
            }
        });
    });

    // Handle profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Handle booking filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterBookings(filter);
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
});

function updateUserInfo(user) {
    // Update header user name
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = user.name;
    }

    // Update profile information
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('fullName').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone || '';
}

async function loadDashboardData() {
    try {
        const response = await fetch('backend/api/user/dashboard.php');
        const data = await response.json();
        
        // Update statistics
        document.getElementById('activeBookings').textContent = data.activeBookings;
        document.getElementById('pastBookings').textContent = data.pastBookings;
        document.getElementById('totalSpent').textContent = `$${data.totalSpent}`;
        
        // Update activity list
        const activityList = document.getElementById('activityList');
        if (activityList && data.recentActivity) {
            activityList.innerHTML = data.recentActivity.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas ${getActivityIcon(activity.type)}"></i>
                    </div>
                    <div class="activity-details">
                        <p>${activity.description}</p>
                        <span>${formatDate(activity.date)}</span>
                    </div>
                </div>
            `).join('');
        }
        
        // Update bookings list
        const bookingsList = document.getElementById('bookingsList');
        if (bookingsList && data.bookings) {
            bookingsList.innerHTML = data.bookings.map(booking => `
                <div class="booking-card" data-status="${booking.status.toLowerCase()}">
                    <div class="booking-header">
                        <h3>${booking.vehicleType}</h3>
                        <span class="booking-status ${booking.status.toLowerCase()}">${booking.status}</span>
                    </div>
                    <div class="booking-details">
                        <p><i class="fas fa-calendar"></i> ${formatDate(booking.date)}</p>
                        <p><i class="fas fa-clock"></i> ${booking.time}</p>
                        <p><i class="fas fa-hourglass-half"></i> ${booking.duration} hour(s)</p>
                        <p><i class="fas fa-dollar-sign"></i> ${booking.price}</p>
                    </div>
                    <div class="booking-actions">
                        ${getBookingActions(booking)}
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const profileData = {
        name: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };

    try {
        const response = await fetch('backend/api/user/update-profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();

        if (response.ok) {
            // Update local storage
            const user = JSON.parse(localStorage.getItem('user'));
            user.name = profileData.name;
            user.email = profileData.email;
            user.phone = profileData.phone;
            localStorage.setItem('user', JSON.stringify(user));
            
            // Update UI
            updateUserInfo(user);
            showSuccessMessage('Profile updated successfully');
        } else {
            showErrorMessage(data.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Profile update error:', error);
        showErrorMessage('An error occurred while updating your profile');
    }
}

function handleLogout() {
    fetch('backend/api/auth/logout.php')
        .then(() => {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error('Logout failed:', error);
        });
}

function filterBookings(filter) {
    const bookings = document.querySelectorAll('.booking-card');
    bookings.forEach(booking => {
        const status = booking.dataset.status;
        if (filter === 'all' || status === filter) {
            booking.style.display = 'block';
        } else {
            booking.style.display = 'none';
        }
    });
}

// Helper functions
function getActivityIcon(type) {
    const icons = {
        booking: 'fa-calendar-plus',
        payment: 'fa-credit-card',
        cancellation: 'fa-calendar-times',
        update: 'fa-edit'
    };
    return icons[type] || 'fa-info-circle';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getBookingActions(booking) {
    if (booking.status.toLowerCase() === 'upcoming') {
        return `
            <button class="btn-secondary" onclick="viewBooking(${booking.id})">View Details</button>
            <button class="btn-danger" onclick="cancelBooking(${booking.id})">Cancel</button>
        `;
    }
    return `<button class="btn-secondary" onclick="viewBooking(${booking.id})">View Details</button>`;
}

function showSuccessMessage(message) {
    // Implementation for showing success message
    alert(message);
}

function showErrorMessage(message) {
    // Implementation for showing error message
    alert(message);
}

// Booking actions
function viewBooking(bookingId) {
    // Implementation for viewing booking details
    console.log('View booking:', bookingId);
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        fetch(`backend/api/user/cancel-booking.php?id=${bookingId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadDashboardData();
                    showSuccessMessage('Booking cancelled successfully');
                } else {
                    showErrorMessage(data.message || 'Failed to cancel booking');
                }
            })
            .catch(error => {
                console.error('Cancel booking error:', error);
                showErrorMessage('An error occurred while cancelling the booking');
            });
    }
}
