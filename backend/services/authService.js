import pool from "../config/db.js";




export const findUserRegistration = async (email) => {
  const checkUser = await pool.query(
    `select * from profiles where email = $1`,
    [email],
  );
  return checkUser.rows[0] || null;
};

export const registerNewUser = async ({
  username,
  password,
  first_name,
  last_name,
  country,
  email,
  google_id,
  avatar_url,
}) => {
  const result = await pool.query(
    `insert into profiles(  
  username,
  password,
  first_name,
  last_name,
  country,
  email,
  google_id, 
  avatar_url
  ) values($1, $2, $3, $4, $5, $6, $7,$8) RETURNING id`,
    [
      username,
      password,
      first_name,
      last_name,
      country,
      email,
      google_id,
      avatar_url,
    ],
  );

  return result.rows[0] || null
};
