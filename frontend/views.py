from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

def render_page(request, template_name):
    return render(request, template_name)

def homepage(request):
    return render_page(request, 'Homepage.html')

def login_page(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        if not User.objects.filter(username=username).exists():
            messages.error(request, "This username does not exist. Please sign up.")
            return redirect("Login")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, "Login successful!")
            return redirect("Homepage")
        else:
            messages.error(request, "Incorrect password. Please try again.")
            return redirect("Login")

    return render(request, "Login.html")

User = get_user_model()  # Using custom user model


def validate_password_strength(password):
    """Password strength validation"""
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters")
    if not any(char.isdigit() for char in password):
        raise ValidationError("Password must contain numbers")
    if not any(char.isalpha() for char in password):
        raise ValidationError("Password must contain letters")


def signup(request):
    error_messages = {
        'username_taken': 'Username already taken',
        'email_registered': 'Email already registered',
        'password_mismatch': 'Passwords do not match',
        'invalid_email': 'Invalid email format',
        'weak_password': 'Weak password: Must be at least 8 characters with both letters and numbers'
    }

    if request.method == "POST":
        data = request.POST
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        errors = []
        response_data = {'success': False, 'errors': []}

        # Basic field validation
        if not all([username, email, password, confirm_password]):
            errors.append('All fields are required')

        # Password confirmation check
        if password != confirm_password:
            errors.append(error_messages['password_mismatch'])

        # Email format validation
        try:
            validate_email(email)
        except ValidationError:
            errors.append(error_messages['invalid_email'])

        # Password strength validation
        try:
            validate_password_strength(password)
        except ValidationError as e:
            errors.extend(e.messages)

        # Uniqueness validation
        if User.objects.filter(username=username).exists():
            errors.append(error_messages['username_taken'])
        if User.objects.filter(email=email).exists():
            errors.append(error_messages['email_registered'])

        # Error handling
        if errors:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                response_data['errors'] = errors
                return JsonResponse(response_data, status=400)
            else:
                for error in errors:
                    messages.error(request, error)
                return render(request, 'auth/Signup.html')

        # Create user
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            login(request, user)

            # Handle AJAX request
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                response_data.update({
                    'success': True,
                    'redirect_url': '/Login/'
                })
                return JsonResponse(response_data)

            # Regular request handling
            messages.success(request, 'Registration successful!')
            return redirect('Login')

        except Exception as e:
            error = f'System error: {str(e)}'
            if request.is_ajax():
                response_data['errors'] = [error]
                return JsonResponse(response_data, status=500)
            messages.error(request, error)
            return render(request, 'auth/Signup.html')

    return render(request, 'auth/Signup.html')