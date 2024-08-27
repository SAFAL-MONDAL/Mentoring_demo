// Get the upload form and file input elements
const uploadForm = document.getElementById('uploadForm');
const excelFileInput = document.getElementById('excelFile');

// Add an event listener to the form submission
uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get the selected file
  const excelFile = excelFileInput.files[0];

  // Check if a file is selected
  if (!excelFile) {
    alert('Please select an Excel file');
    return;
  }

  // Create a FormData object to send the file to the server
  const formData = new FormData();
  formData.append('excelFile', excelFile);

  // Send the file to the server using XMLHttpRequest or fetch API
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/uploadExcelFile', true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log('File uploaded successfully');
    } else {
      console.error('Error uploading file:', xhr.statusText);
    }
  };
  xhr.send(formData);
});