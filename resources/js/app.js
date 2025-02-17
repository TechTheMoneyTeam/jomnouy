// resources/js/app.js
import './bootstrap';

// For handling file uploads
document.addEventListener('DOMContentLoaded', function() {
    // File upload preview
    const fileInput = document.querySelector('input[type="file"]');
    const previewContainer = document.querySelector('#image-preview');

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Create preview image
                    const preview = document.createElement('img');
                    preview.src = e.target.result;
                    preview.className = 'max-w-xs mt-2';
                    
                    // Clear previous preview
                    if (previewContainer) {
                        previewContainer.innerHTML = '';
                        previewContainer.appendChild(preview);
                    }
                }
                
                reader.readAsDataURL(file);

                // Handle file upload
                const formData = new FormData();
                formData.append('file', file);

                axios.post('/projects/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(response => {
                    if (response.data.url) {
                        document.querySelector('#project_img').value = response.data.url;
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
    }
});