import { fetchSingleTaskById } from "../../../Workshop/Payload/Mutations/getSingleTaskService";
export const getSingleTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await fetchSingleTaskById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Post not found." });
        }
        return res.json({ success: true, task });
    }
    catch (err) {
        console.error("Failed to fetch single task:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
//# sourceMappingURL=getSingleTask.js.map