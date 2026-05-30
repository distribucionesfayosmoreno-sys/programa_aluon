CREATE TABLE IF NOT EXISTS aluon_saas_door_visual_simulation_jobs (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(32) NOT NULL,
    base_image_url TEXT,
    result_image_url TEXT,
    mask_x INTEGER,
    mask_y INTEGER,
    mask_width INTEGER,
    mask_height INTEGER,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT chk_door_visual_simulation_jobs_status
        CHECK (status IN ('AWAITING_MASK', 'PROCESSING', 'DONE', 'FAILED'))
);

CREATE INDEX IF NOT EXISTS idx_door_visual_simulation_jobs_tenant ON aluon_saas_door_visual_simulation_jobs (tenant_id);
CREATE INDEX IF NOT EXISTS idx_door_visual_simulation_jobs_status ON aluon_saas_door_visual_simulation_jobs (status);
