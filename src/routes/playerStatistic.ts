import express, { Request, Response } from "express";
import PlayerStatisticService from "../services/playerStatisticService";
import ExpectedError from "../utils/expectedError";

const router = express.Router();
const playerStatisticService = new PlayerStatisticService();
//autoryzacja
router.post("/", async (req: Request, res: Response) => {
  try {
    const playerStatistic = await playerStatisticService.createStatistic(req);
    return playerStatistic;
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});
//autoryzacja
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const playerStatistic = await playerStatisticService.updateStatistic(req);
    res.send(playerStatistic);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});
//autoryzacja
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await playerStatisticService.deleteStatistic(req);
    res.status(204).send();
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

export default router;
