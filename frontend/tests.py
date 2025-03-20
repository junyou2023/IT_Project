import os

from PIL import Image  # Pillow library for image processing

# Set the default Django settings module for script execution
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "IT_Project.settings")

# Initialize Django environment to use Django ORM features independently
import django
django.setup()

# Import models from the frontend application
from frontend.models import RestaurantType, Restaurant, RecommendedDish

# Function to convert image files to WebP format and replace originals
def convert_images_to_webp_and_replace(input_folder):

    # Supported image formats to convert
    supported_formats = ('.jpg', '.jpeg', '.png', '.bmp', '.gif')

    # Loop through all files in the given directory
    for filename in os.listdir(input_folder):
        if filename.lower().endswith(supported_formats):
            input_path = os.path.join(input_folder, filename)  # Original image path
            output_path = os.path.join(input_folder, os.path.splitext(filename)[0] + '.webp')  # WebP image path
            try:
                # Open image file using Pillow
                with Image.open(input_path) as img:
                    # Save image in WebP format
                    img.save(output_path, 'WEBP')
                print(f"Successfully converted {input_path} to {output_path}")

                # Remove the original image after successful conversion
                os.remove(input_path)
                print(f"Deleted original file {input_path}")
            except Exception as e:
                # Print error if conversion fails
                print(f"Conversion failed: {input_path} -> {e}")

# Define the input directory containing images
input_folder = "../static/img/"

# Execute the conversion function
convert_images_to_webp_and_replace(input_folder)
