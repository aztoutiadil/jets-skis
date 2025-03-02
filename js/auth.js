document.addEventListener('DOMContentLoaded', () => {
    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.querySelector('#password');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password'),
                remember: formData.get('remember') === 'on'
            };

            try {
                const response = await fetch('backend/api/auth/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Store user data in localStorage
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Redirect based on user role
                    if (data.user.role === 'admin') {
                        window.location.href = 'admin/index.html';
                    } else {
                        window.location.href = 'user-dashboard.html';
                    }
                } else {
                    showError(data.message || 'Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Login error:', error);
                showError('An error occurred. Please try again.');
            }
        });
    }

    // Handle registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const registerData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword')
            };

            // Validate passwords match
            if (registerData.password !== registerData.confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            try {
                const response = await fetch('backend/api/auth/register.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(registerData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Store user data
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Show success message and redirect
                    showSuccess('Registration successful! Redirecting to dashboard...');
                    setTimeout(() => {
                        window.location.href = 'user-dashboard.html';
                    }, 1500);
                } else {
                    showError(data.message || 'Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showError('An error occurred. Please try again.');
            }
        });
    }

    // Helper functions for displaying messages
    function showError(message) {
        const errorDiv = document.querySelector('.auth-error') || document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.textContent = message;
        
        const form = document.querySelector('.auth-form');
        if (!document.querySelector('.auth-error')) {
            form.insertBefore(errorDiv, form.firstChild);
        }
    }

    function showSuccess(message) {
        const successDiv = document.querySelector('.auth-success') || document.createElement('div');
        successDiv.className = 'auth-success';
        successDiv.textContent = message;
        
        const form = document.querySelector('.auth-form');
        if (!document.querySelector('.auth-success')) {
            form.insertBefore(successDiv, form.firstChild);
        }
    }

    // Check authentication status on protected pages
    function checkAuth() {
        const user = JSON.parse(localStorage.getItem('user'));
        const isProtectedPage = window.location.pathname.includes('dashboard') || 
                              window.location.pathname.includes('admin');
        
        if (isProtectedPage && !user) {
            window.location.href = 'login.html';
            return;
        }

        if (user && window.location.pathname.includes('admin') && user.role !== 'admin') {
            window.location.href = 'user-dashboard.html';
        }
    }

    // Run auth check
    checkAuth();
});
