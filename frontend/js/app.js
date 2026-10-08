// Configuration
const API_BASE_URL = 'http://localhost:8080/api/students';

// DOM Elements
const form = document.getElementById('studentForm');
const alertBanner = document.getElementById('alertBanner');
const submitBtn = document.getElementById('submitBtn');

// Field references
const fields = {
    name: {
        input: document.getElementById('name'),
        error: document.getElementById('nameError'),
        validate: (val) => {
            if (!val || val.trim().length === 0) return 'Name cannot be empty';
            const nameRegex = /^[a-zA-Z ]{3,20}$/;
            if (!nameRegex.test(val.trim())) return 'Invalid Name (3-20 letters required)';
            return null;
        }
    },
    email: {
        input: document.getElementById('email'),
        error: document.getElementById('emailError'),
        validate: (val) => {
            if (!val || val.trim().length === 0) return 'Please enter Email-ID';
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(val.trim())) return 'Invalid Email';
            return null;
        }
    },
    phone: {
        input: document.getElementById('phone'),
        error: document.getElementById('phoneError'),
        validate: (val) => {
            if (!val) return 'Invalid Phone Number';
            const num = parseInt(val, 10);
            if (isNaN(num) || num < 6000000000 || num > 9999999999) {
                return 'Invalid Phone Number (10 digits starting 6-9)';
            }
            return null;
        }
    },
    dob: {
        input: document.getElementById('dob'),
        error: document.getElementById('dobError'),
        validate: (val) => {
            if (!val) return 'Please enter DOB';
            const selected = new Date(val);
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            if (selected > today) return 'Please enter valid date (cannot be future)';
            return null;
        }
    },
    age: {
        input: document.getElementById('age'),
        error: document.getElementById('ageError'),
        validate: (val) => {
            if (!val) return 'Please enter Age';
            const num = parseInt(val, 10);
            if (isNaN(num)) return 'Please enter valid age';
            if (num < 18) return 'Minimum age is 18';
            if (num > 100) return 'Maximum age is 100';
            return null;
        }
    }
};

// Auto-calculate suggested age if DOB changes
if (fields.dob && fields.age) {
    fields.dob.input.addEventListener('change', () => {
        const val = fields.dob.input.value;
        if (val) {
            const birthDate = new Date(val);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
            }
            if (calculatedAge >= 1 && calculatedAge <= 120 && !fields.age.input.value) {
                fields.age.input.value = calculatedAge;
                validateField('age');
            }
        }
    });
}

// Live Validation on input & blur
Object.keys(fields).forEach((key) => {
    const item = fields[key];
    if (!item.input) return;

    item.input.addEventListener('input', () => {
        validateField(key);
    });

    item.input.addEventListener('blur', () => {
        validateField(key);
    });
});

function validateField(fieldName) {
    const item = fields[fieldName];
    if (!item) return true;

    const errorMsg = item.validate(item.input.value);
    if (errorMsg) {
        showFieldError(fieldName, errorMsg);
        return false;
    } else {
        clearFieldError(fieldName);
        return true;
    }
}

function showFieldError(fieldName, message) {
    const item = fields[fieldName];
    if (!item) return;

    item.input.classList.add('input-error');
    item.input.classList.remove('input-valid');
    item.error.textContent = message;
    item.error.classList.add('visible');
}

function clearFieldError(fieldName) {
    const item = fields[fieldName];
    if (!item) return;

    item.input.classList.remove('input-error');
    if (item.input.value.trim().length > 0) {
        item.input.classList.add('input-valid');
    }
    item.error.textContent = '';
    item.error.classList.remove('visible');
}

function clearAllErrors() {
    Object.keys(fields).forEach(key => clearFieldError(key));
    if (alertBanner) {
        alertBanner.className = 'alert-banner';
        alertBanner.textContent = '';
    }
}

// Form Submission Handler
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors();

        // 1. Client-side full validation check
        let hasClientError = false;
        Object.keys(fields).forEach(key => {
            const isValid = validateField(key);
            if (!isValid) hasClientError = true;
        });

        if (hasClientError) {
            showAlert('Please resolve validation errors in the form before submitting.', 'error');
            return;
        }

        // 2. Prepare payload
        const payload = {
            name: fields.name.input.value.trim(),
            email: fields.email.input.value.trim(),
            phone: parseInt(fields.phone.input.value, 10),
            dob: fields.dob.input.value,
            age: parseInt(fields.age.input.value, 10)
        };

        // 3. Submit to Spring Boot Backend API
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span> Registering...';

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Success: store in sessionStorage and redirect to success page
                sessionStorage.setItem('registeredStudent', JSON.stringify(result.data));
                window.location.href = 'success.html';
            } else if (response.status === 400 && result.errors) {
                // Backend Jakarta Bean Validation errors returned
                Object.keys(result.errors).forEach(fieldKey => {
                    if (fields[fieldKey]) {
                        showFieldError(fieldKey, result.errors[fieldKey]);
                    }
                });
                showAlert(result.message || 'Validation failed on server.', 'error');
            } else {
                showAlert(result.message || 'Server error occurred.', 'error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showAlert('Cannot connect to backend (http://localhost:8080). Make sure the Spring Boot server is running!', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

function showAlert(message, type = 'error') {
    if (!alertBanner) return;
    alertBanner.textContent = message;
    alertBanner.className = `alert-banner ${type}`;
    alertBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
