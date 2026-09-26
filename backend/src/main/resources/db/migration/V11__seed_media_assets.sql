-- Seed core media assets if they do not exist
INSERT INTO media_assets (id, folder, resource_type, public_id, url, original_filename, mime_type, bytes)
VALUES 
    (1, 'resume', 'raw', 'chirru-portfolio/resume/Cv.pdf', 'https://res.cloudinary.com/rnplcrmq/raw/upload/v1790045816/chirru-portfolio/resume/Cv.pdf', 'Cv.pdf', 'application/pdf', 184899),
    (2, 'profile', 'image', 'chirru-portfolio/profile/profile', 'https://res.cloudinary.com/rnplcrmq/image/upload/v1790045813/chirru-portfolio/profile/profile.jpg', 'profile.jpg', 'image/jpeg', 362078),
    (5, 'projects', 'image', 'chirru-portfolio/projects/social-media-dashboard', 'https://res.cloudinary.com/rnplcrmq/image/upload/v1790138123/chirru-portfolio/projects/social-media-dashboard.webp', 'social-media-dashboard.webp', 'image/webp', 13370),
    (7, 'projects', 'image', 'chirru-portfolio/projects/student-grade-tracker', 'https://res.cloudinary.com/rnplcrmq/image/upload/v1790138469/chirru-portfolio/projects/student-grade-tracker.webp', 'student-grade-tracker.webp', 'image/webp', 13572)
ON CONFLICT (id) DO UPDATE SET
    url = EXCLUDED.url,
    public_id = EXCLUDED.public_id,
    original_filename = EXCLUDED.original_filename,
    mime_type = EXCLUDED.mime_type,
    bytes = EXCLUDED.bytes;

-- Advance media_assets sequence past highest seeded ID
SELECT setval(pg_get_serial_sequence('media_assets', 'id'), COALESCE((SELECT MAX(id) FROM media_assets), 1));

-- Sync profile table public_id and URLs
UPDATE profile
SET image_public_id = 'chirru-portfolio/profile/profile',
    image_url = 'https://res.cloudinary.com/rnplcrmq/image/upload/v1790045813/chirru-portfolio/profile/profile.jpg',
    resume_public_id = 'chirru-portfolio/resume/Cv.pdf',
    resume_url = '/api/v2/media/1'
WHERE id = 1;

-- Sync project image public IDs
UPDATE projects
SET image_public_id = 'chirru-portfolio/projects/social-media-dashboard',
    image_url = '/api/v2/media/5'
WHERE id = 1;

UPDATE projects
SET image_public_id = 'chirru-portfolio/projects/student-grade-tracker',
    image_url = '/api/v2/media/7'
WHERE id = 2;
