import { Response } from "express-serve-static-core";
import express, { Request } from "express";
import TeamService from "../services/teamService";
import MatchService from "../services/matchService";
import PlayerService from "../services/playerService";

const router = express.Router();
const teamService = new TeamService();
const matchService = new MatchService();
const playerService = new PlayerService();

router.post("/", async (req: Request, res: Response) => {
  console.log(req.body);
  teamService.createTeam(req, res);
});

router.post(
  "/:id/invitations/accept",
  async (req: Request, res: Response) => {}
);

router.post(
  "/:id/invitations/reject",
  async (req: Request, res: Response) => {}
);

router.get("/", async (req: Request, res: Response) => {
  const teams = await teamService.getAllTeams();
  res.send(teams);
});

router.get("/:id", async (req: Request, res: Response) => {
  await teamService.getTeam(req.params.id, res);
});

router.get("/:id/players", async (req: Request, res: Response) => {
  await playerService.getPlayersWithGivenTeam(req.params.id, res);
});

router.get("/:id/invitations", async (req: Request, res: Response) => {});

router.get("/:id/matches/upcoming", async (req: Request, res: Response) => {
  const matches = await matchService.getUpcomingMatchesForTeam(req.params.id);
  res.send(matches);
});

router.get("/:id/matches/played", async (req: Request, res: Response) => {
  const matches = await matchService.getPlayedMatchesForTeam(req.params.id);
  res.send(matches);
});

router.get("/:id/statistics", async (req: Request, res: Response) => {});

router.put("/:id", async (req: Request, res: Response) => {
  await teamService.updateTeamFromRequest(req, res);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await teamService.deleteTeamWithGivenID(req, res);
});

export default router;
