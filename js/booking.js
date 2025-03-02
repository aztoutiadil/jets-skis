// Booking functionality
document.addEventListener('DOMContentLoaded', () => {
    const bookingChoiceModal = document.getElementById('bookingChoiceModal');
    const bookingConfirmationModal = document.getElementById('bookingConfirmationModal');
    const bookNowBtn = document.querySelector('.navbar-cta');
    const closeButtons = document.querySelectorAll('.close-modal');
    const bookingChoices = document.querySelectorAll('.booking-choice');
    const downloadTicket = document.getElementById('downloadTicket');
    const downloadInvoice = document.getElementById('downloadInvoice');

    // Show booking choice modal when clicking Book Now
    bookNowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        bookingChoiceModal.classList.add('show');
    });

    // Close modals when clicking close button
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            bookingChoiceModal.classList.remove('show');
            bookingConfirmationModal.classList.remove('show');
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === bookingChoiceModal || e.target === bookingConfirmationModal) {
            bookingChoiceModal.classList.remove('show');
            bookingConfirmationModal.classList.remove('show');
        }
    });

    // Handle booking choice selection
    bookingChoices.forEach(choice => {
        choice.addEventListener('click', () => {
            const type = choice.dataset.type;
            const selectedVehicle = choice.closest('.pricing-card').querySelector('h3').textContent;
            const price = choice.closest('.pricing-card').querySelector('.price').textContent;
            
            // Store booking details in sessionStorage
            sessionStorage.setItem('bookingDetails', JSON.stringify({
                vehicleType: selectedVehicle,
                price: price,
                bookingType: type
            }));
            
            // Redirect to payment page
            window.location.href = 'payment.html';
        });
    });

    // Handle form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Simulate payment processing
            await processPayment();
            
            // Show confirmation modal
            bookingConfirmationModal.classList.add('show');
            
            // Clear form
            bookingForm.reset();
        });
    }

    // Handle ticket download
    downloadTicket.addEventListener('click', (e) => {
        e.preventDefault();
        generateTicket();
    });

    // Handle invoice download
    downloadInvoice.addEventListener('click', (e) => {
        e.preventDefault();
        generateInvoice();
    });
});

// Scroll to booking section
function scrollToBookingSection(type) {
    const bookingSection = document.getElementById('booking');
    bookingSection.scrollIntoView({ behavior: 'smooth' });
    
    // Update form based on type
    const vehicleType = document.getElementById('vehicleType');
    if (vehicleType) {
        vehicleType.value = type;
        // Trigger change event to update pricing if needed
        vehicleType.dispatchEvent(new Event('change'));
    }
}

// Process payment
async function processPayment() {
    // Simulate payment processing
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 1500);
    });
}

// Generate ticket
function generateTicket() {
    const ticketData = {
        bookingId: generateBookingId(),
        date: new Date().toLocaleDateString(),
        type: document.getElementById('vehicleType').value,
        time: document.getElementById('timeSlot').value,
        name: document.getElementById('name').value
    };

    generatePDF('ticket', ticketData);
}

// Generate invoice
function generateInvoice() {
    const invoiceData = {
        invoiceId: generateInvoiceId(),
        date: new Date().toLocaleDateString(),
        amount: calculateTotal(),
        type: document.getElementById('vehicleType').value,
        name: document.getElementById('name').value
    };

    generatePDF('invoice', invoiceData);
}

// Generate PDF
function generatePDF(type, data) {
    // Create PDF content
    const content = type === 'ticket' 
        ? generateTicketContent(data)
        : generateInvoiceContent(data);

    // Create PDF using jsPDF
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(content, 20, 20);
    doc.save(`${type}_${data.bookingId || data.invoiceId}.pdf`);
}

// Generate ticket content
function generateTicketContent(data) {
    return `
        BlueMotion Water Sports
        Booking Ticket
        
        Booking ID: ${data.bookingId}
        Date: ${data.date}
        Vehicle: ${data.type}
        Time: ${data.time}
        Name: ${data.name}
        
        Please arrive 15 minutes before your scheduled time.
        Don't forget to bring your ID and swimming gear!
    `;
}

// Generate invoice content
function generateInvoiceContent(data) {
    return `
        BlueMotion Water Sports
        Invoice
        
        Invoice ID: ${data.invoiceId}
        Date: ${data.date}
        Amount: $${data.amount}
        Service: ${data.type} Rental
        Customer: ${data.name}
        
        Thank you for choosing BlueMotion Water Sports!
    `;
}

// Generate random IDs
function generateBookingId() {
    return 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function generateInvoiceId() {
    return 'INV' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Calculate total based on selected options
function calculateTotal() {
    const basePrice = document.getElementById('vehicleType').value === 'jetski' ? 199 : 499;
    const hours = parseInt(document.getElementById('duration').value) || 1;
    return basePrice * hours;
}
