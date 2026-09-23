-- Ensure profile table has correct resume references pointing to media asset 1
UPDATE profile 
SET resume_url = '/api/v2/media/1',
    resume_public_id = 'chirru-portfolio/resume/Cv.pdf'
WHERE id = 1 AND (resume_url IS NULL OR resume_url = '' OR resume_public_id LIKE '%/media/%');
