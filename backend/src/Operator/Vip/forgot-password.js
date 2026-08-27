import { supabase } from "../../Terminal/Supabase/supabaseClient";
// Define your allowed frontend URLs
const ALLOWED_ORIGINS = [
    "https://pneuma-frontend-oijl.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3001"
];
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email address is required." });
        }
        // Grab the origin from the request header (sent automatically by Axios)
        const requestOrigin = req.get("origin");
        // Pick the matching origin, or fallback to your production/local default
        const baseOrigin = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)
            ? requestOrigin
            : (process.env.FRONTEND_URL || "https://pneuma-frontend-oijl.onrender.com");
        // Tell Supabase where to redirect the user after clicking the email link
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${baseOrigin}/updatepassword`,
        });
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(200).json({
            success: true,
            message: "If an account exists with that email, a reset link has been sent."
        });
    }
    catch (err) {
        console.error("Forgot password error:", err);
        return res.status(500).json({ message: "Internal server error. Please try again later." });
    }
};
//# sourceMappingURL=forgot-password.js.map