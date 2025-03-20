from django.urls import path
from . import views



urlpatterns = [
    path('', views.homepage, name='Homepage'),
    path('Homepage/', views.homepage, name='Homepage_alt'),
    path('Login/', views.login_page, name='Login'),
    path('Signup/', views.signup, name='Signup'),
    path('search/', views.search_results, name='SearchResults'),
    path('logout/', views.logout_page, name='Logout'),
    path('restaurant/<int:restaurant_id>/', views.restaurant_detail, name='RestaurantDetail'),
    path('restaurant/<int:restaurant_id>/rate/', views.rate_restaurant, name='RateRestaurant'),
    path('restaurant/<int:restaurant_id>/comment/', views.submit_comment, name='SubmitComment'),
    path('restaurant/<int:restaurant_id>/reserve/', views.make_reservation, name='MakeReservation'),  # 新增
    path('profile/', views.profile_page, name='Profile'),
    path('favorite/<int:restaurant_id>/', views.add_favorite, name='add_favorite'),
]
