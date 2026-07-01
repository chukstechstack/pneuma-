import redisClient from "../../config/redisCreateClient.js";
import { executeToggleInteraction } from "../../services/task/interactionService.js";

export const toggleInteraction = async (req, res, next) => {
  const user_numeric_id = req.user?.id;
  const user_uuid = req.user?.uuid;
  const { contentUuid } = req.params;
  const { type } = req.body;

  // 1. Strict input validation whitelist guard clause remains in controller layer
  if (!['like', 'repost', 'share'].includes(type)) {
    return res.status(400).json({ error: "Invalid interaction type" });
  }

  try {
    // 2. Offload all transaction calculations directly to your new service layer
    const result = await executeToggleInteraction(user_numeric_id, contentUuid, type);

    // Guard clause in case the target post UUID doesn't exist in Postgres
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    // ==========================================
    // 🧹 DYNAMIC PAGINATED REDIS BROOM SYSTEM
    // ==========================================
    if (user_uuid) {
      // A. Sweep out all timeline pages for the main public home feed
      const homeFeedPattern = `tasks_feed:${user_uuid}:*`;
      const homeKeys = await redisClient.keys(homeFeedPattern);
      if (homeKeys.length > 0) {
        await redisClient.del(homeKeys);
        console.log(`🧹 Redis Swept: Cleaned out ${homeKeys.length} paginated home feed drawers.`);
      }

      // B. Sweep out all private journal pages ONLY if a repost action adds or removes an item
      if (type === "repost") {
        const journalPattern = `journal_feed:${user_uuid}:*`;
        const journalKeys = await redisClient.keys(journalPattern);
        if (journalKeys.length > 0) {
          await redisClient.del(journalKeys);
          console.log(`🧹 Redis Swept: Cleaned out ${journalKeys.length} private sanctuary journal pages.`);
        }
      }
    }

    console.log(`💾 [SERVICE SYNC COMPLETE]: User (ID: ${user_numeric_id}) performed "${type}". Action: ${result.action}`);

    return res.json({
      message: "Interaction updated successfully",
      action: result.action,
      updatedPost: result.updatedPost
    });

  } catch (err) {
    console.error("❌ BACKEND CONTROLLER LAYER caught an interaction crash:", err.message);
    next(err);
  }
};
