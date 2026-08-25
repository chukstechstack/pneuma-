// src/controllers/getAlertsController.ts
import type { Request, Response } from "express";
import { fetchUserAlerts, markAlertAsRead } from "../../../../Workshop/Payload/Friend/alertsService";

export const getAlerts = async (req: Request, res: Response) => {
    try {
// In getAlerts and markRead:
const userId = (req.user as any)?.uuid || (req.user as any)?.id || (req.user as any)?.user_uuid;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const alerts = await fetchUserAlerts(userId);
        return res.json({ success: true, alerts });
    } catch (err) {
        console.error("Failed to fetch alerts:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const markRead = async (req: Request, res: Response) => {
    try {
     // In getAlerts and markRead:
const userId = (req.user as any)?.uuid || (req.user as any)?.id || (req.user as any)?.user_uuid;
        // req.params fields can be string | string[]; normalize to a single string
        let alertIdParam = req.params.alertId as string | string[] | undefined;
        if (Array.isArray(alertIdParam)) alertIdParam = alertIdParam[0];
        const alertId = alertIdParam;
        if (!alertId) return res.status(400).json({ error: "Missing alertId" });
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        await markAlertAsRead(alertId, userId);
        return res.json({ success: true });
    } catch (err) {
        console.error("Failed to mark alert read:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};