document.getElementById('btn').addEventListener('click', function (event) {
  event.preventDefault();

  const menteeData = {
      studentName: document.getElementById('student-name').value,
      regdNo: document.getElementById('regd-no').value,
      program: document.getElementById('program').value,
      mentorName: document.getElementById('mentor-name').value,
      department: document.getElementById('department').value,
      school: document.getElementById('school').value,
      campus: document.getElementById('campus').value,
      personalRecords: {
          name: document.getElementById('mentee-name').value,
          program: document.getElementById('mentee-program').value,
          branch: document.getElementById('branch').value,
          section: document.getElementById('section').value,
          duration: document.getElementById('duration').value,
          dob: document.getElementById('dob').value,
          category: document.getElementById('category').value,
          hosteller: document.getElementById('hosteller-day-scholar').value,
          email: document.getElementById('mail-id').value,
          mobile: document.getElementById('mobile-number').value,
          bloodGroup: document.getElementById('blood-group').value,
          hobby: document.getElementById('hobby-passion').value,
          address: document.getElementById('present-address').value,
      }
  };

  // Store data in localStorage
  let mentees = JSON.parse(localStorage.getItem('mentees')) || [];
  mentees.push(menteeData);
  localStorage.setItem('mentees', JSON.stringify(mentees));

  alert('Form submitted successfully!');
  window.location.href = 'USER_HOME.html'; // Redirect to mentor view page
});
