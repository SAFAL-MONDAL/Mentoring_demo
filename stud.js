document.addEventListener('DOMContentLoaded', () => {
    const studentsKey = 'studentsData';

    // Load stored data from localStorage
    const loadStoredData = () => {
        const storedData = localStorage.getItem(studentsKey);
        return storedData ? JSON.parse(storedData) : [];
    };

    // Function to update charts
    const updateCharts = (studentId, gradesData, attendanceData) => {
        document.getElementById('student-name-display').textContent = `Student ID: ${studentId}`;

        const labels = gradesData.map(data => data.course);

        const gradesChartCanvas = document.getElementById('grades-chart');
        const attendanceChartCanvas = document.getElementById('attendance-chart');

        if (!gradesChartCanvas || !attendanceChartCanvas) {
            console.error('Chart canvas elements are missing.');
            return;
        }

        // Clear any existing charts before creating new ones
        if (gradesChartCanvas.chart) {
            gradesChartCanvas.chart.destroy();
        }
        if (attendanceChartCanvas.chart) {
            attendanceChartCanvas.chart.destroy();
        }

        // Create new charts
        const gradesChart = new Chart(gradesChartCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Grades',
                    data: gradesData.map(data => (parseFloat(data.grade) * 100).toFixed(2)), // Convert to percentage
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return `${value}%`;
                            }
                        }
                    }
                }
            }
        });

        const attendanceChart = new Chart(attendanceChartCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Attendance',
                    data: attendanceData.map(data => (parseFloat(data.attendance) * 100).toFixed(2)), // Convert to percentage
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return `${value}%`;
                            }
                        }
                    }
                }
            }
        });

        gradesChartCanvas.chart = gradesChart;
        attendanceChartCanvas.chart = attendanceChart;
    };

    // Function to load student data by ID for charts
    window.loadStudentData = () => {
        const studentId = document.getElementById('student-id-input').value.trim();
        const studentsData = loadStoredData();

        // Filter student data based on the student ID
        const studentRecords = studentsData.filter(record => record.id === studentId);

        if (studentRecords.length > 0) {
            const gradesData = studentRecords.map(record => ({
                course: record.course,
                grade: parseFloat(record.grade) // Keep as float for calculation
            }));
            const attendanceData = studentRecords.map(record => ({
                course: record.course,
                attendance: parseFloat(record.attendance) // Keep as float for calculation
            }));

            updateCharts(studentId, gradesData, attendanceData);
        } else {
            alert('Student not found');
        }
    };

    // Function to update all charts from the entire dataset (for admin view)
    const updateAllCharts = () => {
        const studentsData = loadStoredData();

        const courses = [...new Set(studentsData.map(record => record.course))]; // Get unique courses

        const gradesData = courses.map(course => ({
            course: course,
            grade: studentsData.filter(record => record.course === course).reduce((sum, record) => sum + parseFloat(record.grade), 0) / studentsData.filter(record => record.course === course).length
        }));

        const attendanceData = courses.map(course => ({
            course: course,
            attendance: studentsData.filter(record => record.course === course).reduce((sum, record) => sum + parseFloat(record.attendance), 0) / studentsData.filter(record => record.course === course).length
        }));

        updateCharts('All Students', gradesData, attendanceData);
    };

    // Function to clear all data
    window.clearData = function() {
        if (confirm('Are you sure you want to clear all data?')) {
            localStorage.removeItem(studentsKey);
            const tableBody = document.getElementById('students-table').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';
            updateAllCharts(); // Clear charts
            document.getElementById('file-upload-feedback').textContent = 'All data cleared!';
        }
    };

    // Initial load
    updateAllCharts(); // Load charts based on all data
});
