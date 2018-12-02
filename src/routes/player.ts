import express, { Response, Request } from "express";
import PlayerService from "../services/playerService";
import InvitationService from "../services/invitationService";
import PlayerStatisticService from "../services/playerStatisticService";
import auth from "../middlewares/auth";
import ExpectedError from "../utils/expectedError";

const router = express.Router();
const playerService = new PlayerService();

router.post("/", async (req: Request, res: Response) => {
  const player = await playerService.createPlayer(req);
  res.send(player);
});

router.get("/", async (req: Request, res: Response) => {
  const players = await playerService.getAllPlayers(req);
  res.send(players);
});

router.get("/:id", async (req: Request, res: Response) => {
  let player = await playerService.getPlayerWithGivenID(req.params.id);
  res.send(player);
});

//autoryzacja
//done
router.put("/", auth, async (req: Request, res: Response) => {
  let player = await playerService.updatePlayer(req, res.locals.senderId);
  res.send(player);
});

//autoryzacja
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await playerService.deletePlayerWithGivenID(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

//autoryzacja
router.get("/:id/invitations", async (req: Request, res: Response) => {
  try {
    const invitationService = new InvitationService();
    const invitations = invitationService.getInvitationsForPlayer(req.params.id);
    res.send(invitations);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

router.get("/:id/statistics", async (req: Request, res: Response) => {
  const statisticsService = new PlayerStatisticService();
  const statistics = await statisticsService.getStatisticsForPlayer(req.params.id);
  res.send(statistics);
});

export default router;
