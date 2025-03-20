document.addEventListener('DOMContentLoaded', function() {
    const alertQueue = [];
    const loginForm = document.getElementById('loginForm');
    const errorContainer = document.getElementById('errorContainer');
    const successContainer = document.getElementById('successContainer');
    const forgotLink = document.querySelector('.forgot-link');
    const socialButtons = document.querySelectorAll('.social-btn');

    // ===== Create a re-usable alert function (similar to Signup.js) =====
    const createAlert = (container, message, type = 'error') => {
        container.innerHTML = message;
        container.classList.remove('d-none', 'alert-danger', 'alert-success');
        container.classList.add(type === 'success' ? 'alert-success' : 'alert-danger');
    };

    // Hide alerts
    const hideAlert = (container) => {
        container.classList.add('d-none');
    };

    // ===== Social Button Handling =====
    const alertQueueSocial = [];
    const createSocialAlert = (provider) => {
        const alertEl = document.createElement('div');
        alertEl.className = 'social-alert';
        alertEl.innerHTML = `
            <i class="fas fa-info-circle social-alert-icon"></i>
            <span>${provider} login coming soon!</span>
        `;
        const removeAlert = () => {
            alertEl.classList.add('social-alert-exit');
            setTimeout(() => {
                alertEl.remove();
                alertQueueSocial.shift();
                if (alertQueueSocial[0]) alertQueueSocial[0]();
            }, 300);
        };
        return {
            show: () => {
                document.body.appendChild(alertEl);
                setTimeout(removeAlert, 3000);
            }
        };
    };

    socialButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const provider = button.classList.contains('google') ? 'Google' :
                            button.classList.contains('facebook') ? 'Facebook' :
                            button.classList.contains('apple') ? 'Apple' : 'Social';
            const alert = createSocialAlert(provider);
            alertQueueSocial.push(alert.show);
            if (alertQueueSocial.length === 1) alert.show();
        });
    });

    // ===== Forgot password link - example popup/alert =====
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            alertQueue.push(() => {
                alert( // 这里简单示例用原生alert，可改成更美观的modal
                    "Forgot password feature not implemented.\n" +
                    "You could link this to a password reset page or pop up a form to send reset email."
                );
                alertQueue.shift();
            });
            if (alertQueue.length === 1) alertQueue[0]();
        });
    }

    // ===== Enhanced Login Form Submission (AJAX) =====
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear existing alerts
            hideAlert(errorContainer);
            hideAlert(successContainer);

            const formData = new FormData(loginForm);
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

            try {
                const response = await fetch(loginForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': csrfToken
                    }
                });
                const data = await response.json();

                if (data.success) {
                    // Show success, then redirect
                    createAlert(successContainer, data.message || 'Login successful!', 'success');
                    setTimeout(() => {
                        window.location.href = data.redirect_url || '/Homepage/';
                    }, 1500);
                } else {
                    // Show error
                    createAlert(errorContainer, data.error || 'Login failed', 'error');
                }
            } catch (error) {
                createAlert(errorContainer, 'Server connection failed', 'error');
            }
        });
    }
});
