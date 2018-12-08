import { getConnection } from "typeorm";
import express, { Request, Response } from "express";
import { User } from "../models/user";
import UserService from "../services/userService";
import ExpectedError from "../utils/expectedError";
import MatchService from "../services/matchService";
const router = express.Router();
const userService = new UserService();
const matchService = new MatchService();

router.get("/", async (req: Request, res: Response) => {
  const users = await userService.getAllReferees();
  res.send(users);
});

router.get("/:id/playedMatches", async (req: Request, res: Response) => {
  const matches = await matchService.getPlayedMatchesForReferee(req.params.id);
  res.send(matches);
});

router.get("/:id/upcomingMatches", async (req: Request, res: Response) => {
  const matches = await matchService.getUpcomingMatchesForReferee(req.params.id);
  res.send(matches);
});

export default router;
