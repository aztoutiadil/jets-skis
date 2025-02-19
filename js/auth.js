// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Here you would typically make an API call to your backend
            const response = await mockLoginAPI(email, password);
            
            if (response.success) {
                // Store the token in localStorage
                localStorage.setItem('userToken', response.token);
                localStorage.setItem('userRole', response.role);
                
                // Redirect based on role
                if (response.role === 'admin') {
                    window.location.href = '/admin/';
                } else {
                    window.location.href = '/dashboard.html';
                }
            } else {
                alert('Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
        }
    });
}

// Handle registration form submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            // Here you would typically make an API call to your backend
            const response = await mockRegisterAPI({
                fullName,
                email,
                phone,
                password
            });
            
            if (response.success) {
                alert('Registration successful! Please login.');
                window.location.href = '/login.html';
            } else {
                alert('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration. Please try again.');
        }
    });
}

// Mock API functions (Replace these with actual API calls)
async function mockLoginAPI(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email === 'admin@example.com' && password === 'admin123') {
        return {
            success: true,
            token: 'mock-token-admin',
            role: 'admin'
        };
    } else if (email === 'user@example.com' && password === 'user123') {
        return {
            success: true,
            token: 'mock-token-user',
            role: 'user'
        };
    }
    
    return { success: false };
}

async function mockRegisterAPI(userData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock registration (always succeeds)
    return {
        success: true,
        message: 'User registered successfully'
    };
}

// Auth state check
function checkAuth() {
    const token = localStorage.getItem('userToken');
    if (!token) {
        window.location.href = '/login.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    window.location.href = '/login.html';
}

// Add logout event listeners
document.querySelectorAll('.logout').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});
