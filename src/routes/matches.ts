import express, { Request, Response } from "express";
import MatchService from "../services/matchService";
import PlayerStatisticService from "../services/playerStatisticService";
import ExpectedError from "../utils/expectedError";
import auth from "../middlewares/auth";
import PlayerService from "../services/playerService";

const router = express.Router();
const playerStatisticService = new PlayerStatisticService();
const playerService = new PlayerService();
const matchService = new MatchService();
//autoryzacja
router.post("/", async (req: Request, res: Response) => {
  try {
    const match = await matchService.createMatch(req);
    // const match = await matchService.createMatch(req, res.locals.senderId);
    res.send(match);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

router.get("/sentInvites", auth, async (req: Request, res: Response) => {
  try {
    const matches = await matchService.getSentMatchInvites(res.locals.senderId);
    res.send(matches);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

router.get("/receivedInvites", auth, async (req: Request, res: Response) => {
  try {
    const matches = await matchService.getReceivedMatchInvites(res.locals.senderId);
    res.send(matches);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

router.post("/acceptInvite", auth, async (req: Request, res: Response) => {
  try {
    const matches = await matchService.acceptMatchInvite(res.locals.senderId, req.body.matchId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});
router.post("/cancelInvite", auth, async (req: Request, res: Response) => {
  try {
    const matches = await matchService.cancelMatchInvite(res.locals.senderId, req.body.matchId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

router.get("/:id/statistics", async (req: Request, res: Response) => {
  const statistcs = await playerStatisticService.getStatisticsForMatch(req.params.id);
  res.send(statistcs);
});
router.get("/:id", async (req: Request, res: Response) => {
  const match = await matchService.getMatchForGivenID(req.params.id);
  res.send(match);
});

router.get("/:id/players", async (req: Request, res: Response) => {
  const players = await playerService.getAllPlayersForMatch(req.params.id);
  res.send(players);
});

//autoryzacja
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const match = await matchService.updateMatchWithRequestBody(req);
    res.send(match);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});
//autoryzacja
router.put("/:id/result", async (req: Request, res: Response) => {
  try {
    const match = await matchService.updateMatchResult(req);
    res.send(match);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});
//autoryzacja
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await matchService.deleteMatch(req);
    res.status(204).send();
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

export default router;
