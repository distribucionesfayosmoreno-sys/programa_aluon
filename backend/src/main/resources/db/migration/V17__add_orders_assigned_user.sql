ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS assigned_user_id bigint;

ALTER TABLE orders
    DROP CONSTRAINT IF EXISTS orders_assigned_user_fk;

ALTER TABLE orders
    ADD CONSTRAINT orders_assigned_user_fk
    FOREIGN KEY (assigned_user_id) REFERENCES users(id);
