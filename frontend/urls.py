from django.urls import path
from . import views

from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage, name='Homepage'),
    path('Homepage/', views.homepage, name='Homepage_alt'),
    path('Login/', views.login_page, name='Login'),
    path('Signup/', views.signup, name='Signup'),
]