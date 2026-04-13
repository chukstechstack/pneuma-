import pool from "../../config/db.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    ` SELECT id, uuid, username, email, password from profiles WHERE email = $1`,
    [email],
  );
  return result.rows[0] || null;
};

export const findUserById = async (uuid) => {
  const result = await pool.query(
    ` SELECT id, uuid, username, email from profiles WHERE uuid = $1 `,
    [uuid],
  );
  return result.rows[0] || null;
};

export const findUserByGoogle_id = async (google_id) => {
  const result = await pool.query(
    ` SELECT uuid from profiles WHERE google_id = $1`,
    [google_id],
  );
  return result.rows[0] || null;
};

 export const findGoogleUserByEmail = async (email) => {
  const result = await pool.query(
    ` SELECT uuid from profiles WHERE email = $1`,
    [email],
  );
  return result.rows[0] || null;
};

 export const updateGoogleIdByEmail =  async (google_Id, email) => {
  const result =  await pool.query(
    `update profiles set google_id =$1 WHERE email = $2 RETURNING *`, [google_Id, email]
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
google_id) values($1, $2, $3, $4, $5) RETURNING uuid, id, username, email`,
    [username, first_name, last_name, email, google_id],
  );
  return newUser.rows[0] || null;
};

