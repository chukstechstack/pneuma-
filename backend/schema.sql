-- ========================================================
-- 🗑️ SAFE CLEANUP (Drops old/conflicting tables)
-- ========================================================
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS task_interactions CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS interactions CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
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
-- 1. PROFILES TABLE
-- ========================================================
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    username TEXT NOT NULL,
    password TEXT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    country TEXT NULL,
    email TEXT NOT NULL UNIQUE,
    google_id TEXT, 
    avatar_url TEXT,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ========================================================
-- 2. CONTENT TABLE (Tasks / Posts / Sanctuary Logs)
-- ========================================================
CREATE TABLE content (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL, 
    img TEXT,
    category TEXT NOT NULL,
    tags TEXT[] NOT NULL,
    user_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    likes_count INT DEFAULT 0,
    reposts_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ========================================================
-- 3. EXPRESS SESSION TABLE
-- ========================================================
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL COLLATE "default",
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL
) WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;


-- ========================================================
-- 4. INTERACTIONS TABLE (Likes, Reposts, Shares)
-- ========================================================
CREATE TABLE interactions (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    user_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    content_id INT REFERENCES content(id) ON DELETE CASCADE,
    interaction_type interaction_type_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Prevents duplicate identical actions from the same user on the same post
    UNIQUE(user_id, content_id, interaction_type)
);


-- ========================================================
-- 5. COMMENTS TABLE (Fully Relational to Profiles & Content)
-- ========================================================
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    content_id INT REFERENCES content(id) ON DELETE CASCADE,
    user_id INT REFERENCES profiles(id) ON DELETE CASCADE, -- Exact profile mapping!
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ========================================================
-- 6. FOLLOWS TABLE (With Request Status)
-- ========================================================
CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id INT REFERENCES profiles(id) ON DELETE CASCADE,  
    following_id INT REFERENCES profiles(id) ON DELETE CASCADE, 
    status TEXT NOT NULL DEFAULT 'approved', -- 'pending' or 'approved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Prevents duplicate follow pairings
    UNIQUE(follower_id, following_id)
);


-- ========================================================
-- 7. MESSAGES TABLE (Direct 1-on-1 Chat Stream)
-- ========================================================
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    sender_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ========================================================
-- 🚀 PERFORMANCE INDEXES
-- ========================================================

-- Profile Indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_uuid ON profiles(uuid);

-- Content Indexes
CREATE INDEX idx_content_user_id ON content(user_id);
CREATE INDEX idx_content_uuid ON content(uuid);
CREATE INDEX idx_content_tags ON content USING GIN(tags);
CREATE INDEX idx_content_created_at_desc ON content(created_at DESC); 
CREATE INDEX idx_content_user_created_at ON content (user_id, created_at DESC);

-- Session Index
CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- Interaction Indexes
CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_interactions_content_id ON interactions(content_id);
CREATE INDEX idx_interactions_lookup_composite ON interactions (user_id, content_id, interaction_type);

-- Comments Indexes
CREATE INDEX idx_comments_content_id ON comments(content_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);

-- Follows Indexes
CREATE INDEX idx_follows_follower_following ON follows(follower_id, following_id);
CREATE INDEX idx_follows_reverse_lookup ON follows (following_id, follower_id);

-- Messages Indexes (Optimized for bidirectional chat threads)
CREATE INDEX idx_messages_sender_recipient ON messages (sender_id, recipient_id);
CREATE INDEX idx_messages_chat_history ON messages (sender_id, recipient_id, created_at DESC);