document.getElementById('fileInput').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        document.getElementById('fileName').textContent = file.name;
    } else {
        document.getElementById('fileName').textContent = 'No file chosen';
    }
});

document.getElementById('convertButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const fileType = document.getElementById('fileType').value;
    const file = fileInput.files[0];

    if (!file) {
        document.getElementById('status').textContent = "Please select a file!";
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileType);

    fetch('https://dochouse-springboot-production.up.railway.app/api/files/convert-to-pdf', {
        method: 'POST',
        body: formData, // Ensure formData is properly populated
        headers: {
            'Accept': 'application/pdf', // Explicitly request PDF content
            // Add other necessary headers if required
        }
    })
    .then(response => {
        // Check if the response is ok (status code 200)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob(); // Convert response to Blob
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
        const a = document.createElement('a'); // Create an anchor element
        a.href = url;
        a.download = file.name.replace(/\.[^/.]+$/, "") + ".pdf"; // Set the download file name
        document.body.appendChild(a); // Append anchor to body (not visible)
        a.click(); // Trigger a click event to download the file
        document.body.removeChild(a); // Remove anchor from body
        window.URL.revokeObjectURL(url); // Release memory
        document.getElementById('status').textContent = "Conversion successful!";
        document.getElementById('status').style.color = 'green'; // Set text color to green on success
    })
    .catch(error => {
        document.getElementById('status').textContent = "Conversion failed!";
        document.getElementById('status').style.color = 'red'; // Set text color to red on error
        console.error('Error:', error); // Log the error to the console
    });
    
});
