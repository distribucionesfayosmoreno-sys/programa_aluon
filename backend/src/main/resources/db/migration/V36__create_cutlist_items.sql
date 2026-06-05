CREATE TABLE IF NOT EXISTS cutlist_items (
    id UUID PRIMARY KEY,
    cutlist_id UUID NOT NULL,
    sort_index INTEGER NOT NULL,
    description TEXT NOT NULL,
    units INTEGER NOT NULL,
    cut_measure VARCHAR(120) NOT NULL,
    CONSTRAINT fk_cutlist_items_cutlist
        FOREIGN KEY (cutlist_id) REFERENCES cutlists (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cutlist_items_cutlist_id
    ON cutlist_items (cutlist_id);

CREATE INDEX IF NOT EXISTS idx_cutlist_items_sort_index
    ON cutlist_items (cutlist_id, sort_index);
