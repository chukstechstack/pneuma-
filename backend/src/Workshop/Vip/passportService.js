import pool from "@/Terminal/Supabase/supabaseConfig.js";
export const findUserByEmail = async (email) => {
    const result = await pool.query(`SELECT id, uuid, username, email, password FROM profiles WHERE email = $1`, [email]);
    return result.rows[0] || null;
};
export const findUserById = async (uuid) => {
    const result = await pool.query(`SELECT id, uuid, username, email FROM profiles WHERE uuid = $1`, [uuid]);
    return result.rows[0] || null;
};
export const findUserByGoogle_id = async (google_id) => {
    const result = await pool.query(`SELECT id, uuid, username FROM profiles WHERE google_id = $1`, [google_id]);
    return result.rows[0] || null;
};
export const findGoogleUserByEmail = async (email) => {
    const result = await pool.query(`SELECT uuid FROM profiles WHERE email = $1`, [email]);
    return result.rows[0] || null;
};
export const updateGoogleIdByEmail = async (google_Id, email) => {
    const result = await pool.query(`UPDATE profiles SET google_id = $1 WHERE email = $2 RETURNING *`, [google_Id, email]);
    return result.rows[0] || null;
};
export const insertGoogleUser = async ({ username, full_name, email, google_id, }) => {
    const newUser = await pool.query(`INSERT INTO profiles (
      username, 
      full_name, 
      email, 
      google_id
    ) VALUES ($1, $2, $3, $4) RETURNING uuid, id, username, email`, [username ?? null, full_name ?? null, email, google_id]);
    return newUser.rows[0] || null;
};
//# sourceMappingURL=passportService.js.map