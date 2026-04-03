ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS workflow_stage varchar(20);

UPDATE orders
SET workflow_stage = workflow_step
WHERE workflow_stage IS NULL;

ALTER TABLE orders
    ALTER COLUMN workflow_stage SET NOT NULL;

ALTER TABLE orders
    DROP CONSTRAINT IF EXISTS orders_workflow_stage_check;

ALTER TABLE orders
    ADD CONSTRAINT orders_workflow_stage_check
    CHECK (workflow_stage IN ('INBOX','REQUEST','BUDGET','VALIDATION','DEV','PROD','FINAL'));
