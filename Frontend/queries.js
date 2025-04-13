const BASE_URL = 'http://bd-lb-1306888275.ap-south-1.elb.amazonaws.com'

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('queryForm');
  const studentSection = document.getElementById('studentSection');
  const parentSection = document.getElementById('parentSection');
  const successMessage = document.getElementById('successMessage');

  // Function to toggle required attributes
  function toggleRequiredFields(isParent) {
      // Student fields
      document.getElementById('registration').required = !isParent;
      document.getElementById('studentQuery').required = !isParent;

      // Parent fields
      const parentFields = ['parentStudentName', 'parentRegistration', 'parentQuery'];
      parentFields.forEach(fieldId => {
          document.getElementById(fieldId).required = isParent;
      });
  }

  // Toggle sections based on user type
  document.querySelectorAll('input[name="userType"]').forEach(radio => {
      radio.addEventListener('change', function() {
          const isParent = this.value === 'Parent';
          studentSection.style.display = isParent ? 'none' : 'block';
          parentSection.style.display = isParent ? 'block' : 'none';
          toggleRequiredFields(isParent);
      });
  });

  // Form submission handler
  form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Validate form data based on user type
      const isParent = data.userType === 'Parent';
      if (isParent) {
          if (!data.parentType || !data.parentStudentName || !data.parentRegistration) {
              alert('Please fill in all required parent fields');
              return;
          }
      } else {
          if (!data.registration) {
              alert('Please fill in registration number');
              return;
          }
      }

      try {
          const response = await fetch(`${BASE_URL}/api/queries`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          });

          const result = await response.json();

          if (result.success) {
              form.reset();
              form.style.display = 'none';
              successMessage.style.display = 'block';
          } else {
              alert('Error submitting query: ' + result.message);
          }
      } catch (error) {
          console.error('Error:', error);
          alert('Error submitting query. Please try again later.');
      }
  });

  // Reset form when page loads
  form.reset();
  toggleRequiredFields(false);
});