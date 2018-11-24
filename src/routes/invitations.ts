import { Response } from "express";
import { Request } from "express";
import express from "express";
import InvitationService from "../services/invitationService";

const router = express.Router();
const invitationService = new InvitationService();
router.post("/", async (req: Request, res: Response) => {
  invitationService.createInvitation(req, res);
});

export default router;
