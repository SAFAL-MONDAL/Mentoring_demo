// Function to save data to local storage
function saveData() {
    const studentData = {
        name: document.getElementById('name').value,
        reg_no: document.getElementById('reg_no').value,
        email: document.getElementById('email').value,
        contact_no: document.getElementById('contact_no').value,
        address: document.getElementById('address').value,
        tenth_percentage: document.getElementById('tenth_percentage').value,
        twelfth_percentage: document.getElementById('twelfth_percentage').value,
        cgpa: document.getElementById('cgpa').value,
        events: getEvents(),
        achievements: getAchievements(),
    };

    const students = JSON.parse(localStorage.getItem('students')) || [];
    students.push(studentData);
    localStorage.setItem('students', JSON.stringify(students));

    // Show profile after saving data
    showProfile(studentData);
}

// Function to display stored data as profile
function showProfile(studentData) {
    document.getElementById('profile-name').textContent = studentData.name;
    document.getElementById('profile-email').textContent = studentData.email;
    document.getElementById('profile-contact_no').textContent = studentData.contact_no;
    document.getElementById('profile-address').textContent = studentData.address;
    document.getElementById('profile-tenth_percentage').textContent = studentData.tenth_percentage;
    document.getElementById('profile-twelfth_percentage').textContent = studentData.twelfth_percentage;
    document.getElementById('profile-cgpa').textContent = studentData.cgpa;

    // Display the profile photo
    const profilePhoto = document.getElementById('profile-photo');
    const fileInput = document.getElementById('profile_photo');
    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePhoto.src = e.target.result; // Set the src to the file data
        };
        reader.readAsDataURL(fileInput.files[0]); // Read the uploaded file
    }

    // Update events and achievements to show in profile section
    updateList('profile-events', studentData.events);
    updateList('profile-achievements', studentData.achievements);

    // Hide form and show profile
    document.getElementById('student-form').style.display = 'none';
    document.getElementById('profile-section').style.display = 'block';
    document.getElementById('success-message').style.display = 'block';
    
    // Hide success message after 3 seconds
    setTimeout(() => {
        document.getElementById('success-message').style.display = 'none';
    }, 3000);
}

// Function to handle profile photo upload
document.getElementById('profile_photo').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-photo').src = e.target.result; // Display the image immediately
        };
        reader.readAsDataURL(file); // Convert to base64 URL
    }
});

// Function to update lists with correct numbering
function updateList(listId, items) {
    const listElement = document.getElementById(listId);
    listElement.innerHTML = ''; // Clear previous items
    items.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${item}`; // Add numbering
        listElement.appendChild(listItem);
    });
}

// Function to edit profile
function editProfile() {
    const students = JSON.parse(localStorage.getItem('students'));
    if (students && students.length > 0) {
        const lastStudent = students[students.length - 1];

        // Pre-fill form with existing data
        document.getElementById('name').value = lastStudent.name;
        document.getElementById('reg_no').value = lastStudent.reg_no;
        document.getElementById('email').value = lastStudent.email;
        document.getElementById('contact_no').value = lastStudent.contact_no;
        document.getElementById('address').value = lastStudent.address;
        document.getElementById('tenth_percentage').value = lastStudent.tenth_percentage;
        document.getElementById('twelfth_percentage').value = lastStudent.twelfth_percentage;
        document.getElementById('cgpa').value = lastStudent.cgpa;
        // Show form and hide profile section
        document.getElementById('student-form').style.display = 'block';
        document.getElementById('profile-section').style.display = 'none';
        document.getElementById('success-message').style.display = 'none'; // Hide success message when editing
    }
}

// Function to get events
function getEvents() {
    const events = [];
    const eventItems = document.querySelectorAll('#event-list li');
    eventItems.forEach(eventItem => {
        events.push(eventItem.textContent.replace(/^\d+\.\s/, '')); // Remove numbering
    });
    return events;
}

// Function to get achievements
function getAchievements() {
    const achievements = [];
    const achievementItems = document.querySelectorAll('#achievement-list li');
    achievementItems.forEach(achievementItem => {
        achievements.push(achievementItem.textContent.replace(/^\d+\.\s/, '')); // Remove numbering
    });
    return achievements;
}

// Function to add a new event
function addEvent() {
    const eventInput = document.getElementById('event-input');
    const eventValue = eventInput.value.trim();
    if (eventValue) {
        const eventList = document.getElementById('event-list');
        const listItem = document.createElement('li');
        listItem.textContent = `${eventList.children.length + 1}. ${eventValue}`; // Add numbering based on current list length
        eventList.appendChild(listItem);
        eventInput.value = ''; // Clear the input after adding
    }
}

// Function to add a new achievement
function addAchievement() {
    const achievementInput = document.getElementById('achievement-input');
    const achievementValue = achievementInput.value.trim();
    if (achievementValue) {
        const achievementList = document.getElementById('achievement-list');
        const listItem = document.createElement('li');
        listItem.textContent = `${achievementList.children.length + 1}. ${achievementValue}`; // Add numbering based on current list length
        achievementList.appendChild(listItem);
        achievementInput.value = ''; // Clear the input after adding
    }
}

// Function to check if profile data exists and show it on page load
function checkProfileData() {
    const students = JSON.parse(localStorage.getItem('students'));
    if (students && students.length > 0) {
        const lastStudent = students[students.length - 1];
        showProfile(lastStudent); // Show the profile if data exists
    } else {
        document.getElementById('student-form').style.display = 'block'; // Show form if no data is found
    }
}

// Add event listener to the form submission
document.getElementById('student-form').addEventListener('submit', function(e) {
    e.preventDefault();
    saveData();
    document.getElementById('student-form').reset();
});

// Add event listener to the edit button
document.getElementById('edit-btn').addEventListener('click', editProfile);

// Add event listeners for adding new events and achievements
document.getElementById('add-event-btn').addEventListener('click', addEvent);
document.getElementById('add-achievement-btn').addEventListener('click', addAchievement);

// On page load, check if profile data exists
window.onload = checkProfileData;