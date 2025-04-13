// admin.js

// Function to display all students in the list
function displayStudentList() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const studentList = document.getElementById('student-list');
    studentList.innerHTML = '';

    students.forEach(student => {
        const studentLi = document.createElement('li');
        studentLi.textContent = `${student.name} [${student.reg_no}]`;
        studentLi.addEventListener('click', function() {
            showStudentDetails(student.reg_no);
        });
        studentList.appendChild(studentLi);
    });
}

// Function to show a specific student's details
function showStudentDetails(regNo) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(student => student.reg_no === regNo);

    if (student) {
        document.getElementById('student-name').textContent = student.name;
        document.getElementById('student-reg-no').textContent = student.reg_no;
        document.getElementById('student-email').textContent = student.email;
        document.getElementById('student-contact').textContent = student.contact_no;
        document.getElementById('student-address').textContent = student.address;
        document.getElementById('student-tenth').textContent = student.tenth_percentage;
        document.getElementById('student-twelfth').textContent = student.twelfth_percentage;
        document.getElementById('student-cgpa').textContent = student.cgpa;

        // Create ordered lists for events and achievements
        displayOrderedList('student-events', student.events);
        displayOrderedList('student-achievements', student.achievements);

        document.getElementById('student-details').style.display = 'block';
        document.querySelector('.students-list').style.display = 'none';
    } else {
        alert('Student not found!');
    }
}

// Function to display an ordered list
function displayOrderedList(elementId, items) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = ''; // Clear previous items
    const ol = document.createElement('ol'); // Create an ordered list
    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        ol.appendChild(listItem); // Append each item to the ordered list
    });
    listElement.appendChild(ol); // Append the ordered list to the specified element
}

// Function to delete a student by registration number
function deleteStudent(regNo) {
    if (confirm(`Are you sure you want to delete student with reg no ${regNo}?`)) {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const index = students.findIndex(student => student.reg_no === regNo);
        if (index !== -1) {
            students.splice(index, 1);
            localStorage.setItem('students', JSON.stringify(students));
            displayStudentList();  // Refresh the student list after deletion
            document.getElementById('student-details').style.display = 'none';
        } else {
            alert('Student not found!');
        }
    }
}

// Function to search for a student by registration number
function searchStudent() {
    const regNo = document.getElementById('search').value.trim();
    showStudentDetails(regNo);
}

// Event listeners
document.getElementById('search-btn').addEventListener('click', searchStudent);

document.getElementById('delete-btn').addEventListener('click', function() {
    const regNo = document.getElementById('student-reg-no').textContent;
    deleteStudent(regNo);
});

document.getElementById('back-btn').addEventListener('click', function() {
    document.getElementById('student-details').style.display = 'none';
    document.querySelector('.students-list').style.display = 'block';
});

// On page load, display the list of students
window.onload = function() {
    displayStudentList();
};