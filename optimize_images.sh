#!/bin/bash
# Batch compress and resize all images in public/images for web use
# Requires: ImageMagick (install with: sudo apt install imagemagick)

IMG_DIR="public/images"
MAX_WIDTH=1600
QUALITY=80

# Optimize all images in the folder (jpg, jpeg, png, JPG, PNG, gif, bmp, tiff, webp)
find "$IMG_DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.JPG' -o -iname '*.PNG' -o -iname '*.gif' -o -iname '*.bmp' -o -iname '*.tiff' -o -iname '*.webp' \) | while read -r img; do
  fname=$(basename "$img")
  echo "Optimizing $fname..."
  # Create a backup first
  cp "$img" "$img.bak"
  # Resize and compress (preserve aspect ratio, only shrink if larger)
  convert "$img" -resize ${MAX_WIDTH}x${MAX_WIDTH}\> -strip -interlace Plane -quality $QUALITY "$img"
  # Optionally, convert to WebP for even better compression (uncomment below)
  # cwebp -q 80 "$img" -o "${img%.*}.webp"
done

echo "Optimization complete!"
