// excel_view.js - Student page for viewing mentor details


const BASE_URL = 'http://bd-lb-1306888275.ap-south-1.elb.amazonaws.com/api'

async function searchData() {
    const searchInput = document.getElementById('searchInput').value.trim();
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (!searchInput) {
        resultsDiv.innerHTML = '<p class="error">Please enter a registration number or name to search.</p>';
        return;
    }

    try {
        // Show loading state
        resultsDiv.innerHTML = '<p>Searching...</p>';

        // First try exact match with registration number
        const regNoResponse = await fetch(`${BASE_URL}/mentorship/student/${searchInput}`);
        let data;

        if (regNoResponse.ok) {
            // If exact registration number match found
            data = [await regNoResponse.json()];
        } else {
            // If no exact match, get all data and filter
            const allResponse = await fetch(`${BASE_URL}/mentorship/all`);
            if (!allResponse.ok) {
                throw new Error('Error fetching data');
            }
            
            const allData = await allResponse.json();
            
            // Filter data based on search input
            data = allData.filter(row => {
                const searchTerms = searchInput.toLowerCase();
                return (
                    row.regdNo.toString().toLowerCase().includes(searchTerms) ||
                    row.studentName.toLowerCase().includes(searchTerms) ||
                    row.mentorName.toLowerCase().includes(searchTerms) ||
                    row.mentorPhone.toString().includes(searchTerms)
                );
            });
        }

        // Display results
        if (data.length === 0) {
            resultsDiv.innerHTML = '<p>No matching records found.</p>';
            return;
        }

        // Create table for results
        const table = document.createElement('table');
        table.classList.add('styled-table');

        // Add headers
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

        // Add data rows
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
        resultsDiv.innerHTML = ''; // Clear loading message
        resultsDiv.appendChild(table);

    } catch (error) {
        console.error('Search error:', error);
        resultsDiv.innerHTML = '<p class="error">Error searching data. Please try again later.</p>';
    }
}

// Add event listener for enter key in search input
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchData();
    }
});