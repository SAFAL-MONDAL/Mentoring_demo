// excel_upload.js - Admin page for uploading excel file

const BASE_URL = 'http://bd-lb-1306888275.ap-south-1.elb.amazonaws.com/api'

document.addEventListener('DOMContentLoaded', async function() {
    // Load existing data when page loads
    fetchAndDisplayData();
});

// Function to fetch and display all data
async function fetchAndDisplayData() {
    try {
        const response = await fetch(`${BASE_URL}/mentorship/all`);
        const data = await response.json();
        if (response.ok) {
            displayExcelData(data);
        } else {
            throw new Error(data.error || 'Error fetching data');
        }
    } catch (error) {
       
        document.getElementById('tableContainer').innerHTML = 
            '<p class="error">Error loading data. Please try again later.</p>';
    }
}

// Handle file upload
document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file.");
        return;
    }

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Uploading...';
    submitBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append('excelFile', file);

        const response = await fetch(`${BASE_URL}/mentorship/upload`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert('File uploaded successfully!');
            // Refresh the displayed data
            fetchAndDisplayData();
        } else {
            throw new Error(result.error || 'Upload failed');
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert(`Error uploading file: ${error.message}`);
    } finally {
        // Reset form and button state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        fileInput.value = '';
    }
});

// Handle clear data button
document.getElementById('clearDataButton').addEventListener('click', async function() {
    if (!confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/mentorship/clear`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Data cleared successfully');
            document.getElementById('tableContainer').innerHTML = 
                '<p>All data has been cleared.</p>';
        } else {
            const result = await response.json();
            throw new Error(result.error || 'Failed to clear data');
        }
    } catch (error) {
        console.error('Clear error:', error);
        alert(`Error clearing data: ${error.message}`);
    }
});

// Function to display data in table
function displayExcelData(data) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';

    if (!data || data.length === 0) {
        tableContainer.innerHTML = '<p>No data available.</p>';
        return;
    }

    const table = document.createElement('table');
    table.classList.add('styled-table');

    // Create header
    const headers = ['Sl. No.', 'REGD. NO.', 'NAME OF THE STUDENT', 'NAME OF THE MENTOR', 'MENTOR PHONE NO'];
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create tbody with data
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        [row.slNo, row.regdNo, row.studentName, row.mentorName, row.mentorPhone].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}