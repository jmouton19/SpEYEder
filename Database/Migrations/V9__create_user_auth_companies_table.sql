CREATE TABLE "user_auth_companies" (
    user_id INTEGER NOT NULL,
    provider_id INTEGER NOT NULL,
    access_token TEXT,            
    refresh_token TEXT,           
    expires_in TIMESTAMP,         -- When the access token expires
    PRIMARY KEY (user_id, provider_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES providers(provider_id) ON DELETE RESTRICT
);