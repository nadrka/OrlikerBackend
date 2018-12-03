import { MatchPlace } from "./../models/match/matchPlace";
import { getConnection } from "typeorm";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const places = await getConnection().manager.find(MatchPlace);
  res.send(places);
});

router.post("/", async (req: Request, res: Response) => {
  const placeRepository = await getConnection().getRepository(MatchPlace);
  const place = placeRepository.create(req.body);
  await getConnection().manager.save(place);
  res.send(place);
});

export default router;
