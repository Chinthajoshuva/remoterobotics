// Authentication
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

// Login Modal
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeModalBtn = document.querySelector('.close');

if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });

    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
}

// Login handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple authentication (replace with actual authentication)
        if (username && password) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            window.location.href = 'schedule.html';
        }
    });
}

// Logout handling
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    });
}

// Calendar functionality
class Calendar {
    constructor() {
        this.date = new Date();
        this.currentMonth = this.date.getMonth();
        this.currentYear = this.date.getFullYear();
        this.selectedDate = null;
        this.bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        
        this.initializeCalendar();
    }

    initializeCalendar() {
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');
        const currentMonth = document.getElementById('currentMonth');
        
        if (prevMonth && nextMonth) {
            prevMonth.addEventListener('click', () => this.changeMonth(-1));
            nextMonth.addEventListener('click', () => this.changeMonth(1));
        }
        
        this.renderCalendar();
        this.renderTimeSlots();
    }

    changeMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.renderCalendar();
    }

    renderCalendar() {
        const currentMonth = document.getElementById('currentMonth');
        const calendarGrid = document.querySelector('.calendar-grid');
        if (!currentMonth || !calendarGrid) return;

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        currentMonth.textContent = `${months[this.currentMonth]} ${this.currentYear}`;
        
        // Clear previous days
        while (calendarGrid.children.length > 7) {
            calendarGrid.removeChild(calendarGrid.lastChild);
        }

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startingDay = firstDay.getDay();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const currentDate = new Date(this.currentYear, this.currentMonth, day);
            if (currentDate < new Date().setHours(0,0,0,0)) {
                dayElement.classList.add('past');
            } else {
                dayElement.addEventListener('click', () => this.selectDate(day));
            }
            
            if (this.selectedDate === day) {
                dayElement.classList.add('selected');
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }

    selectDate(day) {
        this.selectedDate = day;
        this.renderCalendar();
        this.renderTimeSlots();
    }

    renderTimeSlots() {
        const timeSlotsGrid = document.querySelector('.time-slots-grid');
        if (!timeSlotsGrid || !this.selectedDate) return;

        timeSlotsGrid.innerHTML = '';
        const timeSlots = this.generateTimeSlots();
        
        timeSlots.forEach(slot => {
            const slotElement = document.createElement('div');
            slotElement.className = 'time-slot';
            
            const isBooked = this.checkIfBooked(slot);
            slotElement.classList.add(isBooked ? 'booked' : 'available');
            
            slotElement.textContent = slot;
            
            if (!isBooked) {
                slotElement.addEventListener('click', () => this.selectTimeSlot(slot));
            }
            
            timeSlotsGrid.appendChild(slotElement);
        });
    }

    generateTimeSlots() {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        return slots;
    }

    checkIfBooked(timeSlot) {
        return this.bookings.some(booking => 
            booking.date === `${this.currentYear}-${this.currentMonth + 1}-${this.selectedDate}` &&
            booking.time === timeSlot
        );
    }

    selectTimeSlot(timeSlot) {
        const selectedRobot = document.querySelector('.robot-card.selected');
        if (!selectedRobot) {
            alert('Please select a robot first');
            return;
        }

        // Show booking confirmation modal
        const bookingConfirmation = document.getElementById('bookingConfirmation');
        const confirmDate = document.getElementById('confirmDate');
        const confirmTime = document.getElementById('confirmTime');
        const confirmRobot = document.getElementById('confirmRobot');

        confirmDate.textContent = `${this.currentYear}-${this.currentMonth + 1}-${this.selectedDate}`;
        confirmTime.textContent = timeSlot;
        confirmRobot.textContent = selectedRobot.querySelector('h4').textContent;

        bookingConfirmation.classList.add('active');
    }
}

// Robot Selection
const robotCards = document.querySelectorAll('.robot-card');
robotCards.forEach(card => {
    card.addEventListener('click', () => {
        robotCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    });
});

// Booking Form
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const booking = {
            date: document.getElementById('selectedDate').value,
            time: document.getElementById('selectedTime').value,
            robot: document.getElementById('selectedRobot').value,
            duration: document.getElementById('duration').value,
            purpose: document.getElementById('purpose').value,
            timestamp: new Date().toISOString()
        };
        
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        showNotification('Booking confirmed successfully!');
        window.location.href = 'access.html';
    });
}

// Cancel booking
const cancelBooking = document.getElementById('cancelBooking');
if (cancelBooking) {
    cancelBooking.addEventListener('click', () => {
        document.querySelector('.booking-form').style.display = 'none';
    });
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize calendar if on schedule page
if (document.querySelector('.calendar-grid')) {
    new Calendar();
}

// Robot Control
const jointSliders = document.querySelectorAll('.joint-slider');
jointSliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
        const value = e.target.value;
        e.target.nextElementSibling.textContent = `${value}°`;
        // Here you would send the joint values to the robot
    });
});

// Check authentication on page load
// checkAuth();

// Video Feed Initialization
function initializeVideoFeeds() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        // Create placeholder for video feed
        const placeholder = document.createElement('div');
        placeholder.className = 'video-placeholder';
        placeholder.style.width = '100%';
        placeholder.style.height = '100%';
        placeholder.style.backgroundColor = '#000';
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.color = '#fff';
        placeholder.innerHTML = '<p>Video Feed Connecting...</p>';
        
        container.appendChild(placeholder);
    });
}

// Initialize video feeds if on access page
if (document.querySelector('.camera-section')) {
    initializeVideoFeeds();
}

// Jupyter Notebook Initialization
function initializeNotebook() {
    const notebookContent = document.getElementById('jupyterNotebook');
    if (!notebookContent) return;

    // Create iframe for Jupyter notebook
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    // Replace with your actual Jupyter notebook URL
    iframe.src = 'about:blank';
    
    // Add placeholder message
    const placeholder = document.createElement('div');
    placeholder.style.width = '100%';
    placeholder.style.height = '100%';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.backgroundColor = '#fff';
    placeholder.innerHTML = '<p>Jupyter Notebook Loading...</p>';
    
    notebookContent.appendChild(placeholder);
}

// Initialize notebook if on access page
if (document.querySelector('.notebook-section')) {
    initializeNotebook();
}

// Booking Confirmation Handling
const bookingConfirmation = document.getElementById('bookingConfirmation');
const cancelConfirmation = document.getElementById('cancelConfirmation');
const confirmBooking = document.getElementById('confirmBooking');

if (cancelConfirmation) {
    cancelConfirmation.addEventListener('click', () => {
        bookingConfirmation.classList.remove('active');
    });
}

if (confirmBooking) {
    confirmBooking.addEventListener('click', () => {
        const booking = {
            date: document.getElementById('confirmDate').textContent,
            time: document.getElementById('confirmTime').textContent,
            robot: document.getElementById('confirmRobot').textContent,
            duration: document.getElementById('confirmDuration').value,
            purpose: document.getElementById('confirmPurpose').value,
            username: localStorage.getItem('username'),
            timestamp: new Date().toISOString()
        };

        // Save booking to localStorage
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Show success notification
        showNotification('Booking confirmed successfully!');

        // Close modal and redirect to access page
        bookingConfirmation.classList.remove('active');
        setTimeout(() => {
            window.location.href = 'access.html';
        }, 1500);
    });
}

// Close modal when clicking outside
if (bookingConfirmation) {
    bookingConfirmation.addEventListener('click', (e) => {
        if (e.target === bookingConfirmation) {
            bookingConfirmation.classList.remove('active');
        }
    });
}

// Real-time Scheduling and Session Management
class SessionManager {
    constructor() {
        this.currentSession = null;
        this.countdownInterval = null;
        this.checkInterval = null;
        this.initializeSession();
    }

    initializeSession() {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const currentTime = new Date();
        
        // Find the current or upcoming session
        this.currentSession = bookings.find(booking => {
            const sessionStart = new Date(`${booking.date}T${booking.time}`);
            const sessionEnd = new Date(sessionStart.getTime() + (booking.duration * 60 * 60 * 1000));
            return currentTime >= sessionStart && currentTime <= sessionEnd;
        });

        if (this.currentSession) {
            this.updateSessionInfo();
            this.startCountdown();
            this.startSessionCheck();
        } else {
            this.checkUpcomingSessions();
        }
    }

    updateSessionInfo() {
        const currentRobot = document.getElementById('currentRobot');
        const sessionDate = document.getElementById('sessionDate');
        
        if (currentRobot) currentRobot.textContent = this.currentSession.robot;
        if (sessionDate) sessionDate.textContent = this.currentSession.date;
    }

    startCountdown() {
        const sessionEnd = new Date(
            `${this.currentSession.date}T${this.currentSession.time}`
        ).getTime() + (this.currentSession.duration * 60 * 60 * 1000);

        this.countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = sessionEnd - now;

            if (distance <= 0) {
                this.handleSessionEnd();
                return;
            }

            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

            // Show notifications for last 5 minutes
            if (minutes <= 5 && minutes > 0) {
                this.showUrgentNotification(`Session ending in ${minutes} minutes!`);
            }
        }, 1000);
    }

    startSessionCheck() {
        this.checkInterval = setInterval(() => {
            const now = new Date();
            const sessionEnd = new Date(
                `${this.currentSession.date}T${this.currentSession.time}`
            ).getTime() + (this.currentSession.duration * 60 * 60 * 1000);

            if (now.getTime() > sessionEnd) {
                this.handleSessionEnd();
            }
        }, 60000); // Check every minute
    }

    handleSessionEnd() {
        clearInterval(this.countdownInterval);
        clearInterval(this.checkInterval);
        
        this.showNotification('Your session has ended. Click here to schedule a new session.', true);
        this.currentSession = null;
        this.checkUpcomingSessions();
    }

    checkUpcomingSessions() {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const now = new Date();
        
        const upcomingSession = bookings.find(booking => {
            const sessionStart = new Date(`${booking.date}T${booking.time}`);
            return sessionStart > now;
        });

        if (upcomingSession) {
            const timeUntilSession = upcomingSession.startTime - now;
            if (timeUntilSession <= 5 * 60 * 1000) { // 5 minutes before session
                this.showNotification(`Your session starts in 5 minutes! Click here to access the robot.`, true);
            }
        }
    }

    showNotification(message, isUrgent = false) {
        const notification = document.createElement('div');
        notification.className = `notification${isUrgent ? ' urgent' : ''}`;
        notification.textContent = message;
        
        notification.addEventListener('click', () => {
            if (isUrgent) {
                window.location.href = 'schedule.html';
            }
        });

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showUrgentNotification(message) {
        this.showNotification(message, true);
    }
}

// Initialize session manager if on access page
if (document.querySelector('.access-container')) {
    new SessionManager();
}

// Course Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.course-nav-btn');
    const courseGrids = document.querySelectorAll('.courses-grid');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and grids
            navButtons.forEach(btn => btn.classList.remove('active'));
            courseGrids.forEach(grid => grid.classList.remove('active'));

            // Add active class to clicked button and corresponding grid
            button.classList.add('active');
            const category = button.dataset.category;
            document.getElementById(`${category}-courses`).classList.add('active');
        });
    });
});

// Form Validation and Accessibility
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const formInputs = contactForm.querySelectorAll('input, select');

    // Add error message elements
    formInputs.forEach(input => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.setAttribute('aria-live', 'polite');
        input.parentNode.appendChild(errorDiv);
    });

    // Custom validation messages
    const validationMessages = {
        name: {
            valueMissing: 'Please enter your name',
            tooShort: 'Name must be at least 2 characters'
        },
        email: {
            valueMissing: 'Please enter your email address',
            typeMismatch: 'Please enter a valid email address'
        },
        phone: {
            valueMissing: 'Please enter your phone number',
            patternMismatch: 'Please enter a valid phone number'
        },
        program: {
            valueMissing: 'Please select a program'
        }
    };

    // Handle input validation
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(input);
        });

        input.addEventListener('input', function() {
            if (input.hasAttribute('aria-invalid')) {
                validateInput(input);
            }
        });
    });

    // Validate individual input
    function validateInput(input) {
        const errorDiv = input.parentNode.querySelector('.error-message');
        let errorMessage = '';

        if (!input.validity.valid) {
            input.setAttribute('aria-invalid', 'true');
            
            // Get appropriate error message
            if (input.validity.valueMissing) {
                errorMessage = validationMessages[input.name].valueMissing;
            } else if (input.validity.typeMismatch) {
                errorMessage = validationMessages[input.name].typeMismatch;
            } else if (input.validity.tooShort) {
                errorMessage = validationMessages[input.name].tooShort;
            } else if (input.validity.patternMismatch) {
                errorMessage = validationMessages[input.name].patternMismatch;
            }

            errorDiv.textContent = errorMessage;
        } else {
            input.removeAttribute('aria-invalid');
            errorDiv.textContent = '';
        }
    }

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all inputs
        let isValid = true;
        formInputs.forEach(input => {
            validateInput(input);
            if (!input.validity.valid) {
                isValid = false;
            }
        });

        if (isValid) {
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Booking...';

            // Simulate form submission
            setTimeout(() => {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.setAttribute('role', 'alert');
                successMessage.textContent = 'Thank you! We will contact you shortly to confirm your free class.';
                
                contactForm.reset();
                contactForm.appendChild(successMessage);
                
                submitButton.disabled = false;
                submitButton.textContent = 'BOOK FREE LIVE CLASS';

                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }, 1500);
        } else {
            // Focus first invalid input
            const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });
});

// Countdown Timer
function startCountdown() {
    let minutes = 30;
    let seconds = 0;
    
    const countdownInterval = setInterval(() => {
        if (minutes === 0 && seconds === 0) {
            clearInterval(countdownInterval);
            alert('Session time is up!');
            window.location.href = 'schedule.html';
            return;
        }
        
        if (seconds === 0) {
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Start countdown when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('countdownTimer')) {
        startCountdown();
    }
}); 