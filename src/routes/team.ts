import { Response } from "express-serve-static-core";
import express, { Request } from "express";
import TeamService from "../services/teamService";
import MatchService from "../services/matchService";
import PlayerService from "../services/playerService";
import PlayerStatisticService from "../services/playerStatisticService";
import moment from "moment";
import ExpectedError from "../utils/expectedError";
import auth from "../middlewares/auth";
import InvitationService from "../services/invitationService";

const router = express.Router();
const teamService = new TeamService();
const matchService = new MatchService();
const playerService = new PlayerService();
const playerStatisticsService = new PlayerStatisticService();
const invitationService = new InvitationService();
import multer from "multer";
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 8
  },
  fileFilter: function(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const team = await teamService.createTeam(req);
    res.send(team);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
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
  const players = await playerService.getPlayersWithGivenTeam(req.params.id);
  res.send(players);
});

router.get("/:id/playersWithStats", async (req: Request, res: Response) => {
  const players = await playerService.getPlayersWithGivenTeam(req.params.id);
  var playersWithStats: Array<any> = [];
  for (var index = 0; index < players.length; index++) {
    let statistics = await playerStatisticsService.getStatisticsForPlayer(players[index].id);
    let age = moment().diff(moment(players[index].dateOfBirth), "years");
    playersWithStats.push({ ...statistics, ...players[index], age: age });
  }
  res.send(playersWithStats);
});

router.get("/:id/invitations", async (req: Request, res: Response) => {
  const invitations = await invitationService.getInvitationForTeam(req);
  res.send(invitations);
});

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

//autoryzacja
//done
router.put("/", auth, async (req: Request, res: Response) => {
  try {
    const team = await teamService.updateTeamFromRequest(req, res.locals.senderId);
    res.send(team);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

router.put("/image", upload.single("teamImage"), async (req: Request, res: Response) => {
  const team = await teamService.updateTeamImage(req.file.path, 1);
  res.send(team);
});

//autoryzacja
//done
router.delete("/", auth, async (req: Request, res: Response) => {
  try {
    await teamService.deleteTeamWithGivenID(res.locals.senderId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

export default router;
