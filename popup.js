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
        body: formData
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name.replace(/\.[^/.]+$/, "") + ".pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.getElementById('status').textContent = "Conversion successful!";
        document.getElementById('status').style.color = 'green'; // Set text color to green on success
    })
    .catch(error => {
        document.getElementById('status').textContent = "Conversion failed!";
        console.error(error);
    });
});
