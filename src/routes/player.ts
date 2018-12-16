import moment from "moment";
import express, { Response, Request } from "express";
import PlayerService from "../services/playerService";
import InvitationService from "../services/invitationService";
import PlayerStatisticService from "../services/playerStatisticService";
import auth from "../middlewares/auth";
import ExpectedError from "../utils/expectedError";
const router = express.Router();
const playerService = new PlayerService();

import multer from "multer";
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, moment().format("DD.MM.YYYY.HH.mm.ss") + file.originalname);
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
  const player = await playerService.createPlayer(req);
  res.send(player);
});

router.get("/", async (req: Request, res: Response) => {
  const players = await playerService.getAllPlayers(req);
  res.send(players);
});

router.get("/without/team", async (req: Request, res: Response) => {
  const players = await playerService.getAllPlayersWithoutTeam();
  res.send(players);
});

router.get("/:id", async (req: Request, res: Response) => {
  let player = await playerService.getPlayerWithGivenID(req.params.id);
  res.send(player);
});

//autoryzacja
//done
router.put("/", auth, async (req: Request, res: Response) => {
  try {
    let player = await playerService.updatePlayer(req, res.locals.senderId);
    res.send(player);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

router.put("/image", auth, upload.single("userImage"), async (req: Request, res: Response) => {
  const player = await playerService.updatePlayerImage(req.file.path, res.locals.senderId);
  res.send(player);
});

//autoryzacja
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await playerService.deletePlayerWithGivenID(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

//autoryzacja
router.get("/:id/invitations", async (req: Request, res: Response) => {
  try {
    const invitationService = new InvitationService();
    const invitations = await invitationService.getInvitationsForPlayer(req.params.id);
    res.send(invitations);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

router.get("/:id/statistics", async (req: Request, res: Response) => {
  const statisticsService = new PlayerStatisticService();
  const statistics = await statisticsService.getStatisticsForPlayer(req.params.id);
  res.send(statistics);
});

router.get("/:id/team/requests", async (req: Request, res: Response) => {
  const invitationService = new InvitationService();
  const teamsWithStatus = await invitationService.getAllRequestsWithStatusForPlayer(req.params.id);
  console.log(teamsWithStatus);
  res.send(teamsWithStatus);
});

export default router;
