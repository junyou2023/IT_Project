// Update logout functionality
function logout() {
    sessionStorage.removeItem('isLoggedIn'); // Clear login state from session storage
    document.body.style.opacity = '0'; // Set page opacity to 0 for visual transition effect
    setTimeout(() => {
        window.location.href = 'homepage.html'; // Redirect to homepage
        window.location.reload(true); // Force reload page to reset state
    }, 500); // Delay the redirect and reload for a smooth transition
}

// Redirect to login page when login link is clicked
const loginLink = document.querySelector('.navbar .nav-item:nth-last-child(3) .nav-link');
loginLink.addEventListener('click', () => {
    window.location.href = 'Modern Login Page.html'; // Navigate to login page
});

// Dropdown toggle rotation effect
const dropdownToggle = document.querySelector('.dropdown-toggle');

// Check if dropdown toggle exists
if (dropdownToggle) {
    // Rotate arrow icon upwards when dropdown is shown
    dropdownToggle.addEventListener('show.bs.dropdown', () => {
        dropdownToggle.style.transform = 'rotate(180deg)';
    });

    // Reset arrow icon to original position when dropdown hides
    dropdownToggle.addEventListener('hide.bs.dropdown', () => {
        dropdownToggle.style.transform = 'rotate(0deg)';
    });
} else {
    console.warn('Dropdown toggle element not found.'); // Warning if dropdown toggle element is missing
}

// Dropdown menu toggle class management (Bootstrap compatibility fix)
document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(function (dropdown) {
        dropdown.addEventListener("show.bs.dropdown", function () {
            let menu = dropdown.querySelector(".dropdown-menu");
            menu.classList.add("show"); // Ensure menu is visible when dropdown opens
        });

        dropdown.addEventListener("hide.bs.dropdown", function () {
            let menu = dropdown.querySelector(".dropdown-menu");
            menu.classList.remove("show"); // Ensure menu is hidden when dropdown closes
        });
    });
});

// Validate search input before form submission
document.getElementById("searchForm").addEventListener("submit", function (event) {
    var searchInput = document.querySelector("input[name='search']").value.trim();
    if (searchInput === "") {
        event.preventDefault(); // Prevent form submission if input is empty
        alert("Please enter a keyword to search!"); // Notify user to provide input
    }
});

// Autocomplete suggestions for search input (initial version)
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector("input[name='search']");
    const suggestions = ["burger", "ramen", "sushi", "pasta", "pizza", "american", "japanese", "italian", "mexican"];

    searchInput.addEventListener("input", function () {
        const inputText = searchInput.value.toLowerCase();
        let suggestionBox = document.getElementById("suggestionBox");
        if (!suggestionBox) {
            suggestionBox = document.createElement("div");
            suggestionBox.id = "suggestionBox";
            suggestionBox.classList.add("autocomplete-suggestions");
            searchInput.parentNode.appendChild(suggestionBox); // Create suggestion box if it doesn't exist
        }
        suggestionBox.innerHTML = ""; // Clear previous suggestions
        if (inputText.length > 0) {
            const filteredSuggestions = suggestions.filter(item => item.includes(inputText));
            filteredSuggestions.forEach(suggestion => {
                let div = document.createElement("div");
                div.classList.add("suggestion-item");
                div.textContent = suggestion;
                div.addEventListener("click", function () {
                    searchInput.value = suggestion; // Set input value to selected suggestion
                    suggestionBox.innerHTML = ""; // Clear suggestion box
                });
                suggestionBox.appendChild(div);
            });
        }
    });

    // Hide suggestions when clicking outside the input or suggestion box
    document.addEventListener("click", function (e) {
        if (!searchInput.contains(e.target) && !document.getElementById("suggestionBox").contains(e.target)) {
            document.getElementById("suggestionBox").innerHTML = "";
        }
    });
});

// Enhanced autocomplete suggestions for search input (extended list)
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector("input[name='search']");
    const suggestions = ["burger", "ramen", "sushi", "pasta", "pizza", "tacos", "curry", "bbq", "salad", "pho", "noodles", "dumplings"];

    searchInput.addEventListener("input", function () {
        const inputText = searchInput.value.toLowerCase();
        let suggestionBox = document.getElementById("suggestionBox");

        if (!suggestionBox) {
            suggestionBox = document.createElement("div");
            suggestionBox.id = "suggestionBox";
            suggestionBox.classList.add("autocomplete-suggestions");
            searchInput.parentNode.appendChild(suggestionBox); // Ensure suggestion box exists
        }

        suggestionBox.innerHTML = ""; // Clear previous suggestions

        if (inputText.length > 0) {
            const filteredSuggestions = suggestions.filter(item => item.includes(inputText));
            filteredSuggestions.forEach(suggestion => {
                let div = document.createElement("div");
                div.classList.add("suggestion-item");
                div.textContent = suggestion;
                div.addEventListener("click", function () {
                    searchInput.value = suggestion; // Select suggestion on click
                    suggestionBox.innerHTML = ""; // Clear suggestion box
                });
                suggestionBox.appendChild(div);
            });
        }
    });

    // Hide suggestions when clicking outside the suggestion elements
    document.addEventListener("click", function (e) {
        if (!searchInput.contains(e.target) && suggestionBox && !suggestionBox.contains(e.target)) {
            suggestionBox.innerHTML = "";
        }
    });
});

// Final improved autocomplete with alphabetical sorting and prefix highlight
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const suggestionBox = document.getElementById("suggestionBox");
    const suggestions = [
        "Italian", "Japanese", "Mexican", "Chinese",
        "French", "Korean", "Thai", "Indian",
        "Sushi", "Ramen", "Pizza", "Burger",
        "Tacos", "Dim Sum", "Pasta", "Steak",
        "Fine Dining", "Street Food", "Cafe",
        "Vegetarian", "Seafood", "BBQ", "Noodle Shop"
    ];

    searchInput.addEventListener("input", function () {
        const inputText = this.value.trim();
        suggestionBox.innerHTML = ""; // Clear existing suggestions

        if (inputText.length > 0) {
            const searchRegex = new RegExp(`^${inputText}`, 'i'); // Prefix match regex
            const filtered = suggestions
                .filter(item => searchRegex.test(item))
                .sort((a, b) => a.localeCompare(b)); // Alphabetically sort matches

            filtered.forEach(suggestion => {
                const div = document.createElement("div");
                div.className = "suggestion-item";
                // Highlight matching prefix
                div.innerHTML = `<strong>${suggestion.slice(0, inputText.length)}</strong>${suggestion.slice(inputText.length)}`;
                div.addEventListener("click", () => {
                    searchInput.value = suggestion; // Complete input with selected suggestion
                    document.getElementById("searchForm").submit(); // Submit form automatically
                });
                suggestionBox.appendChild(div);
            });
        }
    });

    // Close suggestion box when clicking elsewhere
    document.addEventListener("click", function (e) {
        if (!searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
            suggestionBox.innerHTML = "";
        }
    });

    // Validate form submission
    document.getElementById("searchForm").addEventListener("submit", function (e) {
        if (searchInput.value.trim() === "") {
            e.preventDefault(); // Block submission if input empty
            searchInput.focus(); // Focus input for correction
        }
    });
});

// Subtle focus effect for search input
document.addEventListener("DOMContentLoaded", function() {
  const mainSearch = document.getElementById("searchInput");
  if(mainSearch) {
    mainSearch.addEventListener("focus", () => {
      mainSearch.style.boxShadow = "0 0 8px rgba(255,65,108,0.5)"; // Highlight input box on focus
      mainSearch.style.transition = "box-shadow 0.3s ease";
    });
    mainSearch.addEventListener("blur", () => {
      mainSearch.style.boxShadow = "none"; // Remove highlight on blur
    });
  }
});