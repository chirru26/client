CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(255),
    action VARCHAR(80) NOT NULL,
    resource VARCHAR(120),
    http_method VARCHAR(10),
    path VARCHAR(2048),
    ip_address VARCHAR(64),
    success BOOLEAN NOT NULL,
    details VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_user_email ON audit_logs(user_email);
