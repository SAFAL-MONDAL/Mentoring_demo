const BASE_URL = 'http://bd-lb-1306888275.ap-south-1.elb.amazonaws.com'

document.addEventListener("DOMContentLoaded", function() {
    const reportList = document.getElementById('report-list');
    const semesterFilter = document.getElementById('semester-filter');
    const searchBtn = document.getElementById('search-btn');
    const noReportMsg = document.getElementById('no-report-msg');

    async function fetchReportCards() {
        const searchRegNo = document.getElementById('search-reg-no').value.trim();
        const selectedSemester = semesterFilter.value;
        
        try {
            const queryParams = new URLSearchParams();
            if (searchRegNo) queryParams.append('reg_no', searchRegNo);
            if (selectedSemester) queryParams.append('semester', selectedSemester);

            const response = await fetch(`${BASE_URL}/api/report-cards?${queryParams}`);
            const reports = await response.json();
            
            renderReportCards(reports);
        } catch (error) {
            console.error('Error fetching report cards:', error);
            alert('Failed to fetch report cards');
        }
    }

    function renderReportCards(reports) {
        reportList.innerHTML = '';
        noReportMsg.style.display = reports.length === 0 ? 'block' : 'none';

        reports.forEach(report => {
            const row = document.createElement('tr');
            const viewLink = document.createElement('a');
            viewLink.href = report.report_card;  // Direct data URL
            viewLink.target = '_blank';
            viewLink.textContent = 'View Report Card';

            row.innerHTML = `
                <td>${report.reg_no}</td>
                <td>${report.name}</td>
                <td>${getSemesterName(report.semester)}</td>
                <td>${viewLink.outerHTML}</td>
                <td><button class="remove-btn" data-id="${report._id}">🗑</button></td>
            `;
            reportList.appendChild(row);
        });
    }

    function getSemesterName(semester) {
        const suffix = semester === '1' ? 'st' : 
                      semester === '2' ? 'nd' : 
                      semester === '3' ? 'rd' : 'th';
        return `${semester}${suffix} Semester`;
    }

    async function deleteReportCard(id) {
        if (confirm('Are you sure you want to remove this student\'s report?')) {
            try {
                const response = await fetch(`${BASE_URL}/api/report-cards/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Student report removed!');
                    fetchReportCards();
                } else {
                    throw new Error('Failed to delete report card');
                }
            } catch (error) {
                console.error('Error deleting report card:', error);
                alert(error.message);
            }
        }
    }

    // Initial load
    fetchReportCards();

    // Event listeners
    searchBtn.addEventListener('click', fetchReportCards);
    semesterFilter.addEventListener('change', fetchReportCards);
    
    reportList.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-btn')) {
            const id = event.target.dataset.id;
            deleteReportCard(id);
        }
    });
});