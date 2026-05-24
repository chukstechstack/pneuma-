
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE profiles(
id  SERIAL PRIMARY KEY,
uuid UUID DEFAULT gen_random_uuid() UNIQUE,
username text NOT NULL,
password text null,
first_name text NOT NULL,
last_name text not null,
country text  NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
email text NOT NULL UNIQUE,
google_id text, 
avatar_url  text
);



CREATE TABLE content (
id SERIAL PRIMARY KEY,
uuid UUID DEFAULT gen_random_uuid() UNIQUE,
title text NOT NULL,
content text NOT NULL, 
img  text,
created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
category text NOT NULL,
tags text[] NOT NULL,
user_id INT REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_content_user_id ON content(user_id);
CREATE INDEX idx_content_uuid ON content(uuid);
CREATE INDEX idx_content_tags ON content USING GIN(tags)



CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- 1. Tell the database the 3 types of actions allowed
CREATE TYPE interaction_type_enum AS ENUM ('like', 'repost', 'share');

-- 2. Create the big table to hold all actions
CREATE TABLE interactions (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    user_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    content_id INT REFERENCES content(id) ON DELETE CASCADE,
    interaction_type interaction_type_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- This stops a user from liking the same post twice
    UNIQUE(user_id, content_id, interaction_type)
);

-- 3. Add shortcuts so the database can find data fast
CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_interactions_content_id ON interactions(content_id);


ALTER TABLE content 
ADD COLUMN likes_count INT DEFAULT 0,
ADD COLUMN reposts_count INT DEFAULT 0,
ADD COLUMN shares_count INT DEFAULT 0;
