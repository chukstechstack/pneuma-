import express from "express";
import bcryptjs from "bcryptjs"
import pool from "../config/db.js"


const saltRound = 10;
const authRouter = express.Router();
authRouter.post("/", async (req, res) => {
  
  let  {
    username,
    password,
    first_name,
    last_name,
    country,
    email,
    google_id,
    avatar_url,
  } = req.body;

  username = username?.trim();
  password = password?.trim();
  first_name = first_name?.trim();
  last_name = last_name?.trim();
  country = country?.trim();
  email = email?.trim();
  google_id = google_id?.trim();
  avatar_url = avatar_url?.trim();
  
  try {
    const checkUser = await pool.query(
      `select * from profiles where email = $1`,
      [email],
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ msg: "user already exisit" });
    }
    const hash = await bcryptjs.hash(password, saltRound);
    const queryText = `insert into profiles(  
username,
password,
first_name,
last_name,
country,
email,
google_id, 
avatar_url
) values($1, $2, $3, $4, $5, $6, $7,$8) RETURNING username, email, first_name, last_name,country`;

    const values = [
      username,
      hash,
      first_name,
      last_name,
      country,
      email,
      google_id,
      avatar_url,
    ];
console.log(req.body)
    const response = await pool.query(queryText, values);
    const newUser = response.rows[0];    // const {password: _, ...userWithoutPassword } = newuser;
    // res.status(201).json(userWithoutPassword)
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message });
  }
});

export default authRouter

