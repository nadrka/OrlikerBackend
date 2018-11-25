import express, { Response, Request } from "express";
import PlayerService from "../services/playerService";
import InvitationService from "../services/invitationService";
import PlayerStatisticService from "../services/playerStatisticService";

const router = express.Router();
const playerService = new PlayerService();

router.post("/", async (req: Request, res: Response) => {
  const player = await playerService.createPlayer(req, res);
  res.send(player);
});

router.get("/", async (req: Request, res: Response) => {
  const players = await playerService.getAllPlayers(req, res);
  res.send(players);
});

router.get("/:id", async (req: Request, res: Response) => {
  let player = await playerService.getPlayerWithGivenID(req.params.id);
  res.send(player);
});

router.put("/:id", async (req: Request, res: Response) => {
  let player = await playerService.updatePlayer(req, res);
  res.send(player);
});

router.delete("/:id", async (req: Request, res: Response) => {
  playerService.deletePlayerWithGivenID(req.params.id, res);
});

router.get("/:id/invitations", async (req: Request, res: Response) => {
  const invitationService = new InvitationService();
  const invitations = invitationService.getInvitationsForPlayer(
    req.params.id,
    res
  );
  res.send(invitations);
});

router.get("/:id/statistics", async (req: Request, res: Response) => {
  const statisticsService = new PlayerStatisticService();
  const statistics = await statisticsService.getStatisticsForPlayer(
    req.params.id
  );
  res.send(statistics);
});

export default router;
