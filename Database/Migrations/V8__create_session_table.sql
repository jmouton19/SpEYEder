

 
 

 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
 
CREATE TABLE "sessions" (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER NOT NULL,                              
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,                         
    data JSONB,                                             -- Optional field for storing any session-specific data in JSON format
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);