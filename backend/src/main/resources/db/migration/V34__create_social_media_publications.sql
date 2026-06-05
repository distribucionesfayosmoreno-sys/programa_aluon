CREATE TABLE social_media_publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    title VARCHAR(180) NOT NULL,
    content TEXT NOT NULL,
    media_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    scheduled_at TIMESTAMP,
    queued_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE social_media_publication_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    publication_id UUID NOT NULL REFERENCES social_media_publications(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    account_name VARCHAR(120),
    account_handle VARCHAR(120),
    profile_url TEXT,
    caption_override TEXT,
    hashtags TEXT,
    notes TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT uq_social_media_publication_channel_platform UNIQUE (publication_id, platform)
);

CREATE INDEX idx_social_media_publications_tenant ON social_media_publications(tenant_id);
CREATE INDEX idx_social_media_publications_status ON social_media_publications(status);
CREATE INDEX idx_social_media_publications_scheduled_at ON social_media_publications(scheduled_at);
CREATE INDEX idx_social_media_publication_channels_tenant ON social_media_publication_channels(tenant_id);
CREATE INDEX idx_social_media_publication_channels_publication ON social_media_publication_channels(publication_id);

COMMENT ON TABLE social_media_publications IS 'Publicaciones administrativas para RRSS';
COMMENT ON TABLE social_media_publication_channels IS 'Configuracion por canal de cada publicacion';
