document.addEventListener('DOMContentLoaded', () => {
    const studentsKey = 'studentsData';

    // Load stored data from localStorage
    const loadStoredData = () => {
        const storedData = localStorage.getItem(studentsKey);
        if (storedData) {
            const students = JSON.parse(storedData);
            const tableBody = document.getElementById('students-table').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear any existing rows
            students.forEach(student => {
                const newRow = tableBody.insertRow();
                newRow.insertCell(0).textContent = student.id;
                newRow.insertCell(1).textContent = student.name;
                newRow.insertCell(2).textContent = student.course;
                newRow.insertCell(3).textContent = student.grade;
                newRow.insertCell(4).textContent = student.attendance;
            });

            // Update charts with the loaded data
            updateCharts();
        }
    };

    // Save data to localStorage
    const saveData = () => {
        const tableBody = document.getElementById('students-table').getElementsByTagName('tbody')[0];
        const rows = Array.from(tableBody.getElementsByTagName('tr'));
        const students = rows.map(row => {
            const cells = row.getElementsByTagName('td');
            return {
                id: cells[0].textContent,
                name: cells[1].textContent,
                course: cells[2].textContent,
                grade: parseFloat(cells[3].textContent),
                attendance: parseFloat(cells[4].textContent)
            };
        });
        localStorage.setItem(studentsKey, JSON.stringify(students));
    };

    // Handle form submission
    document.getElementById('add-student-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('student-name').value;
        const id = document.getElementById('student-id').value;
        const course = document.getElementById('course-name').value;
        const grade = document.getElementById('student-grade').value;
        const attendance = document.getElementById('student-attendance').value;

        // Add student to table
        const tableBody = document.getElementById('students-table').getElementsByTagName('tbody')[0];
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).textContent = id;
        newRow.insertCell(1).textContent = name;
        newRow.insertCell(2).textContent = course;
        newRow.insertCell(3).textContent = grade;
        newRow.insertCell(4).textContent = attendance;

        // Save data to localStorage
        saveData();

        // Clear form fields
        this.reset();
    });

    // Function to show selected section
    window.showSection = function(sectionId) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.display = section.id === sectionId ? 'block' : 'none';
        });
    };

    // Function to handle file upload
    window.handleFile = function() {
        const fileInput = document.getElementById('file-input');
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            // Clear existing data
            const tableBody = document.getElementById('students-table').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';

            // Process and display data
            jsonData.forEach((row, index) => {
                if (index === 0) return; // Skip header row

                const [id, name, course, grade, attendance] = row;

                const newRow = tableBody.insertRow();
                newRow.insertCell(0).textContent = id;
                newRow.insertCell(1).textContent = name;
                newRow.insertCell(2).textContent = course;
                newRow.insertCell(3).textContent = grade;
                newRow.insertCell(4).textContent = attendance;
            });

            // Save data to localStorage
            saveData();

            // Update charts
            updateCharts();
            document.getElementById('file-upload-feedback').textContent = 'File uploaded successfully!';
        };
        reader.readAsArrayBuffer(file);
    };

    // Extract data for charts
    function extractData(data) {
        const labels = data.map(entry => entry.course);
        const gradesData = data.map(entry => entry.grade);
        const attendanceData = data.map(entry => entry.attendance);
        return { labels, gradesData, attendanceData };
    }

    // Initialize charts
    const gradesCtx = document.getElementById('grades-chart').getContext('2d');
    const attendanceCtx = document.getElementById('attendance-chart').getContext('2d');

    const gradesChart = new Chart(gradesCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Grades',
                data: [],
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

    const attendanceChart = new Chart(attendanceCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Attendance',
                data: [],
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

    // Function to update charts with latest data
    function updateCharts() {
        const tableBody = document.getElementById('students-table').getElementsByTagName('tbody')[0];
        const rows = Array.from(tableBody.getElementsByTagName('tr'));
        const data = rows.map(row => {
            const cells = row.getElementsByTagName('td');
            return {
                id: cells[0].textContent,
                name: cells[1].textContent,
                course: cells[2].textContent,
                grade: parseFloat(cells[3].textContent),
                attendance: parseFloat(cells[4].textContent)
            };
        });

        const { labels, gradesData, attendanceData } = extractData(data);

        gradesChart.data.labels = labels;
        gradesChart.data.datasets[0].data = gradesData;
        gradesChart.update();

        attendanceChart.data.labels = labels;
        attendanceChart.data.datasets[0].data = attendanceData;
        attendanceChart.update();
    }

    // Function to update charts based on student ID
    window.updateChartsById = function() {
        const studentId = document.getElementById('student-id-input').value;
        const tableBody = document.getElementById('students-table').getElementsByTagName('tbody')[0];
        const rows = Array.from(tableBody.getElementsByTagName('tr'));
        const studentData = rows
            .filter(row => row.getElementsByTagName('td')[0].textContent === studentId)
            .map(row => {
                const cells = row.getElementsByTagName('td');
                return {
                    id: cells[0].textContent,
                    name: cells[1].textContent,
                    course: cells[2].textContent,
                    grade: parseFloat(cells[3].textContent),
                    attendance: parseFloat(cells[4].textContent)
                };
            });

        if (studentData.length > 0) {
            const studentName = studentData[0].name;
            document.getElementById('student-name-display').textContent = `Student Name: ${studentName}`;
            
            const { labels, gradesData, attendanceData } = extractData(studentData);

            gradesChart.data.labels = labels;
            gradesChart.data.datasets[0].data = gradesData;
            gradesChart.update();

            attendanceChart.data.labels = labels;
            attendanceChart.data.datasets[0].data = attendanceData;
            attendanceChart.update();
        } else {
            alert('Student not found');
        }
    };

    // Function to remove all data
    window.removeData = function() {
        if (confirm('Are you sure you want to remove all data?')) {
            // Clear the table
            const tableBody = document.getElementById('students-table').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';

            // Remove data from localStorage
            localStorage.removeItem('studentsData');

            // Clear charts
            updateCharts();
        }
    };

    // Load data from localStorage on page load
    loadStoredData();
});
