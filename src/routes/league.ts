import express, { Request, Response } from "express";
import LeagueService from "../services/leagueService";

const router = express.Router();
const leagueService = new LeagueService();

router.post("/", async (req: Request, res: Response) => {
  let league = await leagueService.createLeague(req, res);
  res.send(league);
});
router.get("/:id/statistics", async (req: Request, res: Response) => {});
router.get("/:id/teams", async (req: Request, res: Response) => {});
router.get("/:id/matches/upcoming", async (req: Request, res: Response) => {});
router.get("/:id/matches/played", async (req: Request, res: Response) => {});
router.get("/:id/matches/all", async (req: Request, res: Response) => {});
router.get("/:id/teams", async (req: Request, res: Response) => {});
router.get("/", async (req: Request, res: Response) => {
  let leagues = await leagueService.getLeagues();
  res.send(leagues);
});
router.put("/:id", async (req: Request, res: Response) => {
  let changedLeague = await leagueService.updateLeague(req, res);
  res.send(changedLeague);
});
router.delete("/:id", async (req: Request, res: Response) => {
  await leagueService.deleteLeagueWithGivenID(req.params.id, res);
  res.send();
});

export default router;
