CREATE TABLE site_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE social_links (
    id BIGSERIAL PRIMARY KEY,
    platform VARCHAR(80) NOT NULL,
    label VARCHAR(120),
    url VARCHAR(1000) NOT NULL,
    icon VARCHAR(255),
    display_order INTEGER NOT NULL DEFAULT 0,
    visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE seo_settings (
    id BIGSERIAL PRIMARY KEY,
    page_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255),
    description VARCHAR(500),
    keywords VARCHAR(1000),
    canonical_url VARCHAR(1000),
    og_image_url VARCHAR(1000),
    no_index BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_case_studies (
    project_id BIGINT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
    overview TEXT,
    problem TEXT,
    solution TEXT,
    features TEXT,
    architecture TEXT,
    challenges TEXT,
    results TEXT,
    content TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_tag_map (
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES project_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

CREATE TABLE media_assets (
    id BIGSERIAL PRIMARY KEY,
    folder VARCHAR(100) NOT NULL,
    resource_type VARCHAR(30) NOT NULL,
    public_id VARCHAR(500) NOT NULL UNIQUE,
    url VARCHAR(2000) NOT NULL,
    original_filename VARCHAR(500),
    mime_type VARCHAR(150),
    bytes BIGINT,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resume_versions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    url VARCHAR(2000) NOT NULL,
    public_id VARCHAR(500),
    version_label VARCHAR(80),
    active BOOLEAN NOT NULL DEFAULT FALSE,
    download_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics_events (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    path VARCHAR(1000),
    project_id BIGINT REFERENCES projects(id) ON DELETE SET NULL,
    referrer VARCHAR(1000),
    country VARCHAR(100),
    device VARCHAR(50),
    visitor_hash VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(80) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    link VARCHAR(1000),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_social_links_visible_order ON social_links(visible, display_order);
CREATE INDEX idx_project_tag_map_tag ON project_tag_map(tag_id);
CREATE INDEX idx_media_assets_folder_created ON media_assets(folder, created_at DESC);
CREATE INDEX idx_resume_active ON resume_versions(active, created_at DESC);
CREATE INDEX idx_analytics_type_created ON analytics_events(event_type, created_at DESC);
CREATE INDEX idx_analytics_project_created ON analytics_events(project_id, created_at DESC);
CREATE INDEX idx_notifications_read_created ON notifications(read, created_at DESC);
