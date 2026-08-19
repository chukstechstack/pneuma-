-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS
CREATE TYPE interaction_type_enum AS ENUM ('like', 'repost', 'share');


-- 1. PROFILES TABLE
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


-- 2. CONTENT TABLE
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


-- 3. SESSION TABLE
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL COLLATE "default",
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL
) WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;


-- 4. INTERACTIONS TABLE
CREATE TABLE interactions (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    user_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    content_id INT REFERENCES content(id) ON DELETE CASCADE,
    interaction_type interaction_type_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Safety constraint to prevent duplication of identical actions
    UNIQUE(user_id, content_id, interaction_type)
);


-- 5. FOLLOWS TABLE
CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id INT REFERENCES profiles(id) ON DELETE CASCADE,  
    following_id INT REFERENCES profiles(id) ON DELETE CASCADE, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Safety constraint to prevent repetitive follow pairings
    UNIQUE(follower_id, following_id)
);



-- ========================================================
-- 🛡️ BULLETPROOF BLUEPRINT INDEXES (SAFE FOR RE-RUNS)
-- ========================================================

-- PROFILE INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_uuid ON profiles(uuid);

-- CONTENT INDEXES
CREATE INDEX IF NOT EXISTS idx_content_user_id ON content(user_id);
CREATE INDEX IF NOT EXISTS idx_content_uuid ON content(uuid);
CREATE INDEX IF NOT EXISTS idx_content_tags ON content USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_created_at_desc ON content(created_at DESC); 

-- ADVANCED TIMELINE COMPOSITE PAGINATION (Pre-sorts your scroll feeds)
CREATE INDEX IF NOT EXISTS idx_content_user_created_at ON content (user_id, created_at DESC);

-- SESSION INDEXES
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- INTERACTION INDEXES
CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_content_id ON interactions(content_id);

-- ADVANCED HIGH-SPEED SWITCH LOGS (Speeds up your Support/Forward clicks)
CREATE INDEX IF NOT EXISTS idx_interactions_lookup_composite ON interactions (user_id, content_id, interaction_type);

-- FOLLOWS INDEXES
CREATE INDEX IF NOT EXISTS idx_follows_follower_following ON follows(follower_id, following_id);
CREATE INDEX IF NOT EXISTS idx_follows_reverse_lookup ON follows (following_id, follower_id);


CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE conversation_participants (
    id SERIAL PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    -- 🎯 NOTE: Change 'profiles(id)' if your profile table uses a different name or UUID type
    user_id INT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Safety constraint: Prevents accidentally adding the exact same user to the same room twice
    UNIQUE (conversation_id, user_id)
);


CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    -- 🎯 NOTE: Change 'profiles(id)' if your profile table uses a different column name or UUID type
    sender_id INT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


ALTER TABLE follows 
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_uuid UUID NOT NULL,
  recipient_uuid UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);




CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_uuid UUID NOT NULL,
  recipient_uuid UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Add an index for lightning-fast conversation lookups between two users
CREATE INDEX IF NOT EXISTS idx_messages_participants 
ON messages (sender_uuid, recipient_uuid);