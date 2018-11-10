import express, { Response, Request } from "express";
import PlayerService from "../services/playerService";

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
  const player = await playerService.getPlayerWithGivenID(
    req,
    res,
    req.params.id
  );
  res.send(player);
});

router.put("/:id", async (req: Request, res: Response) => {
  await playerService.updatePlayer(req, res);
});

router.delete("/:id", async (req: Request, res: Response) => {
  playerService.deletePlayerWithGivenID(req, res, req.params.id);
});

export default router;
