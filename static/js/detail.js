document.addEventListener("DOMContentLoaded", function() {
    // 0. Retrieve login status from the page's data attribute
    const loginStatusEl = document.getElementById("loginStatus");
    const isLoggedIn = (loginStatusEl && loginStatusEl.dataset.loggedIn === 'True');

    // 1. Favorite button click handling
    const favoriteBtn = document.getElementById('favorite-button');
    if(favoriteBtn) {
        favoriteBtn.addEventListener('click', function() {
            if(!isLoggedIn) {
                // Front-end interception: prompt user to log in first if not logged in
                showAlert("Please log in first to add favorite!", "error");
                return;
            }

            const restaurantId = this.dataset.restaurantId; // Get restaurant ID from button's data attribute
            fetch(`/favorite/${restaurantId}/`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest', // Indicate AJAX request
                    'X-CSRFToken': getCookie('csrftoken'), // Include CSRF token for security
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ restaurant_id: restaurantId }) // Send restaurant ID as JSON payload
            })
            .then(response => {
                if (response.status === 403) {
                    // Secondary check: notify user if backend denies access
                    showAlert("Please log in first to add favorite!", "error");
                    throw new Error("403 Forbidden");
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Update UI upon successfully adding to favorites
                    favoriteBtn.innerHTML = '<i class="fas fa-heart text-danger"></i> Collected';
                    favoriteBtn.classList.remove('btn-primary');
                    favoriteBtn.classList.add('btn-secondary');
                    showAlert("Restaurant added to favorites!", "success");
                } else {
                    // Display error message received from server
                    showAlert(data.message, "error");
                }
            })
            .catch(err => {
                console.error("add_favorite error:", err); // Log errors to console
            });
        });
    }

    // 2. AJAX-based reservation form submission
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission behavior

            // Optional login requirement for reservation (currently commented out)
            // if(!isLoggedIn){
            //   showAlert("Please log in to make a reservation!", "error");
            //   return;
            // }

            const formData = new FormData(reservationForm); // Prepare form data for sending

            // Extract restaurant ID from URL path (e.g., /restaurant/<id>/)
            const urlParts = window.location.pathname.split('/');
            const restaurantId = urlParts[2];

            fetch(`/restaurant/${restaurantId}/reserve/`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest', // Indicate AJAX request
                    'X-CSRFToken': getCookie('csrftoken')  // CSRF token for security
                },
                body: formData // Send form data directly
            })
            .then(response => response.json().then(data => ({ status: response.status, data })))
            .then(({ status, data }) => {
                if (status === 200 && data.success) {
                    showAlert("Reservation submitted successfully!", "success");
                    reservationForm.reset(); // Reset form upon successful reservation
                } else if (status === 403) {
                    showAlert(data.message || "Please log in to make a reservation!", "error");
                } else {
                    showAlert(data.message || "Reservation failed!", "error");
                }
            })
            .catch(err => {
                showAlert("Server error! " + err, "error"); // Display server error messages
            });
        });
    }

    // 3. Star-rating click event handling
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', () => {
            const score = star.dataset.score; // Get rating score from data attribute
            const scoreInput = document.getElementById('scoreInput');
            scoreInput.value = score; // Update hidden input with selected score

            // Clear existing star rating styles
            document.querySelectorAll('.star').forEach(s => {
                s.classList.remove('filled','fas');
                s.classList.add('far');
            });

            // Fill selected stars up to the chosen rating score
            for(let i = 1; i <= score; i++){
                const st = document.querySelector(`.star[data-score="${i}"]`);
                st.classList.remove('far');
                st.classList.add('fas','filled');
            }
        });
    });

    // 4. Click-to-zoom image functionality
    document.querySelectorAll('.gallery-main img, .gallery-thumbnail, .card-img-top').forEach(img => {
        img.style.cursor = 'zoom-in'; // Set cursor to indicate zoom functionality
        img.addEventListener('click', function() {
            const modalImg = document.getElementById('zoomedImage');
            modalImg.src = this.src; // Load clicked image into modal
            const modal = new bootstrap.Modal(document.getElementById('imageModal'));
            modal.show(); // Display modal with enlarged image
        });
    });

    // 5. Animated numeric rating increment effect
    const ratingElement = document.querySelector(".rating-large");
    if (ratingElement) {
        let ratingVal = parseFloat(ratingElement.textContent) || 0.0; // Parse initial rating
        let displayVal = 0.0;
        ratingElement.textContent = "0.0"; // Reset display value to start animation
        const interval = setInterval(() => {
            if (displayVal < ratingVal) {
                displayVal += 0.1; // Increment rating display value gradually
                ratingElement.textContent = displayVal.toFixed(1);
            } else {
                ratingElement.textContent = ratingVal.toFixed(1); // Finalize display value
                clearInterval(interval); // Stop animation once complete
            }
        }, 50);
    }
});

// Utility function: Display styled alert messages
function showAlert(message, type='error') {
    const alertBox = document.createElement('div');
    alertBox.className = `custom-alert ${type}`; // Assign CSS class based on alert type
    alertBox.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(alertBox); // Append alert to page body

    // Automatically dismiss alert after 3 seconds with fade-out effect
    setTimeout(() => {
        alertBox.classList.add('fade-out');
        setTimeout(() => {
            alertBox.remove();
        }, 300);
    }, 3000);
}

// Utility function: Retrieve CSRF token from browser cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let c of cookies) {
            const cookie = c.trim();
            if (cookie.substring(0, name.length+1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length+1));
                break;
            }
        }
    }
    return cookieValue; // Return the retrieved CSRF token
}