from datetime import datetime
from django.contrib.auth.models import User
from django.db.models import Q, Count, Avg
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.views.decorators.csrf import csrf_exempt

from frontend.models import (
    RestaurantType, CustomUser, Restaurant, Rating, Comment,
    Favorite, Reservation
)

User = get_user_model()

# Login page view
def homepage(request):
    data = RestaurantType.objects.all()
    return render(request, 'HomePage.html', {'data': data})

# Function to validate password strength
def validate_password_strength(password):
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters")
    if not any(char.isdigit() for char in password):
        raise ValidationError("Password must contain numbers")
    if not any(char.isalpha() for char in password):
        raise ValidationError("Password must contain letters")

def login_page(request):
    if request.method == "POST":
        email = request.POST.get('email', '').strip()  # Get email input and remove whitespace
        password = request.POST.get('password', '')
        remember_me = request.POST.get('rememberMe', '')

        try:
            user = User.objects.get(email=email)  # Check if the user exists
        except User.DoesNotExist:
            error_msg = "This email does not exist. Please sign up."
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'error': error_msg}, status=400)
            messages.error(request, error_msg)
            return redirect("Login")

        if user and user.check_password(password):  # Verify password
            if remember_me == 'on':
                request.session.set_expiry(60 * 60 * 24 * 14)  # Session expires in 14 days
            else:
                request.session.set_expiry(0)  # Session expires when the browser is closed

            login(request, user)  # Log in the user
            success_msg = "Login successful!"
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': True, 'message': success_msg, 'redirect_url': '/Homepage/'})
            messages.success(request, success_msg)
            return redirect("Homepage")
        else:
            error_msg = "Incorrect password. Please try again."
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'error': error_msg}, status=400)
            messages.error(request, error_msg)
            return redirect("Login")

    return render(request, "Login.html")  # Render the login page

def signup(request):
    error_messages = {
        'username_taken': 'This username is already taken.',
        'email_registered': 'This email is already registered.',
        'password_mismatch': 'Passwords do not match.',
        'invalid_email': 'Invalid email format.',
        'weak_password': 'Password must be at least 8 characters and contain letters and numbers.'
    }

    if request.method == "POST":
        data = request.POST
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')

        errors = []

        # Ensure all fields are filled
        if not all([username, email, password, confirm_password]):
            errors.append('All fields are required.')

        # Ensure passwords match
        if password != confirm_password:
            errors.append(error_messages['password_mismatch'])

        # Validate email format
        try:
            validate_email(email)
        except ValidationError:
            errors.append(error_messages['invalid_email'])

        # Validate password strength
        try:
            validate_password_strength(password)
        except ValidationError as e:
            errors.extend(e.messages)

        # Check for duplicate username and email
        if User.objects.filter(username=username).exists():
            errors.append(error_messages['username_taken'])
        if User.objects.filter(email=email).exists():
            errors.append(error_messages['email_registered'])

        # Handle errors
        if errors:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'errors': errors}, status=400)
            else:
                for err in errors:
                    messages.error(request, err)
                return redirect('Signup')

        # Create user if validation passes
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            login(request, user)  # Automatically log in the new user
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': True, 'redirect_url': '/Homepage/'})
            messages.success(request, 'Registration successful!')
            return redirect('Homepage')
        except Exception as e:
            error = f'System error: {str(e)}'
            if request.is_ajax():
                return JsonResponse({'success': False, 'errors': [error]}, status=500)
            messages.error(request, error)
            return redirect('Signup')

    return render(request, 'Signup.html')  # Render the signup page


# Logout function
def logout_page(request):
    logout(request)
    messages.success(request, "You have been logged out.")
    return redirect("Homepage")


# Search results view
def search_results(request):
    query = request.GET.get('search', '')
    if query:
        restaurants = Restaurant.objects.filter(
            Q(name__icontains=query) | Q(recommended_dishes__name__icontains=query) | Q(restaurant_type__name__icontains=query)
        ).distinct()
    else:
        restaurants = Restaurant.objects.all()
    return render(request, 'list.html', {'query': query, 'restaurants': restaurants})

# Restaurant detail page view
def restaurant_detail(request, restaurant_id):
    rating_range = list(range(1, 6))  # Rating scale from 1 to 5
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)

    # Increment view count
    restaurant.view_count += 1
    restaurant.save()

    # Check if the restaurant is favorited by the current user
    is_favorited = False
    if request.user.is_authenticated:
        is_favorited = Favorite.objects.filter(user=request.user, restaurant=restaurant).exists()

    comments = restaurant.comments.all().order_by('-created_at')  # Retrieve comments

    # Calculate rating statistics
    rating_counts_query = restaurant.ratings.values('score').annotate(count=Count('score'))
    average_rating = restaurant.ratings.aggregate(avg=Avg('score'))['avg'] or 0

    # Prepare rating data
    rating_counts_dict = {item['score']: item['count'] for item in rating_counts_query}
    total_ratings = restaurant.ratings.count()

    rating_counts = []
    for score in range(6):
        count = rating_counts_dict.get(score, 0)
        percent = (count / total_ratings * 100) if total_ratings > 0 else 0
        rating_counts.append({
            'score': score,
            'count': count,
            'percent': percent,
        })

    context = {
        'restaurant': restaurant,
        'rating_range': rating_range,
        'rating_counts': rating_counts,
        'average_rating': round(average_rating, 1),
        'comments': comments,
        'is_favorited': is_favorited,
        'is_logged_in': request.user.is_authenticated,
    }
    return render(request, 'Restaurant_Detail.html', context)

def rate_restaurant(request, restaurant_id):
    # Retrieve the restaurant object by ID or return a 404 error if not found
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)

    # Ensure that the request method is POST
    if request.method == "POST":
        try:
            # Extract the rating score from the POST request and convert it to an integer
            score = int(request.POST.get('score', 0))
        except (ValueError, TypeError):
            # If conversion fails, display an error message and redirect to the restaurant detail page
            messages.error(request, "Invalid rating.")
            return redirect('RestaurantDetail', restaurant_id=restaurant_id)

        # Validate that the rating score is within the valid range (1 to 5)
        if score < 1 or score > 5:
            messages.error(request, "Invalid rating. Please select a rating between 1 and 5.")
            return redirect('RestaurantDetail', restaurant_id=restaurant_id)

        # If the user is authenticated, assign the logged-in user as the rating user
        if request.user.is_authenticated:
            rating_user = request.user
        else:
            # If the user is not logged in, set the rating user to None (anonymous)
            rating_user = None

        # Create a new rating entry in the database
        Rating.objects.create(
            user=rating_user,  # The user submitting the rating
            restaurant=restaurant,  # The restaurant being rated
            score=score  # The rating score
        )

        # Display a success message and redirect back to the restaurant detail page
        messages.success(request, "Your rating has been saved.")
        return redirect('RestaurantDetail', restaurant_id=restaurant_id)


def submit_comment(request, restaurant_id):
    # Retrieve the restaurant object by ID or return a 404 error if not found
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)

    # Ensure that the request method is POST
    if request.method == "POST":
        # Extract the comment content from the POST request and remove leading/trailing spaces
        content = request.POST.get('content', '').strip()

        # Check if the comment content is empty
        if not content:
            messages.error(request, "Comment content is required.")
            return redirect('RestaurantDetail', restaurant_id=restaurant_id)

        # If the user is authenticated, assign the logged-in user as the comment user
        if request.user.is_authenticated:
            comment_user = request.user
        else:
            # If the user is not logged in, set the comment user to None (anonymous)
            comment_user = None

        # Create a new comment entry in the database
        Comment.objects.create(
            user=comment_user,  # The user submitting the comment
            restaurant=restaurant,  # The restaurant being reviewed
            content=content  # The text content of the comment
        )

        # Display a success message and redirect back to the restaurant detail page
        messages.success(request, "Your review has been submitted.")
        return redirect('RestaurantDetail', restaurant_id=restaurant_id)


def profile_page(request):
    user = request.user
    favorites = user.favorites.all() if user.is_authenticated else []
    rating_range = list(range(1, 6))
    ratings = user.ratings.all() if user.is_authenticated else []

    context = {
        'profile': user,
        'favorites': favorites,
        'ratings': ratings,
        'rating_range': rating_range,
    }
    return render(request, 'profile.html', context)


# Add a restaurant to favorites
@csrf_exempt
def add_favorite(request, restaurant_id):
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'Please log in first to favorite.'}, status=403)

    try:
        restaurant = Restaurant.objects.get(id=restaurant_id)
        favorite, created = Favorite.objects.get_or_create(user=request.user, restaurant=restaurant)
        if created:
            return JsonResponse({'success': True, 'message': 'Restaurant added to favorites.'})
        else:
            return JsonResponse({'success': False, 'message': 'You have already favorited this restaurant.'})
    except Restaurant.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Restaurant not found.'}, status=404)



def make_reservation(request, restaurant_id):
    # Ensure that the request method is POST, as reservations should only be made through POST requests
    if request.method == "POST":
        try:
            # Retrieve the restaurant object based on the given restaurant_id
            restaurant = Restaurant.objects.get(id=restaurant_id)
        except Restaurant.DoesNotExist:
            # If the restaurant does not exist, return a JSON response with an error message and 404 status
            return JsonResponse({'success': False, 'message': 'Restaurant not found.'}, status=404)

        # Extract data from the POST request
        data = request.POST or {}
        date_str = data.get('date')  # Get the reservation date from the request
        time_str = data.get('time')  # Get the reservation time from the request
        party_size_str = data.get('party_size')  # Get the party size from the request

        # Check if all required fields are provided
        if not all([date_str, time_str, party_size_str]):
            return JsonResponse({'success': False, 'message': 'Please fill out all reservation fields.'}, status=400)

        try:
            # Convert the date string into a date object
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            # Convert the time string into a time object
            time_obj = datetime.strptime(time_str, "%H:%M").time()
            # Convert the party size string into an integer
            party_size = int(party_size_str)
        except ValueError:
            # Return an error response if the date, time, or party size format is invalid
            return JsonResponse({'success': False, 'message': 'Invalid date/time/party size format.'}, status=400)

        # If the user is authenticated, assign the user to the reservation, otherwise assign None
        user = request.user if request.user.is_authenticated else None

        # Create a new reservation record in the database
        Reservation.objects.create(
            user=user,  # The user making the reservation (if logged in)
            restaurant=restaurant,  # The restaurant being reserved
            date=date_obj,  # The date of the reservation
            time=time_obj,  # The time of the reservation
            party_size=party_size  # The number of people in the reservation
        )

        # Return a success response indicating that the reservation has been submitted
        return JsonResponse({'success': True, 'message': 'Reservation submitted successfully!'})

    else:
        # If the request method is not POST, return an error response with a 405 status
        return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)



