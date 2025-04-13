window.onload = function () {
    const menteeList = document.getElementById('mentee-list');
    const menteeDetails = document.getElementById('mentee-details');
    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('clear-button');

    // Get mentee data from localStorage
    let mentees = JSON.parse(localStorage.getItem('mentees')) || [];

    if (mentees.length === 0) {
        menteeList.innerHTML = '<center><p style="color: red; font-weight: bold;">No mentee data found.</p></center>';
        return;
    }

    // Function to populate mentee list
    function populateMenteeList(filteredMentees) {
        menteeList.innerHTML = ''; // Clear existing list
        filteredMentees.forEach((mentee, index) => {
            let listItem = document.createElement('li');
            listItem.textContent = mentee.studentName + ' (' + mentee.regdNo + ')';
            listItem.style.cursor = 'pointer';
            listItem.addEventListener('click', function () {
                showMenteeDetails(mentee);
            });
            menteeList.appendChild(listItem);
        });
    }

    // Initial population of mentee list
    populateMenteeList(mentees);

    // Function to show mentee details
    function showMenteeDetails(mentee) {
        document.getElementById('detail-student-name').textContent = mentee.studentName;
        document.getElementById('detail-regd-no').textContent = mentee.regdNo;
        document.getElementById('detail-program').textContent = mentee.program;
        document.getElementById('detail-mentor-name').textContent = mentee.mentorName;
        document.getElementById('detail-department').textContent = mentee.department;
        document.getElementById('detail-school').textContent = mentee.school;
        document.getElementById('detail-campus').textContent = mentee.campus;

        document.getElementById('detail-mentee-name').textContent = mentee.personalRecords.name;
        document.getElementById('detail-branch').textContent = mentee.personalRecords.branch;
        document.getElementById('detail-section').textContent = mentee.personalRecords.section;
        document.getElementById('detail-dob').textContent = mentee.personalRecords.dob;
        // Add more fields as needed

        menteeDetails.style.display = 'block'; // Show details section
    }

    // Search functionality
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        const filteredMentees = mentees.filter(mentee => mentee.regdNo.toLowerCase().includes(query));
        populateMenteeList(filteredMentees);
    });

    // Clear button functionality
    clearButton.addEventListener('click', function () {
        searchInput.value = ''; // Clear the search input
        populateMenteeList(mentees); // Re-populate the list with all mentees
        menteeDetails.style.display = 'none'; // Hide details section
    });
};