window.onload = function () {
    const feedbackList = document.getElementById('feedback-list');
    const feedbackDetails = document.getElementById('feedback-details');
    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('clear-button');

    // Get feedback data from localStorage
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    console.log('Feedbacks from localStorage:', feedbacks); // Debugging line

    if (feedbacks.length === 0) {
        feedbackList.innerHTML = '<center><p style="color: red; font-weight: bold;">No feedback data found.</p></center>';
        return;
    }

    // Function to populate feedback list
    function populateFeedbackList(filteredFeedbacks) {
        feedbackList.innerHTML = ''; // Clear existing list
        filteredFeedbacks.forEach((feedback, index) => {
            let listItem = document.createElement('li');
            listItem.textContent = feedback.studentName + ' (' + feedback.regdNo + ')';
            listItem.style.cursor = 'pointer';
            listItem.addEventListener('click', function () {
                showFeedbackDetails(feedback);
            });
            feedbackList.appendChild(listItem);
        });
    }

    // Initial population of feedback list
    populateFeedbackList(feedbacks);

    // Function to show feedback details
    function showFeedbackDetails(feedback) {
        document.getElementById('detail-student-name').textContent = feedback.studentName;
        document.getElementById('detail-regd-no').textContent = feedback.regdNo;
        document.getElementById('detail-program').textContent = feedback.program;
        document.getElementById('detail-mentor-name').textContent = feedback.mentorName;
        document.getElementById('detail-mentee-experience').textContent = feedback.menteeExperience;
        document.getElementById('detail-parents-experience').textContent = feedback.parentsExperience;

        const signatureImg = document.getElementById('detail-signature');
        signatureImg.src = feedback.signature; // Display the signature image

        feedbackDetails.style.display = 'block'; // Show details section
    }

    // Search functionality
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        const filteredFeedbacks = feedbacks.filter(feedback =>
            feedback.regdNo.toLowerCase().includes(query) ||
            feedback.studentName.toLowerCase().includes(query)
        );
        populateFeedbackList(filteredFeedbacks);
    });

    // Clear button functionality
    clearButton.addEventListener('click', function () {
        searchInput.value = ''; // Clear the search input
        populateFeedbackList(feedbacks); // Re-populate the list with all feedbacks
        feedbackDetails.style.display = 'none'; // Hide details section
    });
};