// JavaScript code for handling user selection and form submissions

const mentorIcon = document.getElementById('mentor-icon');
const parentIcon = document.getElementById('parent-icon');
const studentIcon = document.getElementById('student-icon');
const mentorForm = document.querySelector('.mentor-form');
const parentForm = document.querySelector('.parent-form');
const studentForm = document.querySelector('.student-form');

// List of authorized mentor credentials
const authorizedMentors = [
  { email: '220301120072@cutm.ac.in', password: '220301120072' },
  { email: '220301120076@cutm.ac.in', password: '220301120076' },
  { email: '220301120237@cutm.ac.in', password: '220301120237' },
  { email: '220301120016@cutm.ac.in', password: '220301120016' },
  { email: '220301120065@cutm.ac.in', password: '220301120065' },
  { email: 'rajkumar.mohanta@cutm.ac.in', password: 'Raj@H.O.D_1234' },
  { email: 'sasmita.nayak@cutm.ac.in', password: 'CBCS@Sasmita_1234' },
  { email: 'rajendra.khadanga@cutm.ac.in', password: 'Asst.dean@rajendra_1234' },
  { email: 'arpita.senapati@cutm.ac.in', password: 'Miss/Arpita_1234' },
  { email: 'sujata.chakravarty@cutm.ac.in', password: 'Dean@suzee_1234' },
  { email: '220301120244@cutm.ac.in', password: '220301120243' },
];

// Add event listeners to the icons
mentorIcon.addEventListener('click', () => {
  selectUserType('mentor');
  history.pushState({ userType: 'mentor' }, '', '#mentor');
});

parentIcon.addEventListener('click', () => {
  selectUserType('parent');
  history.pushState({ userType: 'parent' }, '', '#parent');
});

studentIcon.addEventListener('click', () => {
  selectUserType('student');
  history.pushState({ userType: 'student' }, '', '#student');
});

// Add event listener to the popstate event
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.userType) {
    selectUserType(event.state.userType);
  } else {
    // If the user clicks the back button to the initial state, show all icons and hide all forms
    showAllIcons();
    hideAllForms();
  }
});

// Function to select the user type and show the corresponding form
function selectUserType(userType) {
  hideAllForms();
  showForm(getFormElement(userType));
  hideOtherIcons(getIconId(userType));
}

// Function to get the form element based on the user type
function getFormElement(userType) {
  switch (userType) {
    case 'mentor':
      return mentorForm;
    case 'parent':
      return parentForm;
    case 'student':
      return studentForm;
    default:
      return null;
  }
}

// Function to get the icon ID based on the user type
function getIconId(userType) {
  switch (userType) {
    case 'mentor':
      return 'mentor-icon';
    case 'parent':
      return 'parent-icon';
    case 'student':
      return 'student-icon';
    default:
      return null;
  }
}

// Function to hide all forms
function hideAllForms() {
  mentorForm.style.display = 'none';
  parentForm.style.display = 'none';
  studentForm.style.display = 'none';
}

// Function to show all icons
function showAllIcons() {
  mentorIcon.style.display = 'block';
  parentIcon.style.display = 'block';
  studentIcon.style.display = 'block';
}

// Function to hide other icons
function hideOtherIcons(selectedIconId) {
  const icons = document.querySelectorAll('.user-type-icons div');
  icons.forEach(icon => {
    if (icon.id !== selectedIconId) {
      icon.style.display = 'none';
    }
  });
}

// Function to show the form
function showForm(form) {
  form.style.display = 'block';
}

// Function to validate form and navigate to the respective page
function validateAndNavigate(userType) {
  let isValid = true;
  let form, redirectUrl;

  if (userType === 'mentor') {
    form = mentorForm;
    redirectUrl = 'ADMIN_HOME.html'; // Change this URL as needed
  } else if (userType === 'parent') {
    form = parentForm;
    redirectUrl = 'USER_HOME.html'; // Change this URL as needed
  } else if (userType === 'student') {
    form = studentForm;
    redirectUrl = 'USER_HOME.html'; // Change this URL as needed
  }

  // Validate fields
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    if (input.value.trim() === '') {
      input.setCustomValidity('This field is required');
      isValid = false;
    } else {
      input.setCustomValidity('');
    }
    input.reportValidity();
  });

  if (isValid && userType === 'mentor') {
    // Check mentor credentials
    const email = document.getElementById('mentor-email').value;
    const password = document.getElementById('mentor-password').value;

    const authorizedMentor = authorizedMentors.find(
      mentor => mentor.email === email && mentor.password === password
    );

    if (authorizedMentor) {
      // Navigate to the ADMIN_HOME.html page if credentials are correct
      window.location.href = redirectUrl;
    } else {
      alert('Invalid email or password for mentor login.');
    }
  } else if (isValid) {
    // Navigate to the respective page if all fields are valid and it's not a mentor login
    window.location.href = redirectUrl;
  }
}

// Add submit event listeners to each form
document.getElementById('mentor-form').addEventListener('submit', function(event) {
  event.preventDefault();
  validateAndNavigate('mentor');
});

document.getElementById('parent-form').addEventListener('submit', function(event) {
  event.preventDefault();
  validateAndNavigate('parent');
});

document.getElementById('student-form').addEventListener('submit', function(event) {
  event.preventDefault();
  validateAndNavigate('student');
});

document.addEventListener("DOMContentLoaded", function () {
    const studentEmailInput = document.getElementById('student-email');
    const mentorEmailInput = document.getElementById('mentor-email');

    // Updated regex pattern to match both @cutm.ac.in and @centurionuniv.edu.in
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(cutm\.ac\.in|centurionuniv\.edu\.in)$/;

    function validateEmail(input) {
        if (!emailPattern.test(input.value)) {
            input.setCustomValidity("Please enter an email address ending with @cutm.ac.in or @centurionuniv.edu.in");
        } else {
            input.setCustomValidity("");
        }
    }

    studentEmailInput.addEventListener('input', function () {
        validateEmail(studentEmailInput);
    });

    mentorEmailInput.addEventListener('input', function () {
        validateEmail(mentorEmailInput);
    });
});

