import { Response } from "express";
import { Request } from "express";
import express from "express";
import InvitationService from "../services/invitationService";
import ExpectedError from "../utils/expectedError";

const router = express.Router();
const invitationService = new InvitationService();
//autoryzacja
router.post("/", async (req: Request, res: Response) => {
  try {
    const invitation = await invitationService.createInvitation(req);
    res.send(invitation);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

export default router;
