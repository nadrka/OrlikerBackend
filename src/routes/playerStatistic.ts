import express, { Request, Response } from "express";
import PlayerStatisticService from "../services/playerStatisticService";

const router = express.Router();
const playerStatisticService = new PlayerStatisticService();
router.post("/", async (req: Request, res: Response) => {
  let playerStatistic = await playerStatisticService.createStatistic(req, res);
  return playerStatistic;
});
router.put("/:id", async (req: Request, res: Response) => {
  await playerStatisticService.updateStatistic(req, res);
});
router.delete("/:id", async (req: Request, res: Response) => {
  await playerStatisticService.deleteStatistic(req, res);
});

export default router;
