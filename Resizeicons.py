from PIL import Image

img = Image.open("RedOctagonIcon.jpg")

"""
for i in [16, 32, 48, 64, 96, 128]:
    img_resized = img.resize((i,i), Image.Resampling.LANCZOS)
    img_resized.save(f'icons/ScreenLike{i}.png')
"""
for i in [16, 32, 48, 64, 96, 128]:
    print(f'"{i}": "icons/ScreenLike{i}.png",')
