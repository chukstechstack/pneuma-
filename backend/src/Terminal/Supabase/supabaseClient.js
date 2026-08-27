import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
// Use your service role key (or secret key) here for backend admin privileges
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables on the backend.");
}
export const supabase = createClient(supabaseUrl, supabaseKey);
//# sourceMappingURL=supabaseClient.js.map