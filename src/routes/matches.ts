import express, { Request, Response } from "express";
import MatchService from "../services/matchService";

const router = express.Router();
const matchService = new MatchService();
router.post("/", async (req: Request, res: Response) => {
  await matchService.createMatch(req, res);
});
router.post("/:id/result", async (req: Request, res: Response) => {
  await matchService.createMatchResult(req, res);
});
router.get("/:id/statistics", async (req: Request, res: Response) => {});
router.get("/:id", async (req: Request, res: Response) => {
  await matchService.getMatchForGivenID(req.params.id, res);
});
router.put("/:id", async (req: Request, res: Response) => {
  await matchService.updateMatchWithRequestBody(req, res);
});
router.put("/:id/result", async (req: Request, res: Response) => {
  await matchService.updateMatchResult(req, res);
});
router.delete("/:id", async (req: Request, res: Response) => {
  await matchService.deleteMatch(req, res);
});

export default router;
