ALTER TABLE projects DROP COLUMN IF EXISTS slug;

ALTER TABLE project_tags RENAME TO technologies;
ALTER TABLE project_tag_map RENAME TO project_technology_map;
ALTER TABLE project_technology_map RENAME COLUMN tag_id TO technology_id;

ALTER TABLE technologies DROP COLUMN IF EXISTS slug;

ALTER INDEX IF EXISTS idx_project_tag_map_tag RENAME TO idx_project_technology_map_technology;
CREATE INDEX IF NOT EXISTS idx_project_technology_map_project ON project_technology_map(project_id);
