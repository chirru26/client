-- Sync profile public IDs with existing uploaded media assets
UPDATE profile 
SET image_public_id = 'chirru-portfolio/profile/profile'
WHERE image_public_id IS NULL AND image_url LIKE '%/media/2%';

UPDATE profile 
SET resume_public_id = 'chirru-portfolio/resume/Cv.pdf'
WHERE resume_public_id IS NULL AND resume_url LIKE '%/media/1%';

-- Seed core skills if table is empty
INSERT INTO skills (name, category, icon)
VALUES 
    ('Java', 'Backend', 'coffee'),
    ('Spring Boot', 'Backend', 'zap'),
    ('PostgreSQL', 'Databases', 'database'),
    ('Hibernate / JPA', 'Backend', 'layers'),
    ('REST APIs', 'Backend', 'network'),
    ('Microservices', 'Backend', 'server'),
    ('JWT Security', 'Backend', 'lock'),
    ('Docker', 'DevOps', 'container'),
    ('React', 'Frontend', 'layout'),
    ('JavaScript', 'Frontend', 'code'),
    ('Maven', 'Tools', 'package'),
    ('Git & GitHub', 'Tools', 'git-branch')
ON CONFLICT (name) DO NOTHING;

-- Seed core social links if not already present
INSERT INTO social_links (platform, label, url, icon, display_order, visible)
SELECT 'GitHub', 'GitHub', 'https://github.com/heychirru', 'github', 1, true
WHERE NOT EXISTS (SELECT 1 FROM social_links WHERE platform = 'GitHub');

INSERT INTO social_links (platform, label, url, icon, display_order, visible)
SELECT 'LinkedIn', 'LinkedIn', 'https://www.linkedin.com/in/heychirru26', 'linkedin', 2, true
WHERE NOT EXISTS (SELECT 1 FROM social_links WHERE platform = 'LinkedIn');

-- Seed home SEO settings if not already present
INSERT INTO seo_settings (page_key, title, description, keywords, canonical_url, og_image_url, no_index)
VALUES (
    'home',
    'Chiranjit Das | Java & Backend Developer',
    'Official portfolio of Chiranjit Das, Java & Backend Software Engineer specializing in Spring Boot, REST APIs, Microservices, and scalable web applications.',
    'Java, Spring Boot, Backend Developer, PostgreSQL, REST APIs, Microservices, Cloudinary',
    '/',
    '/og-image.jpg',
    false
)
ON CONFLICT (page_key) DO NOTHING;
