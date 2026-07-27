import pool from "@/Terminal/Supabase/supabaseConfig.js";

interface UserProfile {
  id: number | string;
  uuid: string;
  email: string;
  password?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  google_id?: string | null;
  avatar_url?: string | null;
  created_at?: string | Date;
}

interface RegisterUserParams {
  password?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  google_id?: string | null;
  avatar_url?: string | null;
}

interface RegisteredUserResult {
  id: number | string;
  uuid: string;
}

export const findUserRegistration = async (email: string): Promise<UserProfile | null> => {
  const checkUser = await pool.query<UserProfile>(
    `SELECT * FROM profiles WHERE email = $1`,
    [email]
  );
  return checkUser.rows[0] || null;
};

export const registerNewUser = async ({
  password,
  first_name,
  last_name,
  email,
  google_id,
  avatar_url,
}: RegisterUserParams): Promise<RegisteredUserResult | null> => {
  const result = await pool.query<RegisteredUserResult>(
    `INSERT INTO profiles (  
      password,
      first_name,
      last_name,
      email,
      google_id, 
      avatar_url
    ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, uuid`,
    [password ?? null, first_name ?? null, last_name ?? null, email, google_id ?? null, avatar_url ?? null]
  );

  return result.rows[0] || null;
};