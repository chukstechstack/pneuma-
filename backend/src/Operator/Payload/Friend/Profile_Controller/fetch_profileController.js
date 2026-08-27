import { fetchSmartProfileFeedData } from "@Workshop/Payload/Friend/fetchProfileFeedServices.js";
export const getSmartProfileFeed = async (req, res, next) => {
    const loggedInUserProfileId = req.user?.id;
    const { targetProfileUuid } = req.params;
    if (!loggedInUserProfileId) {
        return res.status(401).json({ error: "Authentication required" });
    }
    try {
        const responseData = await fetchSmartProfileFeedData(loggedInUserProfileId, targetProfileUuid);
        return res.json(responseData);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage === "PROFILE_NOT_FOUND") {
            return res.status(404).json({ error: "Sanctuary profile not found" });
        }
        console.error("❌ Error inside getSmartProfileFeed:", errorMessage);
        next(err);
    }
};
//# sourceMappingURL=fetch_profileController.js.map