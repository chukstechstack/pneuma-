-- ========================================================
-- 🗑️ SAFE CLEANUP (Drops old/conflicting tables)
-- ========================================================
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS user_avatars CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS interactions CASCADE;
DROP TABLE IF EXISTS content CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TYPE IF EXISTS interaction_type_enum CASCADE;

-- ========================================================
-- ⚙️ EXTENSIONS & ENUMS
-- ========================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE interaction_type_enum AS ENUM ('like', 'repost', 'share');


-- ========================================================
-- 1. PROFILES TABLE (Only email, password, full_name NOT NULL)
-- ========================================================
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    username TEXT NULL,
    password TEXT NOT NULL,         -- Required
    full_name TEXT NOT NULL,        -- Required
    country TEXT NULL,
    email TEXT NOT NULL UNIQUE,     -- Required
    google_id TEXT NULL, 
    avatar_url TEXT NULL,
    bio TEXT NULL,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ========================================================
-- 2. CONTENT TABLE (All fields nullable except primary keys/foreign keys)
-- ========================================================
CREATE TABLE content (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    title TEXT NULL,
    content TEXT NULL, 
    img TEXT NULL,
    category TEXT NULL,
    tags TEXT[] NULL,
    user_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    likes_count INT DEFAULT 0,
    reposts_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ========================================================
-- 3. EXPRESS SESSION TABLE (Required for session handling)
-- ========================================================
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL COLLATE "default",
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL
) WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;


-- ========================================================
-- 4. INTERACTIONS TABLE
-- ========================================================
CREATE TABLE interactions (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    user_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    content_id INT REFERENCES content(id) ON DELETE CASCADE,
    interaction_type interaction_type_enum NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_id, interaction_type)
);


-- ========================================================
-- 5. COMMENTS TABLE
-- ========================================================
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    content_id INT REFERENCES content(id) ON DELETE CASCADE,
    user_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ========================================================
-- 6. FOLLOWS TABLE
-- ========================================================
CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    following_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NULL DEFAULT 'approved', 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);


-- ========================================================
-- 7. MESSAGES TABLE
-- ========================================================
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    sender_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ========================================================
-- 8. USER AVATARS TABLE
-- ========================================================
CREATE TABLE user_avatars (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    image_url TEXT NULL,
    file_size INT NULL,
    mime_type VARCHAR(50) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ========================================================
-- 9. CONNECTIONS TABLE
-- ========================================================
CREATE TABLE connections (
    connector_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    connected_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    connector_uuid UUID NULL,
    connected_uuid UUID NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (connector_id, connected_id)
);


-- ========================================================
-- 10. ALERTS TABLE
-- ========================================================
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    recipient_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    actor_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NULL DEFAULT 'new_post',
    reference_id INT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ========================================================
-- 🚀 PERFORMANCE INDEXES
-- ========================================================
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_uuid ON profiles(uuid);

CREATE INDEX idx_content_user_id ON content(user_id);
CREATE INDEX idx_content_uuid ON content(uuid);
CREATE INDEX idx_content_tags ON content USING GIN(tags);
CREATE INDEX idx_content_created_at_desc ON content(created_at DESC); 

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_interactions_content_id ON interactions(content_id);

CREATE INDEX idx_comments_content_id ON comments(content_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);

CREATE INDEX idx_follows_follower_following ON follows(follower_id, following_id);
CREATE INDEX idx_messages_sender_recipient ON messages (sender_id, recipient_id);

CREATE INDEX idx_user_avatars_profile_id ON user_avatars(profile_id);
CREATE INDEX idx_connections_connected ON connections(connected_id);
CREATE INDEX idx_connections_connector_uuid ON connections(connector_uuid);
CREATE INDEX idx_alerts_recipient ON alerts(recipient_id, is_read, created_at DESC);