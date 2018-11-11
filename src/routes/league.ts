import express, { Request, Response } from "express";
import LeagueService from "../services/leagueService";

const router = express.Router();
const leagueService = new LeagueService();

router.post("/", async (req: Request, res: Response) => {
  const league = await leagueService.createLeague(req, res);
  res.send(league);
});
router.get("/:id/statistics", async (req: Request, res: Response) => {});
router.get("/:id", async (req: Request, res: Response) => {});
router.get("/", async (req: Request, res: Response) => {
  const leagues = await leagueService.getLeagues();
  res.send(leagues);
});
router.put("/:id", async (req: Request, res: Response) => {
  await leagueService.updateLeague(req, res);
});
router.delete("/:id", async (req: Request, res: Response) => {
  await leagueService.deleteLeagueWithGivenID(req, res, req.params.id);
  res.send();
});

export default router;
