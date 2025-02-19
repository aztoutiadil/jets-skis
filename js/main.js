// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

// Handle mobile menu toggle
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.menu-toggle')) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Handle smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
            
            // Smooth scroll to target
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Handle active navigation highlighting
function setActiveNavItem() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const navHeight = navbar.offsetHeight;
        
        if (window.scrollY >= sectionTop - navHeight - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSection}`) {
            item.classList.add('active');
        }
    });
}

// Update active nav item on scroll and page load
window.addEventListener('scroll', setActiveNavItem);
window.addEventListener('load', setActiveNavItem);

// Handle navbar transparency on scroll
function handleNavbarTransparency() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavbarTransparency);
window.addEventListener('load', handleNavbarTransparency);

// Navbar Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Animate hamburger menu
        const bars = mobileMenuBtn.querySelectorAll('.bar');
        bars[0].style.transform = mobileMenuBtn.classList.contains('active') 
            ? 'rotate(45deg) translate(8px, 6px)' 
            : 'none';
        bars[1].style.opacity = mobileMenuBtn.classList.contains('active') 
            ? '0' 
            : '1';
        bars[2].style.transform = mobileMenuBtn.classList.contains('active') 
            ? 'rotate(-45deg) translate(7px, -5px)' 
            : 'none';
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class based on scroll position
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Active link highlighting
    const navLinksArray = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinksArray.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            
            const bars = mobileMenuBtn.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
});

// Handle form submission
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            vehicleType: document.getElementById('vehicleType').value,
            jetskiType: document.getElementById('jetskiType').value,
            bateauType: document.getElementById('bateauType').value,
            date: document.getElementById('bookingDate').value,
            time: document.getElementById('bookingTime').value,
            duration: document.getElementById('duration').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };
        
        try {
            // Here you would typically send the data to your backend
            console.log('Booking Details:', formData);
            
            // Show success message
            alert('Booking successful! We will contact you shortly to confirm your reservation.');
            bookingForm.reset();
        } catch (error) {
            console.error('Booking error:', error);
            alert('There was an error processing your booking. Please try again.');
        }
    });
}

// Handle vehicle type selection
document.addEventListener('DOMContentLoaded', function() {
    const vehicleType = document.getElementById('vehicleType');
    const jetskiOptions = document.querySelector('.jetski-options');
    const bateauOptions = document.querySelector('.bateau-options');
    const jetskiDuration = document.getElementById('jetskiDuration');
    const bateauDuration = document.getElementById('bateauDuration');
    
    if (vehicleType) {
        vehicleType.addEventListener('change', function() {
            if (this.value === 'jetski') {
                jetskiOptions.style.display = 'block';
                bateauOptions.style.display = 'none';
                document.getElementById('jetskiType').required = true;
                document.getElementById('bateauType').required = false;
                jetskiDuration.required = true;
                bateauDuration.required = false;
            } else if (this.value === 'bateau') {
                jetskiOptions.style.display = 'none';
                bateauOptions.style.display = 'block';
                document.getElementById('jetskiType').required = false;
                document.getElementById('bateauType').required = true;
                jetskiDuration.required = false;
                bateauDuration.required = true;
            } else {
                jetskiOptions.style.display = 'none';
                bateauOptions.style.display = 'none';
                document.getElementById('jetskiType').required = false;
                document.getElementById('bateauType').required = false;
                jetskiDuration.required = false;
                bateauDuration.required = false;
            }
        });
    }

    // Handle bateau type selection and update duration options
    const bateauType = document.getElementById('bateauType');

    if (bateauType && bateauDuration) {
        bateauType.addEventListener('change', function() {
            bateauDuration.innerHTML = ''; // Clear existing options
            
            if (this.value === 'luxury-yacht') {
                const options = [
                    { value: '2', text: '2 Hours - 5000DH' },
                    { value: '4', text: '4 Hours - 9000DH' },
                    { value: '8', text: '8 Hours - 15000DH' }
                ];
                options.forEach(opt => {
                    const option = new Option(opt.text, opt.value);
                    bateauDuration.add(option);
                });
            } else if (this.value === 'speed-boat') {
                const options = [
                    { value: '2', text: '2 Hours - 2500DH' },
                    { value: '4', text: '4 Hours - 4500DH' },
                    { value: '8', text: '8 Hours - 8000DH' }
                ];
                options.forEach(opt => {
                    const option = new Option(opt.text, opt.value);
                    bateauDuration.add(option);
                });
            } else if (this.value === 'pontoon') {
                const options = [
                    { value: '2', text: '2 Hours - 2000DH' },
                    { value: '4', text: '4 Hours - 3500DH' },
                    { value: '8', text: '8 Hours - 6000DH' }
                ];
                options.forEach(opt => {
                    const option = new Option(opt.text, opt.value);
                    bateauDuration.add(option);
                });
            } else {
                bateauDuration.add(new Option('Select boat type first', ''));
            }
        });
    }
});

// Add animation on scroll
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize scroll animations
window.addEventListener('scroll', handleScrollAnimations);
window.addEventListener('load', handleScrollAnimations);

// Set minimum date for booking to today
const bookingDate = document.getElementById('bookingDate');
if (bookingDate) {
    const today = new Date().toISOString().split('T')[0];
    bookingDate.min = today;
}

// Update pricing based on duration
const durationSelect = document.getElementById('duration');
if (durationSelect) {
    durationSelect.addEventListener('change', () => {
        const duration = parseInt(durationSelect.value);
        const priceDisplay = document.querySelector('.selected-price');
        
        if (priceDisplay) {
            let price;
            switch (duration) {
                case 4: // Half day
                    price = 200;
                    break;
                case 8: // Full day
                    price = 350;
                    break;
                default: // 1 hour
                    price = 80;
            }
            priceDisplay.textContent = `$${price}`;
        }
    });
}
