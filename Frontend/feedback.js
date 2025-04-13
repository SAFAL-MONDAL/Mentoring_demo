document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formContainer = document.getElementById('formContainer');
    const submitButton = document.querySelector('button[type="submit"]');
    const signatureInput = document.getElementById('signature');
    if (signatureInput.files.length === 0) {
        alert('Please upload a signature image.');
        return;
    }

    const signatureFile = signatureInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const signatureDataURL = e.target.result;

        // Append the signature image to the form for capturing
        const img = new Image();
        img.src = signatureDataURL;
        img.style.maxWidth = '100px'; // Adjust the size as needed
        img.style.display = 'block';
        formContainer.appendChild(img);

        // Hide the submit button before capturing
        submitButton.style.display = 'none';

        // Use html2canvas to capture the form
        html2canvas(formContainer, {
            useCORS: true,
            scale: 2,  // Adjust scale for better resolution
            scrollY: -window.scrollY,  // Ensures the whole page is captured
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgRatio = imgProps.width / imgProps.height;

            // Determine dimensions of the image to fit in PDF
            const pageHeight = pdfWidth / imgRatio;
            let heightLeft = pageHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pageHeight);
            heightLeft -= pdfHeight;

            // Add new pages if the content is taller than one page
            while (heightLeft >= 0) {
                position = heightLeft - pageHeight; // move to next page
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pageHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save('MENTORING_FEEDBACK.pdf');

            // Store feedback in localStorage
            const feedback = {
                studentName: document.getElementById('studentName').value,
                regdNo: document.getElementById('regdNo').value,
                program: document.getElementById('program').value,
                specialization: document.getElementById('specialization').value,
                batch: document.getElementById('batch').value,
                mentorName: document.getElementById('mentorName').value,
                menteeExperience: document.getElementById('menteeExperience').value,
                parentsExperience: document.getElementById('parentsExperience').value,
                signature: signatureDataURL // Store the signature as well
            };

            // Retrieve existing feedbacks from localStorage
            let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
            feedbacks.push(feedback); // Add new feedback to the array
            localStorage.setItem('feedbacks', JSON.stringify(feedbacks)); // Save back to localStorage

            // Restore the submit button visibility
            submitButton.style.display = 'block';

            // Remove appended image after capturing
            formContainer.removeChild(img);
        });
    };

    reader.readAsDataURL(signatureFile);
});