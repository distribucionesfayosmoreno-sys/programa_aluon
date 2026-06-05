ALTER TABLE users
    ALTER COLUMN telefono TYPE INTEGER
    USING CASE
        WHEN telefono IS NULL THEN NULL
        ELSE telefono::INTEGER
    END;
