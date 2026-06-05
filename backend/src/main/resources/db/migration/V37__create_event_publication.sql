CREATE TABLE IF NOT EXISTS event_publication (
    id UUID PRIMARY KEY,
    publication_date TIMESTAMPTZ NOT NULL,
    listener_id VARCHAR(255) NOT NULL,
    serialized_event VARCHAR(255) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    completion_date TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_event_publication_completion_date
    ON event_publication (completion_date);

CREATE INDEX IF NOT EXISTS idx_event_publication_listener_id
    ON event_publication (listener_id);
