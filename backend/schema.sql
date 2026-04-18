
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
// // src/api/axios.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3000",
//   withCredentials: true,
// });

// export default api;
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

CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
)