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
      const result = await pool.query(
        `INSERT INTO content(title, content, img, category, tags, user_id )
         VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [title, content, img_url, category, tagsArray, user_id],
      );

      res.json({
        message: "Content created successfully",
        newTask: result.rows[0],
      });
    } catch (err) {
      next(err);
    }
  },
];

const getTask = async (req, res, next) => {
  const user_id = req.user?.id; // Get current user ID from auth middleware
  try {
    const result = await pool.query(
      `SELECT c.*, 
       (SELECT COUNT(*) FROM likes WHERE post_id = c.id) AS like_count,
       EXISTS (SELECT 1 FROM likes WHERE post_id = c.id AND user_id = $1) AS is_liked
       FROM content c 
       ORDER BY c.created_at DESC`,
      [user_id],
    );
    res.json({ tasks: result.rows, currentUserId: user_id });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  const { uuid } = req.params;
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      `delete from content where uuid = $1 AND user_id = $2`,
      [uuid, user_id],
    );
    if (result.rowCount === 0) {
      return res.status * (403).json({ error: "You are unauthorized" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

const getEditPage = async (req, res, next) => {
  const uuid = req.params.uuid;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `select * from content where uuid = $1 AND user_id = $2`,
      [uuid, userId],
    );

    if (result.rows.length === 0) throw new TaskInputError("Post not found");

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const patchTask = [
  upload.single("img"),
  async (req, res, next) => {
    const { uuid } = req.params;
    const user_id = req.user.id;

    try {
      const updates = [];
      const values = [];

      if (req.body.title) {
        updates.push(`title = $${updates.length + 1}`);
        values.push(req.body.title);
      }

      if (req.body.content) {
        updates.push(`content = $${updates.length + 1}`);
        values.push(req.body.content);
      }

      if (req.body.category) {
        updates.push(`category = $${updates.length + 1}`);
        values.push(req.body.category);
      }

      if (req.body.tags) {
        const tagsArray = req.body.tags.split(",").map((t) => t.trim());
        updates.push(`tags = $${updates.length + 1}`);
        values.push(tagsArray);
      }

      if (req.file) {
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

        const { data: publicData } = supabase.storage
          .from("task-images")
          .getPublicUrl(data.path);
        updates.push(`img = $${updates.length + 1}`);
        values.push(publicData.publicUrl);
      }

      if (updates.length === 0) throw new TaskInputError("Post not found");

      values.push(uuid, user_id);
      const query = `
      UPDATE CONTENT SET ${updates.join(", ")}
      WHERE uuid = $${values.length - 1} AND user_id = $${values.length}
      RETURNING *;
      `;

      const result = await pool.query(query, values);
      if (result.rowCount === 0) throw new TaskInputError("Post not found");
      res.json({
        message: "updated successfully",
        updatedTask: result.rows[0],
      });
    } catch (err) {
      next(err);
    }
  },
];

const toggleLike = async (req, res, next) => {
  const { uuid } = req.params;
  const user_id = req.user.id;
  try {
    const postResult = await pool.query(
      "SELECT id FROM content WHERE uuid =$1",
      [uuid],
    );

    if (postResult.rowCount === 0) throw new TaskInputError("Post not found");
    const post_id = postResult.rows[0].id;

    const checkLike = await pool.query(
      `SELECT * FROM likes WHERE post_id = $1 AND user_id = $2`,
      [post_id, user_id],
    );
    if (checkLike.rowCount > 0) {
      await pool.query(
        `DELETE FROM likes WHERE post_id = $1 AND user_id = $2`,
        [post_id, user_id],
      );
      res.json({ liked: false });
    } else {
      await pool.query("INSERT INTO likes (post_id, user_id) VALUES($1, $2)", [
        post_id,
        user_id,
      ]);
      res.json({ liked: true });
    }
  } catch (err) {
    next(err);
  }
};
export { createTask, getTask, deleteTask, patchTask, getEditPage, toggleLike };
