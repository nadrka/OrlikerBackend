import express, { Request, Response } from "express";
import MatchService from "../services/matchService";
import PlayerStatisticService from "../services/playerStatisticService";

const router = express.Router();
const playerStatisticService = new PlayerStatisticService();
const matchService = new MatchService();
router.post("/", async (req: Request, res: Response) => {
  await matchService.createMatch(req, res);
});

router.get("/:id/statistics", async (req: Request, res: Response) => {
  const statistcs = await playerStatisticService.getStatisticsForMatch(
    req.params.id
  );
  res.send(statistcs);
});
router.get("/:id", async (req: Request, res: Response) => {
  const match = await matchService.getMatchForGivenID(req.params.id);
  res.send(match);
});
router.put("/:id", async (req: Request, res: Response) => {
  await matchService.updateMatchWithRequestBody(req, res);
});
router.put("/:id/result", async (req: Request, res: Response) => {
  await matchService.updateMatchResult(req, res);
});
router.delete("/:id", async (req: Request, res: Response) => {
  await matchService.deleteMatch(req, res);
});

export default router;
