import express, { Request, Response } from "express";
import LeagueService from "../services/leagueService";
import PlayerStatisticService from "../services/playerStatisticService";
import MatchService from "../services/matchService";
import ExpectedError from "../utils/expectedError";

const router = express.Router();
const leagueService = new LeagueService();
const playerStatisticsService = new PlayerStatisticService();
const matchesService = new MatchService();
//autoryzacja
router.post("/", async (req: Request, res: Response) => {
  try {
    let league = await leagueService.createLeague(req);
    res.send(league);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});
router.get("/:id/statistics", async (req: Request, res: Response) => {
  const statistics = await playerStatisticsService.getStatisticsForLeague(req.params.id);
  res.send(statistics);
});
router.get("/:id/teams", async (req: Request, res: Response) => {
  try {
    const teams = await leagueService.getTeamsFromGivenLeague(req.params.id);
    res.send(teams);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});
router.get("/:id/matches/upcoming", async (req: Request, res: Response) => {
  const matches = await matchesService.getUpcomingMatchesForLeague(req.params.id);
  res.send(matches);
});
router.get("/:id/matches/played", async (req: Request, res: Response) => {
  const matches = await matchesService.getPlayedMatchesForLeague(req.params.id);
  res.send(matches);
});
router.get("/:id/matches/all", async (req: Request, res: Response) => {});
router.get("/", async (req: Request, res: Response) => {
  let leagues = await leagueService.getLeagues();
  res.send(leagues);
});
//autoryzacja
router.put("/:id", async (req: Request, res: Response) => {
  try {
    let changedLeague = await leagueService.updateLeague(req);
    res.send(changedLeague);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});
//autoryzacja
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await leagueService.deleteLeagueWithGivenID(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

export default router;
