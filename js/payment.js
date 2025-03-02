// Import QR Code library
import QRCode from 'https://cdn.jsdelivr.net/npm/qrcode@1.5.0/+esm';
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm';

// Initialize Stripe
const stripe = Stripe('your_publishable_key'); // Replace with your Stripe publishable key
const elements = stripe.elements();

// Create card element
const cardElement = elements.create('card', {
    style: {
        base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '"Poppins", sans-serif',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const cardErrors = document.getElementById('card-errors');
    const bookingForm = document.getElementById('bookingForm');

    // Mount card element
    cardElement.mount('#card-element');

    // Handle payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            const paymentType = this.dataset.method;
            
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            // Add active class to selected method
            this.classList.add('active');

            // Show/hide appropriate payment form
            if (paymentType === 'card') {
                document.getElementById('card-element').style.display = 'block';
                // Hide PayPal button if it exists
                const paypalButton = document.querySelector('.paypal-button');
                if (paypalButton) paypalButton.style.display = 'none';
            } else if (paymentType === 'paypal') {
                document.getElementById('card-element').style.display = 'none';
                initializePayPal();
            }
        });
    });

    // Handle form submission
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const activeMethod = document.querySelector('.payment-method.active');
        if (!activeMethod) {
            alert('Please select a payment method');
            return;
        }

        const paymentType = activeMethod.dataset.method;

        if (paymentType === 'card') {
            // Process card payment
            try {
                const {token, error} = await stripe.createToken(cardElement);

                if (error) {
                    cardErrors.textContent = error.message;
                    return;
                }

                // Here you would send the token to your server
                console.log('Payment token:', token);
                
                // Process the booking
                processBooking({
                    paymentMethod: 'card',
                    token: token.id
                });

            } catch (error) {
                console.error('Payment error:', error);
                cardErrors.textContent = 'An error occurred processing your payment. Please try again.';
            }
        } else if (paymentType === 'paypal') {
            // PayPal payment is handled by the PayPal button
            console.log('Processing PayPal payment...');
        }
    });
});

// Initialize PayPal
function initializePayPal() {
    // Add PayPal button if it doesn't exist
    if (!document.querySelector('.paypal-button')) {
        const paypalButton = document.createElement('div');
        paypalButton.className = 'paypal-button';
        document.getElementById('card-element').parentNode.insertBefore(paypalButton, document.getElementById('card-errors'));

        // Initialize PayPal button
        paypal.Buttons({
            createOrder: function(data, actions) {
                // Get booking details and calculate total
                const duration = document.getElementById('duration').value;
                const total = calculateTotal(duration);

                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    // Process the booking
                    processBooking({
                        paymentMethod: 'paypal',
                        orderId: details.id
                    });
                });
            }
        }).render('.paypal-button');
    }
}

// Calculate total based on duration and vehicle type
function calculateTotal(duration) {
    // Add your pricing logic here
    const basePrice = 299; // Base price per hour
    return basePrice * duration;
}

// Process the booking
async function processBooking(paymentDetails) {
    try {
        // Here you would send the booking and payment details to your server
        console.log('Processing booking with payment:', paymentDetails);
        
        // Show success message
        alert('Booking successful! You will receive a confirmation email shortly.');
        document.getElementById('bookingModal').style.display = 'none';
    } catch (error) {
        console.error('Booking error:', error);
        alert('There was an error processing your booking. Please try again.');
    }
}

// Payment form handling
const creditCardForm = document.getElementById('creditCardForm');
const paypalForm = document.getElementById('paypalForm');
const confirmationModal = document.getElementById('confirmationModal');
const closeModal = document.querySelector('.close');

// Format credit card number with spaces
const cardNumberInput = document.getElementById('cardNumber');
cardNumberInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = formattedValue;
});

// Format expiry date
const expiryDateInput = document.getElementById('expiryDate');
expiryDateInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
});

// Calculate total amount
function calculateTotalAmount() {
    const vehicleSelect = document.getElementById('vehicleSelect');
    const durationInput = document.getElementById('duration');
    
    const selectedVehicle = vehicleSelect.options[vehicleSelect.selectedIndex];
    const pricePerHour = parseFloat(selectedVehicle.dataset.price) || 0;
    const duration = parseInt(durationInput.value) || 0;
    
    const rentalPrice = pricePerHour * duration;
    const insurance = 150;
    const tax = (rentalPrice + insurance) * 0.2;
    const total = rentalPrice + insurance + tax;
    
    document.getElementById('rentalPrice').textContent = `${rentalPrice} DH`;
    document.getElementById('taxAmount').textContent = `${tax.toFixed(2)} DH`;
    document.getElementById('totalAmount').textContent = `${total.toFixed(2)} DH`;
    
    return { rentalPrice, insurance, tax, total };
}

// Update total when inputs change
document.getElementById('vehicleSelect').addEventListener('change', calculateTotalAmount);
document.getElementById('duration').addEventListener('input', calculateTotalAmount);

// Handle form submission
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        vehicle: document.getElementById('vehicleSelect').options[document.getElementById('vehicleSelect').selectedIndex].text,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        duration: document.getElementById('duration').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
    };
    
    // Generate ticket number
    const ticketNumber = 'BM' + Date.now().toString().slice(-8);
    
    // Update ticket details
    document.getElementById('ticketNumber').textContent = `Ticket #${ticketNumber}`;
    document.getElementById('ticketVehicle').textContent = formData.vehicle;
    document.getElementById('ticketDate').textContent = formData.date;
    document.getElementById('ticketTime').textContent = formData.time;
    document.getElementById('ticketDuration').textContent = `${formData.duration} hours`;
    document.getElementById('ticketAmount').textContent = document.getElementById('totalAmount').textContent;
    
    // Generate QR code
    const qrData = JSON.stringify({
        ticketNumber,
        vehicle: formData.vehicle,
        date: formData.date,
        time: formData.time
    });
    
    try {
        const qrCode = await QRCode.toCanvas(qrData, {
            width: 128,
            margin: 2,
            color: {
                dark: '#000',
                light: '#fff'
            }
        });
        
        const qrContainer = document.getElementById('ticketQR');
        qrContainer.innerHTML = '';
        qrContainer.appendChild(qrCode);
        
        // Show confirmation modal
        confirmationModal.style.display = 'block';
    } catch (error) {
        console.error('Error generating QR code:', error);
    }
});

// Close modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
    });
}

// Download ticket
document.getElementById('downloadTicket').addEventListener('click', () => {
    generatePDF('ticket');
});

// Download invoice
document.getElementById('downloadInvoice').addEventListener('click', () => {
    generatePDF('invoice');
});

// Generate PDF function
function generatePDF(type) {
    const { rentalPrice, insurance, tax, total } = calculateTotalAmount();
    const doc = new jsPDF();
    
    if (type === 'ticket') {
        // Generate ticket PDF
        doc.setFontSize(24);
        doc.text('BlueMotion Ticket', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Ticket #${document.getElementById('ticketNumber').textContent}`, 20, 40);
        doc.text(`Vehicle: ${document.getElementById('ticketVehicle').textContent}`, 20, 50);
        doc.text(`Date: ${document.getElementById('ticketDate').textContent}`, 20, 60);
        doc.text(`Time: ${document.getElementById('ticketTime').textContent}`, 20, 70);
        doc.text(`Duration: ${document.getElementById('ticketDuration').textContent}`, 20, 80);
        doc.text(`Amount Paid: ${document.getElementById('ticketAmount').textContent}`, 20, 90);
        
        // Add QR code
        const qrCanvas = document.querySelector('#ticketQR canvas');
        if (qrCanvas) {
            const qrImage = qrCanvas.toDataURL('image/jpeg', 1.0);
            doc.addImage(qrImage, 'JPEG', 70, 100, 70, 70);
        }
        
        doc.save('bluemotion-ticket.pdf');
    } else {
        // Generate invoice PDF
        doc.setFontSize(24);
        doc.text('BlueMotion Invoice', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text('BlueMotion Water Sports', 20, 40);
        doc.text('123 Beach Avenue', 20, 50);
        doc.text('Agadir, Morocco', 20, 60);
        
        const today = new Date().toLocaleDateString();
        doc.text(`Date: ${today}`, 150, 40);
        doc.text(`Invoice #: INV-${Date.now().toString().slice(-8)}`, 150, 50);
        
        // Customer details
        doc.text('Bill To:', 20, 80);
        doc.text(document.getElementById('name').value, 20, 90);
        doc.text(document.getElementById('email').value, 20, 100);
        doc.text(document.getElementById('phone').value, 20, 110);
        
        // Invoice items
        doc.line(20, 130, 190, 130);
        doc.text('Description', 20, 140);
        doc.text('Amount', 150, 140);
        doc.line(20, 145, 190, 145);
        
        let y = 155;
        doc.text('Vehicle Rental', 20, y);
        doc.text(`${rentalPrice} DH`, 150, y);
        
        y += 10;
        doc.text('Insurance', 20, y);
        doc.text(`${insurance} DH`, 150, y);
        
        y += 10;
        doc.text('Tax (20%)', 20, y);
        doc.text(`${tax.toFixed(2)} DH`, 150, y);
        
        doc.line(20, y + 5, 190, y + 5);
        y += 15;
        doc.setFontSize(14);
        doc.text('Total:', 20, y);
        doc.text(`${total.toFixed(2)} DH`, 150, y);
        
        doc.save('bluemotion-invoice.pdf');
    }
}

// Payment functionality
document.addEventListener('DOMContentLoaded', () => {
    // Load booking details from sessionStorage
    const bookingDetails = JSON.parse(sessionStorage.getItem('bookingDetails') || '{}');
    
    // Update summary section
    const summarySection = document.querySelector('.booking-summary');
    if (summarySection && bookingDetails.vehicleType) {
        document.getElementById('selected-vehicle').textContent = bookingDetails.vehicleType;
        document.getElementById('booking-type').textContent = bookingDetails.bookingType;
        document.getElementById('total-amount').textContent = bookingDetails.price;
    }

    // Handle payment form submission
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(paymentForm);
            const paymentDetails = {
                cardNumber: formData.get('card-number'),
                expiryDate: formData.get('expiry'),
                cvv: formData.get('cvv'),
                name: formData.get('card-name'),
                ...bookingDetails
            };

            try {
                // Send payment details to backend
                const response = await fetch('backend/api/process-payment.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(paymentDetails)
                });

                if (response.ok) {
                    // Clear booking details from session
                    sessionStorage.removeItem('bookingDetails');
                    
                    // Show success message and redirect to confirmation
                    alert('Payment successful! Your booking has been confirmed.');
                    window.location.href = 'dashboard.html';
                } else {
                    throw new Error('Payment failed');
                }
            } catch (error) {
                alert('Payment failed. Please try again.');
                console.error('Payment error:', error);
            }
        });
    }
});

// Get booking data from session storage
const bookingData = JSON.parse(sessionStorage.getItem('bookingData'));
if (!bookingData) {
    window.location.href = 'index.html';
    return;
}

// Display booking summary
const summaryContainer = document.getElementById('bookingSummary');
if (summaryContainer) {
    summaryContainer.innerHTML = `
        <h3>Booking Summary</h3>
        <div class="summary-item">
            <span>Package:</span>
            <span>${bookingData.package.charAt(0).toUpperCase() + bookingData.package.slice(1)} Package</span>
        </div>
        <div class="summary-item">
            <span>Date:</span>
            <span>${new Date(bookingData.date).toLocaleDateString()}</span>
        </div>
        <div class="summary-item">
            <span>Time:</span>
            <span>${bookingData.time}</span>
        </div>
        <div class="summary-item">
            <span>Duration:</span>
            <span>${bookingData.duration} hour${bookingData.duration > 1 ? 's' : ''}</span>
        </div>
        <div class="summary-item total">
            <span>Total:</span>
            <span>$${bookingData.total}</span>
        </div>
    `;
}

// Handle payment form submission
const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = paymentForm.querySelector('button[type="submit"]');
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'spinner';
        submitBtn.disabled = true;
        submitBtn.innerHTML = '';
        submitBtn.appendChild(loadingSpinner);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Clear booking data from session storage
            sessionStorage.removeItem('bookingData');

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Payment Successful!</h3>
                <p>Your booking has been confirmed. You will receive a confirmation email shortly.</p>
                <button onclick="window.location.href='index.html'" class="back-home">Back to Home</button>
            `;

            const container = document.querySelector('.container');
            container.innerHTML = '';
            container.appendChild(successMessage);

            // Send confirmation email (simulated)
            sendConfirmationEmail(bookingData);

        } catch (error) {
            console.error('Payment error:', error);
            const errorDiv = document.querySelector('.payment-error') || document.createElement('div');
            errorDiv.className = 'payment-error';
            errorDiv.textContent = 'There was an error processing your payment. Please try again.';
            if (!document.querySelector('.payment-error')) {
                paymentForm.insertBefore(errorDiv, submitBtn);
            }
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Pay Now';
        }
    });
}

// Credit card form validation
const cardNumberInput = document.getElementById('cardNumber');
const cardExpiryInput = document.getElementById('cardExpiry');
const cardCVVInput = document.getElementById('cardCVV');

if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value.substring(0, 19);
    });
}

if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        e.target.value = value.substring(0, 5);
    });
}

if (cardCVVInput) {
    cardCVVInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
}

// Validate form before submission
function validatePaymentForm() {
    const cardNumber = cardNumberInput.value.replace(/\s/g, '');
    const cardExpiry = cardExpiryInput.value;
    const cardCVV = cardCVVInput.value;

    const errors = [];

    if (cardNumber.length !== 16) {
        errors.push('Please enter a valid 16-digit card number');
    }

    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        errors.push('Please enter a valid expiry date (MM/YY)');
    } else {
        const [month, year] = cardExpiry.split('/');
        const now = new Date();
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        if (expiry < now) {
            errors.push('Card has expired');
        }
    }

    if (cardCVV.length !== 3) {
        errors.push('Please enter a valid 3-digit CVV');
    }

    return errors;
}

// Handle form validation on submit
if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
        const errors = validatePaymentForm();
        if (errors.length > 0) {
            e.preventDefault();
            const errorDiv = document.querySelector('.payment-error') || document.createElement('div');
            errorDiv.className = 'payment-error';
            errorDiv.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
            if (!document.querySelector('.payment-error')) {
                paymentForm.insertBefore(errorDiv, paymentForm.querySelector('button'));
            }
        }
    });
}

// Simulated email confirmation
function sendConfirmationEmail(bookingData) {
    const emailContent = `
        Dear ${bookingData.name},

        Thank you for booking with BlueMotion! Your reservation has been confirmed.

        Booking Details:
        - Package: ${bookingData.package.charAt(0).toUpperCase() + bookingData.package.slice(1)} Package
        - Date: ${new Date(bookingData.date).toLocaleDateString()}
        - Time: ${bookingData.time}
        - Duration: ${bookingData.duration} hour${bookingData.duration > 1 ? 's' : ''}
        - Total Paid: $${bookingData.total}

        Please arrive 15 minutes before your scheduled time for a safety briefing.
        Don't forget to bring:
        - Valid ID
        - Swimming attire
        - Towel
        - Sunscreen

        Location: 123 Beach Drive, Marina Bay

        If you need to modify or cancel your booking, please contact us at least 24 hours in advance.

        We look forward to seeing you!

        Best regards,
        BlueMotion Team
    `;

    console.log('Confirmation email sent:', emailContent);
}
