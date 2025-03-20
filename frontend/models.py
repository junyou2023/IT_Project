from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom user model extending Django's built-in AbstractUser
class CustomUser(AbstractUser):
    avatar = models.ImageField(max_length=100, upload_to='avatar', default='avatar/avatar.jpg')  # User avatar image
    full_name = models.CharField(max_length=100, blank=True)  # User's full name (optional)

    def __str__(self):
        return self.username  # String representation is the user's username

# Model representing different types or categories of restaurants
class RestaurantType(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Restaurant Type")  # Type/category name
    photo = models.ImageField(max_length=100, upload_to='type_photo')  # Representative photo for the type

    def __str__(self):
        return self.name  # String representation is the type name

# Model representing a restaurant
class Restaurant(models.Model):
    name = models.CharField(max_length=200, verbose_name="Restaurant Name")  # Restaurant's name
    address = models.CharField(max_length=255, verbose_name="Address")  # Restaurant's address
    phone = models.CharField(max_length=15, verbose_name="Phone")  # Contact phone number
    restaurant_type = models.ForeignKey(
        RestaurantType,
        on_delete=models.CASCADE,
        related_name="restaurants",
        verbose_name="Restaurant Type"
    )  # Restaurant type/category (ForeignKey relationship)
    rating = models.FloatField(default=0.0, verbose_name="Rating")  # Average rating score
    comment_count = models.PositiveIntegerField(default=0, verbose_name="Comment Count")  # Number of comments
    view_count = models.PositiveIntegerField(default=0, verbose_name="View Count")  # Number of views
    favorite_count = models.PositiveIntegerField(default=0, verbose_name="Favorite Count")  # Number of times favorited

    def __str__(self):
        return self.name  # String representation is the restaurant's name

# Model for storing photos of restaurants
class RestaurantPhoto(models.Model):
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name="photos",
        verbose_name="Restaurant"
    )  # Associated restaurant
    photo = models.ImageField(upload_to="restaurant_photos/", verbose_name="Photo")  # Photo file

    def __str__(self):
        return f"{self.restaurant.name} - Photo"  # String representation includes restaurant's name

# Model representing recommended dishes at a restaurant
class RecommendedDish(models.Model):
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name="recommended_dishes",
        verbose_name="Restaurant"
    )  # Associated restaurant
    name = models.CharField(max_length=200, verbose_name="Dish Name")  # Dish name
    photo = models.ImageField(upload_to="recommended_dishes/", verbose_name="Photo")  # Dish photo
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Price")  # Dish price
    description = models.TextField(blank=True, verbose_name="Description")  # Optional description of the dish

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"  # String representation includes restaurant and dish names

# Model for user comments on restaurants
class Comment(models.Model):
    user = models.ForeignKey(CustomUser, null=True, blank=True,
                             on_delete=models.SET_NULL, related_name="comments",
                             verbose_name="User")  # Commenting user, allows anonymous (null user)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE,
                                   related_name="comments", verbose_name="Restaurant")  # Associated restaurant
    content = models.TextField(verbose_name="Comment Content")  # Text content of comment
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")  # Timestamp when comment was created

    def __str__(self):
        if self.user:
            return f"{self.user.username} - {self.restaurant.name}"  # If user exists, show username
        return f"Anonymous - {self.restaurant.name}"  # Otherwise, anonymous

# Model representing user ratings for restaurants
class Rating(models.Model):
    user = models.ForeignKey(CustomUser, null=True, blank=True,
                             on_delete=models.SET_NULL, related_name="ratings",
                             verbose_name="User")  # Rating user, allows anonymous (null user)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE,
                                   related_name="ratings", verbose_name="Restaurant")  # Associated restaurant
    score = models.PositiveSmallIntegerField(verbose_name="Score")  # Rating score provided by user

    def __str__(self):
        if self.user:
            return f"{self.user.username} - {self.restaurant.name}"  # Username if user exists
        return f"Anonymous Rating - {self.restaurant.name}"  # Otherwise, anonymous rating

# Model for tracking user's favorite restaurants
class Favorite(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                             related_name="favorites", verbose_name="User")  # User who favorited
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE,
                                   related_name="favorites", verbose_name="Restaurant")  # Favorited restaurant

    class Meta:
        unique_together = ('user', 'restaurant')  # Ensure no duplicate favorites for same user-restaurant pair

    def __str__(self):
        return f"{self.user.username} - {self.restaurant.name}"  # Username and restaurant's name

# Model representing restaurant reservations made by users
class Reservation(models.Model):
    """
    A simple Reservation model for the 'Make a Reservation' form.
    If user is logged in, store user. Otherwise, user=None => anonymous reservation.
    """
    user = models.ForeignKey(CustomUser, null=True, blank=True,
                             on_delete=models.SET_NULL, related_name='reservations')  # User making reservation, allows anonymous
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE,
                                   related_name='reservations')  # Restaurant being reserved
    date = models.DateField()  # Reservation date
    time = models.TimeField()  # Reservation time
    party_size = models.PositiveIntegerField()  # Number of people in reservation
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when reservation was created

    def __str__(self):
        if self.user:
            return f"Reservation by {self.user.username} on {self.date} at {self.time}"  # Username if user exists
        return f"Reservation (anonymous) on {self.date} at {self.time}"  # Otherwise, anonymous reservation
