// static/js/auth/Signup.js
document.addEventListener('DOMContentLoaded', function() {
    const alertQueue = [];
    const signupForm = document.getElementById('signupForm');
    const socialButtons = document.querySelectorAll('.social-btn');

    // Create styled alert component
    const createAlert = (message, type = 'error') => {
        const alertEl = document.createElement('div');
        alertEl.className = `alert-notification ${type}`;
        alertEl.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} alert-icon"></i>
            <span>${message}</span>
        `;

        // Alert removal handler
        const removeAlert = () => {
            alertEl.classList.add('alert-exit');
            setTimeout(() => {
                alertEl.remove();
                alertQueue.shift();
                alertQueue[0]?.();
            }, 300);
        };

        return {
            show: () => {
                document.body.appendChild(alertEl);
                setTimeout(removeAlert, 5000);
            }
        };
    };

    // Form submission handler
    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(signupForm);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');

        // Client-side validation
        if (password !== confirmPassword) {
            const alert = createAlert('Passwords do not match!');
            alertQueue.push(alert.show);
            if (alertQueue.length === 1) alert.show();
            return;
        }

        // AJAX submission
        try {
            const response = await fetch(signupForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            });

            const data = await response.json();

            if (data.success) {
                const alert = createAlert('🎉 Registration successful! Redirecting...', 'success');
                alert.show();
                setTimeout(() => window.location.href = data.redirect_url, 1500);
            } else {
                data.errors.forEach(error => {
                    const alert = createAlert(error);
                    alertQueue.push(alert.show);
                });
                if (alertQueue.length > 0) alertQueue[0]();
            }
        } catch (error) {
            const alert = createAlert('⚠️ Server connection failed');
            alert.show();
        }
    });

    // Social button handlers
    socialButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const provider = button.textContent.replace('Continue with ', '');
            const alert = createAlert(`🚧 ${provider} login coming soon!`);
            alertQueue.push(alert.show);
            if (alertQueue.length === 1) alert.show();
        });
    });
});