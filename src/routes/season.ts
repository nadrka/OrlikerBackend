import express, { Request, Response } from "express";
import SeasonService from "../services/seasonService";

const router = express.Router();
const seasonService = new SeasonService();

router.get("/currentSeason", async (req: Request, res: Response) => {
  const season = await seasonService.getCurrentSeason();
  res.send(season);
});

export default router;
