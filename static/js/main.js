document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const canvas = document.getElementById('maskCanvas');
    const ctx = canvas.getContext('2d');
    const submitButton = document.getElementById('submitMask');
    let image = new Image();
    let mask = null;

    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            image.src = e.target.result;
            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                mask = new Uint8Array(image.width * image.height);
            };
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    });

    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / (rect.width / canvas.width));
        const y = Math.floor((event.clientY - rect.top) / (rect.height / canvas.height));
        
        // Toggle mask value
        const index = y * canvas.width + x;
        mask[index] = mask[index] === 1 ? 0 : 1;

        // Redraw the mask
        ctx.drawImage(image, 0, 0);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        for (let i = 0; i < mask.length; i++) {
            if (mask[i] === 1) {
                const maskX = i % canvas.width;
                const maskY = Math.floor(i / canvas.width);
                ctx.fillRect(maskX, maskY, 1, 1);
            }
        }
    });

    submitButton.addEventListener('click', function() {
        const maskData = JSON.stringify(mask);
        fetch('http://127.0.0.1:8000/procesar-imagen/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: maskData
        })
        .then(response => response.json())
        .then(data => {
            window.location.href = '/result'; // Redirect to result page
        })
        .catch(error => console.error('Error:', error));
    });
});