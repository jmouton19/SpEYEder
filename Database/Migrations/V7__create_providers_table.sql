CREATE TABLE "providers" (
    provider_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);
 
INSERT INTO providers (name) VALUES
    ('google'),
    ('github');