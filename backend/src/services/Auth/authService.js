import pool from "../../config/supabaseConfig.js";

export const findUserRegistration = async (email) => {
  const checkUser = await pool.query(
    `select * from profiles where email = $1`,
    [email],
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
}) => {
  const result = await pool.query(
    `insert into profiles(  
  password,
  first_name,
  last_name,
  email,
  google_id, 
  avatar_url
  ) values($1, $2, $3, $4, $5, $6) RETURNING id, uuid`,
    [password, first_name, last_name, email, google_id, avatar_url],
  );

  return result.rows[0] || null;
};
