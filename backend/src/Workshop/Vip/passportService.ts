import pool from "@/Terminal/Supabase/supabaseConfig.js";

export interface UserProfile {
  id: number | string;
  uuid: string;
  username?: string | null;
  email?: string | null;
  password?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  google_id?: string | null;
  avatar_url?: string | null;
  created_at?: string | Date;
}

interface MinimalUserUuid {
  uuid: string;
}

interface MinimalUserBasic {
  id: number | string;
  uuid: string;
  username?: string | null;
}

interface InsertGoogleUserParams {
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  google_id: string;
}

interface InsertGoogleUserResult {
  uuid: string;
  id: number | string;
  username: string | null;
  email: string | null;
}

export const findUserByEmail = async (email: string): Promise<UserProfile | null> => {
  const result = await pool.query<UserProfile>(
    `SELECT id, uuid, username, email, password FROM profiles WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
};

export const findUserById = async (uuid: string): Promise<UserProfile | null> => {
  const result = await pool.query<UserProfile>(
    `SELECT id, uuid, username, email FROM profiles WHERE uuid = $1`,
    [uuid]
  );
  return result.rows[0] || null;
};

export const findUserByGoogle_id = async (google_id: string): Promise<MinimalUserBasic | null> => {
  const result = await pool.query<MinimalUserBasic>(
    `SELECT id, uuid, username FROM profiles WHERE google_id = $1`,
    [google_id]
  );
  return result.rows[0] || null;
};

export const findGoogleUserByEmail = async (email: string): Promise<MinimalUserUuid | null> => {
  const result = await pool.query<MinimalUserUuid>(
    `SELECT uuid FROM profiles WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
};

export const updateGoogleIdByEmail = async (google_Id: string, email: string): Promise<UserProfile | null> => {
  const result = await pool.query<UserProfile>(
    `UPDATE profiles SET google_id = $1 WHERE email = $2 RETURNING *`, 
    [google_Id, email]
  );
  return result.rows[0] || null;
};

export const insertGoogleUser = async ({
  username,
  first_name,
  last_name,
  email,
  google_id,
}: InsertGoogleUserParams): Promise<InsertGoogleUserResult | null> => {
  const newUser = await pool.query<InsertGoogleUserResult>(
    `INSERT INTO profiles (
      username, 
      first_name, 
      last_name,
      email, 
      google_id
    ) VALUES ($1, $2, $3, $4, $5) RETURNING uuid, id, username, email`,
    [username ?? null, first_name ?? null, last_name ?? null, email, google_id]
  );
  return newUser.rows[0] || null;
};