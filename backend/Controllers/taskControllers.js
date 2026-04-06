import pool from "../config/db.js";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import TaskInputError from "../utils/TaskInputError.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

// Multer middleware to handle file uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const createTask = [
  upload.single("img"), // parse file
  async (req, res, next) => {
    const { title, content, category, tags } = req.body; // <-- include tags here
    const user_id = req.user.id;
    let img_url = "https://source.unsplash.com/random/300x300?avatar";

    // Safely parse tags into an array
    let tagsArray = [];
    if (tags) {
      tagsArray = tags.split(",").map((tag) => tag.trim());
    }

    try {
      if (!title) throw new TaskInputError("Title is required");
      if (!content) throw new TaskInputError("Content is required");
      if (!category) throw new TaskInputError("Category is required");
      if (!tags) throw new TaskInputError("Tags is required");

      if (req.file) {
        // Upload image to Supabase Storage
        const { data, error } = await supabase.storage
          .from("task-images")
          .upload(
            `tasks/${Date.now()}-${req.file.originalname}`,
            req.file.buffer,
            {
              contentType: req.file.mimetype,
            },
          );

        if (error) throw error;

        // Get public URL
        const { data: publicData } = supabase.storage
          .from("task-images")
          .getPublicUrl(data.path);

        img_url = publicData.publicUrl;
      }

      // Insert into Postgres
      await pool.query(
        `INSERT INTO content(title, content, img, category, tags, user_id)
         VALUES($1, $2, $3, $4, $5, $6)`,
        [title, content, img_url, category, tagsArray, user_id],
      );

      res.json({ message: "Content created successfully", img_url });
    } catch (err) {
      next(err);
    }
  },
];

const getTask = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT * FROM content`);
    res.json({ tasks: result.rows });
  } catch (err) {
    next(err);
  }
};

const patchTask = (req, res) => {
  res.send("patch task created");
};

const deleteTask = (req, res) => {
  res.send("delete task created");
};

export { createTask, getTask, deleteTask, patchTask };
