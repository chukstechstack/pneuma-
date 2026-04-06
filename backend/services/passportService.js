import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    ` SELECT id, username, email, password from profiles WHERE email = $1`,
    [email],
  );
  return result.rows[0] || null;
};

export const findUserById = async (id) => {
  const result = await pool.query(
    ` SELECT id, username, email from profiles WHERE id = $1 `,
    [id],
  );
  return result.rows[0] || null;
};

export const findGoogleByEmail = async (email) => {
  const result = await pool.query(
    ` SELECT id, username, email from profiles WHERE email = $1`,
    [email],
  );
  return result.rows[0] || null;
};

export const insertGoogleUser = async ({
  username,
  first_name,
  last_name,
  email,
  google_id,
}) => {
  const newUser = await pool.query(
    `INSERT INTO profiles (
username, 
first_name, 
last_name,
email ,
google_id) values($1, $2, $3, $4, $5) RETURNING id, username, email`,
    [username, first_name, last_name, email, google_id],
  );
  return newUser.rows[0] || null;
};
