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
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.dashboard-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').slice(1);
            
            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Profile Image Upload
    const changeAvatarBtn = document.querySelector('.change-avatar');
    const profileImg = document.querySelector('.profile-avatar img');

    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        profileImg.src = e.target.result;
                        // Here you would typically upload the image to your server
                    };
                    reader.readAsDataURL(file);
                }
            };
            
            input.click();
        });
    }

    // Profile Form Submission
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = profileForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Saving...';
            submitBtn.disabled = true;

            try {
                // Here you would typically send the form data to your server
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
                
                showNotification('Profile updated successfully!', 'success');
            } catch (error) {
                showNotification('Error updating profile. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Notification System
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

    // Load User Data
    loadUserData();
});

// Load user data from storage or API
async function loadUserData() {
    try {
        // Here you would typically fetch user data from your server
        const userData = JSON.parse(sessionStorage.getItem('user')) || {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1 234 567 890',
            bookings: []
        };

        // Update profile information
        document.querySelectorAll('.user-name').forEach(el => {
            el.textContent = userData.name;
        });

        // Update stats
        updateDashboardStats(userData);

        // Update recent bookings
        updateRecentBookings(userData.bookings);

    } catch (error) {
        console.error('Error loading user data:', error);
        showNotification('Error loading user data', 'error');
    }
}

// Update dashboard statistics
function updateDashboardStats(userData) {
    const stats = {
        totalBookings: userData.bookings?.length || 0,
        upcomingBookings: userData.bookings?.filter(b => new Date(b.date) > new Date()).length || 0,
        completedBookings: userData.bookings?.filter(b => new Date(b.date) < new Date()).length || 0
    };

    // Update stats display
    Object.entries(stats).forEach(([key, value]) => {
        const el = document.querySelector(`[data-stat="${key}"]`);
        if (el) {
            el.textContent = value;
        }
    });
}

// Update recent bookings list
function updateRecentBookings(bookings = []) {
    const bookingsList = document.querySelector('.booking-list');
    if (!bookingsList) return;

    bookingsList.innerHTML = bookings.length ? '' : '<p>No bookings found</p>';

    bookings.slice(0, 5).forEach(booking => {
        const status = new Date(booking.date) > new Date() ? 'upcoming' : 'completed';
        
        const bookingItem = document.createElement('div');
        bookingItem.className = 'booking-item';
        bookingItem.innerHTML = `
            <img src="assets/images/${booking.type.toLowerCase()}.jpg" alt="${booking.type}">
            <div class="booking-info">
                <h4>${booking.type}</h4>
                <p>Date: ${new Date(booking.date).toLocaleDateString()}</p>
                <p>Time: ${booking.time}</p>
                <span class="status ${status}">${status}</span>
            </div>
        `;
        
        bookingsList.appendChild(bookingItem);
    });
}
