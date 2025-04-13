document.addEventListener("DOMContentLoaded", function () {
    const mentorIcon = document.getElementById('mentor-icon');
    const parentIcon = document.getElementById('parent-icon');
    const studentIcon = document.getElementById('student-icon');

    const forms = {
        mentor: document.querySelector('.mentor-form'),
        parent: document.querySelector('.parent-form'),
        student: document.querySelector('.student-form')
    };

    // Authorized mentor credentials
    const authorizedMentors = [
        { email: '220301120072@cutm.ac.in', password: '220301120072' },
        { email: '220301120076@cutm.ac.in', password: '220301120076' },
        { email: '220301120037@cutm.ac.in', password: '220301120037' },
        { email: '220301120016@cutm.ac.in', password: '220301120016' },
        { email: '220301120065@cutm.ac.in', password: '220301120065' },
        { email: 'rajkumar.mohanta@cutm.ac.in', password: 'Raj@H.O.D_1234' },
        { email: 'sasmita.nayak@cutm.ac.in', password: 'CBCS@Sasmita_1234' },
        { email: 'rajendra.khadanga@cutm.ac.in', password: 'Asst.dean@rajendra_1234' },
        { email: 'arpita.senapati@cutm.ac.in', password: 'Miss/Arpita_1234' },
        { email: 'sujata.chakravarty@cutm.ac.in', password: 'Dean@sujata_1234' },
        { email: 'parth.pradhan@cutm.ac.in', password: 'Parth@pradhan_1234' },
    ];
// Event listeners for icon clicks
mentorIcon.addEventListener('click', () => handleUserSelection('mentor'));
parentIcon.addEventListener('click', () => handleUserSelection('parent'));
studentIcon.addEventListener('click', () => handleUserSelection('student'));

// Handle user selection and form display
function handleUserSelection(userType) {
    hideAllForms();
    showForm(forms[userType]);
    hideOtherIcons(getIconId(userType));
    history.pushState({ userType }, '', `#${userType}`);
}

// Popstate handler for browser back button
window.addEventListener('popstate', (event) => {
    const userType = event.state?.userType || null;
    if (userType) {
        handleUserSelection(userType);
    } else {
        showAllIcons();
        hideAllForms();
    }
});
    // Show form based on the selected user type
    function showForm(form) {
        if (form) form.style.display = 'block';
    }

    // Hide all forms
    function hideAllForms() {
        Object.values(forms).forEach(form => form.style.display = 'none');
    }

    // Show all icons
    function showAllIcons() {
        mentorIcon.style.display = 'block';
        parentIcon.style.display = 'block';
        studentIcon.style.display = 'block';
    }

    // Hide other icons except the selected one
    function hideOtherIcons(selectedIconId) {
        [mentorIcon, parentIcon, studentIcon].forEach(icon => {
            icon.style.display = icon.id === selectedIconId ? 'block' : 'none';
        });
    }

    // Get icon ID based on user type
    function getIconId(userType) {
        return `${userType}-icon`;
    }

    // Form validation and navigation
    function validateAndNavigate(userType) {
        const form = forms[userType];
        const redirectUrl = getRedirectUrl(userType);

        if (form) {
            const inputs = form.querySelectorAll('input');
            let isValid = validateInputs(inputs);

            if (isValid) {
                if (userType === 'mentor') {
                    handleMentorLogin(form, redirectUrl);
                } else {
                    window.location.href = redirectUrl;
                }
            }
        }
    }

    // Validate form inputs
    function validateInputs(inputs) {
        return Array.from(inputs).every(input => {
            if (input.value.trim() === '') {
                input.setCustomValidity('This field is required');
                input.reportValidity();
                return false;
            } else {
                input.setCustomValidity('');
                return true;
            }
        });
    }

    // Handle mentor login
    function handleMentorLogin(form, redirectUrl) {
        const email = form.querySelector('#mentor-email').value;
        const password = form.querySelector('#mentor-password').value;

        const isAuthorized = authorizedMentors.some(mentor =>
            mentor.email === email && mentor.password === password
        );

        if (isAuthorized) {
            window.location.href = redirectUrl;
        } else {
            alert('Invalid email or password for mentor login.');
        }
    }

    // Return redirect URL based on user type
    function getRedirectUrl(userType) {
        switch (userType) {
            case 'mentor':
                return 'ADMIN_HOME.html'; // Update as needed
            case 'parent':
                return 'PARENTS_HOME.html'; // Update as needed
            case 'student':
                return 'USER_HOME.html'; // Update as needed
            default:
                return '#';
        }
    }

    // Add form submit event listeners
    document.querySelector('.mentor-form').addEventListener('submit', (event) => {
        event.preventDefault();
        validateAndNavigate('mentor');
    });

    document.querySelector('.parent-form').addEventListener('submit', (event) => {
        event.preventDefault();
        validateAndNavigate('parent');
    });

    document.querySelector('.student-form').addEventListener('submit', (event) => {
        event.preventDefault();
        validateAndNavigate('student');
    });

    // Email validation for both mentor and student forms
    const emailInputs = {
        student: document.getElementById('student-email'),
        mentor: document.getElementById('mentor-email')
    };

    const emailPattern = /^[a-zA-Z0-9._%+-]+@(cutm\.ac\.in|centurionuniv\.edu\.in)$/;

    function validateEmail(input) {
        if (!emailPattern.test(input.value)) {
            input.setCustomValidity("Please enter an email address ending with @cutm.ac.in or @centurionuniv.edu.in");
        } else {
            input.setCustomValidity("");
        }
    }

    Object.values(emailInputs).forEach(input => {
        input.addEventListener('input', () => validateEmail(input));
    });
});