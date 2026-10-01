-- Update profile image URL to use backend media proxy
UPDATE profile
SET image_url = '/api/v2/media/2'
WHERE id = 1 AND (image_url LIKE '%res.cloudinary.com%' OR image_url IS NULL OR image_url = '');
