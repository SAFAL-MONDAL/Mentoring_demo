function loadStudentData() {
    const studentId = document.getElementById('student-id-input').value;
    
    fetch(`/grades/${studentId}`)
        .then(response => response.json())
        .then(gradesData => {
            fetch(`/attendance/${studentId}`)
                .then(response => response.json())
                .then(attendanceData => {
                    updateCharts(studentId, gradesData, attendanceData);
                });
        });
}

function updateCharts(studentId, gradesData, attendanceData) {
    // Update the charts with the fetched data
    document.getElementById('student-name-display').textContent = `Student ID: ${studentId}`;

    const labels = gradesData.map((_, index) => `Course ${index + 1}`);
    
    const gradesChart = new Chart(document.getElementById('grades-chart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Grades',
                data: gradesData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const attendanceChart = new Chart(document.getElementById('attendance-chart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Attendance',
                data: attendanceData,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
