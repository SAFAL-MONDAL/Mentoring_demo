let queryForm = document.getElementById('query-form');
let successMessage = document.getElementById('success-message');
let userTypeSelect = document.getElementById('user-type');
let studentContainer = document.getElementById('student-container');
let parentContainer = document.getElementById('parent-container');
let returnToQueriesButton = document.getElementById('return-to-queries');

userTypeSelect.addEventListener('change', () => {
  if (userTypeSelect.value === 'student') {
    studentContainer.style.display = 'block';
    parentContainer.style.display = 'none';
  } else if (userTypeSelect.value === 'parent') {
    studentContainer.style.display = 'none';
    parentContainer.style.display = 'block';
  }
});

queryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let name = document.getElementById('name').value;
  let userType = userTypeSelect.value;
  let query;

  if (userType === 'student') {
    query = document.getElementById('student-query').value;
    let registration = document.getElementById('registration').value;
    let newQuery = {
      name: name,
      userType: userType,
      registration: registration,
      query: query,
    };

    if (name === '' || registration === '' || query === '') {
      alert('Please fill in all the fields before submitting the form.');
      if (name === '') {
        document.getElementById('name').style.border = '1px solid red';
      }
      if (registration === '') {
        document.getElementById('registration').style.border = '1px solid red';
      }
      if (query === '') {
        document.getElementById('student-query').style.border = '1px solid red';
      }
    } else {
      // Store the query in localStorage
      addQueryToList(newQuery);

      // Clear the form fields
      document.getElementById('name').value = '';
      document.getElementById('student-query').value = '';
      document.getElementById('registration').value = '';

      // Display the success message
      successMessage.style.display = 'block';
      queryForm.style.display = 'none';
    }
  } else if (userType === 'parent') {
    query = document.getElementById('parents-query').value;
    let parentType = document.getElementById('parent-type').value;
    let parentStudentName = document.getElementById('parent-student-name').value;
    let parentRegistration = document.getElementById('parent-registration').value;
    let newQuery = {
      name: name,
      userType: userType,
      parentType: parentType,
      parentStudentName: parentStudentName,
      parentRegistration: parentRegistration,
      query: query,
      
    };

    if (name === '' || parentType === '' || parentStudentName === '' || parentRegistration === '' || query === '') {
      alert('Please fill in all the fields before submitting the form.');
      if (name === '') {
        document.getElementById('name').style.border = '1px solid red';
      }
      if (parentType === '') {
        document.getElementById('parent-type').style.border = '1px solid red';
      }
      if (parentStudentName === '') {
        document.getElementById('parent-student-name').style.border = '1px solid red';
      }
      if (parentRegistration === '') {
        document.getElementById('parent-registration').style.border = '1px solid red';
      }
      if (query === '') {
        document.getElementById('parents-query').style.border = '1px solid red';
      }
    } else {
      // Store the query in localStorage
      addQueryToList(newQuery);

      // Clear the form fields
      document.getElementById('name').value = '';
      document.getElementById('parents-query').value = '';
      document.getElementById('parent-type').value = '';
      document.getElementById('parent-student-name').value = '';
      document.getElementById('parent-registration').value = '';

      // Display the success message
      successMessage.style.display = 'block';
      queryForm.style.display = 'none';
    }
  }
});

function addQueryToList(query) {
  let queries = JSON.parse(localStorage.getItem('queries')) || [];
  queries.push(query);
  localStorage.setItem('queries', JSON.stringify(queries));
}

returnToQueriesButton.addEventListener('click', () => {
  location.reload(); // reload the current page
});

// Function to remove red border when input field is focused
document.querySelectorAll('input, textarea').forEach((input) => {
  input.addEventListener('focus', () => {
    input.style.border = '1px solid #ccc';
  });
});
