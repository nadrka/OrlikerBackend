import { Response } from "express-serve-static-core";
import express, { Request } from "express";
import TeamService from "../services/teamService";

const router = express.Router();
const teamService = new TeamService();
router.post("/", async (req: Request, res: Response) => {
  console.log(req.body);
  teamService.createTeam(req, res);
});
router.get("/", async (req: Request, res: Response) => {
  const teams = await teamService.getAllTeams();
  res.send(teams);
});
router.get("/:id/players", async (req: Request, res: Response) => {});
router.get("/:id/matches/upcoming", async (req: Request, res: Response) => {});
router.get("/:id/matches/played", async (req: Request, res: Response) => {});
router.get("/:id/statistics", async (req: Request, res: Response) => {});
router.put("/:id", async (req: Request, res: Response) => {});
router.delete("/:id", async (req: Request, res: Response) => {});

export default router;
