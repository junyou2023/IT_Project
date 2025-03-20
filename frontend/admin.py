from django.contrib import admin
from .models import CustomUser, RestaurantType, Restaurant, RestaurantPhoto, Comment, Rating, Favorite, RecommendedDish


# Custom admin classes to customize the display of models in the admin interface

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'full_name', 'email', 'avatar')
    search_fields = ('username', 'full_name', 'email')
    list_filter = ('is_active', 'is_staff')

@admin.register(RestaurantType)
class RestaurantTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'restaurant_type', 'rating', 'comment_count', 'view_count', 'favorite_count')
    search_fields = ('name', 'address', 'phone')
    list_filter = ('restaurant_type',)
    readonly_fields = ('rating', 'comment_count', 'view_count', 'favorite_count')

    def save_model(self, request, obj, form, change):
        # Update the rating, comment_count, view_count, and favorite_count fields
        obj.rating = obj.ratings.aggregate(models.Avg('score'))['score__avg'] or 0.0
        obj.comment_count = obj.comments.count()
        obj.view_count = obj.view_count  # This should be updated in the view
        obj.favorite_count = obj.favorites.count()
        super().save_model(request, obj, form, change)

@admin.register(RestaurantPhoto)
class RestaurantPhotoAdmin(admin.ModelAdmin):
    list_display = ('restaurant', 'photo')
    search_fields = ('restaurant__name',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'restaurant', 'created_at')
    search_fields = ('user__username', 'restaurant__name', 'content')
    list_filter = ('created_at',)

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('user', 'restaurant', 'score')
    search_fields = ('user__username', 'restaurant__name')
    list_filter = ('score',)

@admin.register(RecommendedDish)
class RecommendedDishAdmin(admin.ModelAdmin):
    list_display = ('restaurant', 'name', 'price')
    search_fields = ('restaurant__name', 'name')
    list_filter = ('restaurant',)
@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'restaurant')
    search_fields = ('user__username', 'restaurant__name')
