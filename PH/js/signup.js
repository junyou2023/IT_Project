// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Handle signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                // Get form data
                const formData = new FormData(signupForm);
                const email = formData.get('email');
                const password = formData.get('password');
                const fullName = formData.get('fullName');
                
                // You can add form validation logic here
                
                // Show success modal
                await showSuccessModal();
                
                // Store user info (in real project, this should be API call)
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', fullName);
                
                // Redirect to homepage after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                
            } catch (error) {
                console.error('Registration error:', error);
                showErrorModal('Registration failed. Please try again.');
            }
        });
    }
});

// Success modal function
function showSuccessModal() {
    // Create modal element
    const modalHtml = `
        <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center p-4">
                        <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
                        <h3 class="mt-3">Registration Successful!</h3>
                        <p class="mb-0">Your account has been created successfully.</p>
                        <p class="text-muted">Redirecting to homepage...</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Show modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();

    return new Promise(resolve => {
        setTimeout(() => {
            successModal.hide();
            // Remove modal
            document.getElementById('successModal').remove();
            resolve();
        }, 2000);
    });
}

// Error modal function
function showErrorModal(message) {
    const modalHtml = `
        <div class="modal fade" id="errorModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center p-4">
                        <i class="fas fa-times-circle text-danger" style="font-size: 4rem;"></i>
                        <h3 class="mt-3">Registration Failed</h3>
                        <p class="mb-0">${message}</p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
}
