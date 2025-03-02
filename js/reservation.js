document.addEventListener('DOMContentLoaded', () => {
    // Get all Book Now buttons
    const bookNowButtons = document.querySelectorAll('.book-now');
    const reservationSection = document.getElementById('reservation-section');
    const pricingSection = document.getElementById('pricing');
    const packageInput = document.getElementById('package');
    const summaryPackage = document.getElementById('summary-package');
    const summaryDuration = document.getElementById('summary-duration');
    const summaryTotal = document.getElementById('summary-total');
    const durationSelect = document.getElementById('duration');
    const reservationForm = document.getElementById('reservationForm');

    // Package prices (you can adjust these)
    const packagePrices = {
        basic: 99,
        standard: 149,
        premium: 199
    };

    // Handle Book Now button clicks
    bookNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const packageType = button.dataset.item;
            
            // Hide pricing section and show reservation form
            pricingSection.style.display = 'none';
            reservationSection.style.display = 'block';
            
            // Set the package type in the form
            packageInput.value = packageType.charAt(0).toUpperCase() + packageType.slice(1);
            summaryPackage.textContent = packageType.charAt(0).toUpperCase() + packageType.slice(1);
            
            // Update total
            updateTotal(packageType, durationSelect.value);
            
            // Scroll to reservation section
            reservationSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Update total when duration changes
    durationSelect.addEventListener('change', (e) => {
        const packageType = packageInput.value.toLowerCase();
        const duration = e.target.value;
        updateTotal(packageType, duration);
        summaryDuration.textContent = `${duration} Hour${duration > 1 ? 's' : ''}`;
    });

    // Handle form submission
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(reservationForm);
        const reservationData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            date: formData.get('reservationDate'),
            time: formData.get('reservationTime'),
            duration: formData.get('duration'),
            package: formData.get('package'),
            total: summaryTotal.textContent.replace('$', '')
        };
        
        // Store reservation data in session storage
        sessionStorage.setItem('reservationData', JSON.stringify(reservationData));
        
        // Redirect to payment page
        window.location.href = 'payment.html';
    });

    // Helper function to update total
    function updateTotal(packageType, duration) {
        const basePrice = packagePrices[packageType.toLowerCase()] || 99;
        const total = basePrice * duration;
        summaryTotal.textContent = `$${total}`;
    }
});
