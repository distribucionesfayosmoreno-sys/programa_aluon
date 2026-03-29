alter table if exists customers
    add column if not exists password_hash varchar(255);

alter table if exists customer_password_resets
    add column if not exists customer_id uuid;

alter table if exists customer_password_resets
    alter column registration_id drop not null;
