

document.addEventListener("DOMContentLoaded", function() {
    const semesterDropdown = document.createElement('select');
    semesterDropdown.id = 'semester';
    semesterDropdown.name = 'semester';
    semesterDropdown.required = true;

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = 'Select Semester';
    semesterDropdown.appendChild(defaultOption);

    const semesters = [
        '1st Semester', '2nd Semester', '3rd Semester', '4th Semester',
        '5th Semester', '6th Semester', '7th Semester', '8th Semester'
    ];

    semesters.forEach((semester, index) => {
        const option = document.createElement('option');
        option.value = (index + 1).toString() + (index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th');
        option.textContent = semester;
        semesterDropdown.appendChild(option);
    });

    const nameField = document.getElementById('name');
    nameField.parentNode.insertBefore(semesterDropdown, nameField.nextSibling);
});

const BASE_URL = 'http://bd-lb-1306888275.ap-south-1.elb.amazonaws.com'

document.getElementById('report-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const regNo = document.getElementById('reg_no').value;
    const name = document.getElementById('name').value;
    const semester = document.getElementById('semester').value;
    const fileInput = document.getElementById('report_card');
    const reportCard = fileInput.files[0];

    if (!reportCard || reportCard.type !== 'application/pdf') {
        alert("Please upload a valid PDF file.");
        return;
    }

    if (!semester) {
        alert("Please select a semester.");
        return;
    }

    // Check file size before processing
    if (reportCard.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size too large. Please upload a PDF smaller than 5MB.");
        return;
    }

    try {
        const reader = new FileReader();
        reader.onload = async function() {
            const reportData = {
                reg_no: regNo,
                name: name,
                semester: semester.replace(/\D/g, ''),
                report_card: reader.result
            };

            try {
                const response = await fetch(`${BASE_URL}/api/report-cards/upload`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reportData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Upload failed');
                }

                const data = await response.json();
                alert("Report card uploaded successfully!");
                document.getElementById('report-form').reset();
            } catch (error) {
                console.error('Upload error:', error);
                alert(error.message || 'Failed to upload report card');
            }
        };

        reader.onerror = function() {
            alert("Error reading file");
        };

        reader.readAsDataURL(reportCard);
    } catch (error) {
        console.error('File processing error:', error);
        alert('Error processing file');
    }
});