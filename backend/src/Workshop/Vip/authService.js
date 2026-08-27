import pool from "@/Terminal/Supabase/supabaseConfig.js";
export const findUserRegistration = async (email) => {
    const checkUser = await pool.query(`SELECT * FROM profiles WHERE email = $1`, [email]);
    return checkUser.rows[0] || null;
};
export const registerNewUser = async ({ password, full_name, email, google_id, avatar_url, }) => {
    const result = await pool.query(`INSERT INTO profiles (  
      password,
      full_name,
      email,
      google_id, 
      avatar_url
    ) VALUES ($1, $2, $3, $4, $5) RETURNING id, uuid`, [password ?? null, full_name ?? null, email, google_id ?? null, avatar_url ?? null]);
    return result.rows[0] || null;
};
//# sourceMappingURL=authService.js.map