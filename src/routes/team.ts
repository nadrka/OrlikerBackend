import { Response } from "express-serve-static-core";
import express, { Request } from "express";
import TeamService from "../services/teamService";
import MatchService from "../services/matchService";
import PlayerService from "../services/playerService";
import PlayerStatisticService from "../services/playerStatisticService";
import moment from "moment";

const router = express.Router();
const teamService = new TeamService();
const matchService = new MatchService();
const playerService = new PlayerService();
const playerStatisticsService = new PlayerStatisticService();

router.post("/", async (req: Request, res: Response) => {
  teamService.createTeam(req, res);
});

router.get("/", async (req: Request, res: Response) => {
  const teams = await teamService.getAllTeams();
  res.send(teams);
});

router.get("/:id", async (req: Request, res: Response) => {
  const team = await teamService.getTeam(req.params.id);
  res.send(team);
});

router.get("/:id/players", async (req: Request, res: Response) => {
  const players = await playerService.getPlayersWithGivenTeam(req.params.id, res);
  res.send(players);
});

router.get("/:id/playersWithStats", async (req: Request, res: Response) => {
  const players = await playerService.getPlayersWithGivenTeam(req.params.id, res);
  var playersWithStats: Array<any> = [];
  for (var index = 0; index < players.length; index++) {
    let statistics = await playerStatisticsService.getStatisticsForPlayer(players[index].id);
    let age = moment().diff(moment(players[index].dateOfBirth), "years");
    playersWithStats.push({ ...statistics, ...players[index], age: age });
  }
  res.send(playersWithStats);
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

router.get("/:id/statistics", async (req: Request, res: Response) => {
  const statistics = await playerStatisticsService.getStatisticsForTeam(req.params.id);
  res.send(statistics);
});

router.put("/:id", async (req: Request, res: Response) => {
  await teamService.updateTeamFromRequest(req, res);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const team = await teamService.getTeamForGivenId(req.params.id);
  if (team.players.length <= 1) {
    await teamService.deleteTeamWithGivenID(req, res);
  } else {
    res.status(400).send("Deleting team with more than one player is forbiden!");
  }
});

export default router;
