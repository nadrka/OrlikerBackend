import { Response } from "express-serve-static-core";
import express, { Request } from "express";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {});
router.get("/", async (req: Request, res: Response) => {});
router.get("/:id/players", async (req: Request, res: Response) => {});
router.get("/:id/matches/upcoming", async (req: Request, res: Response) => {});
router.get("/:id/matches/played", async (req: Request, res: Response) => {});
router.get("/:id/statistics", async (req: Request, res: Response) => {});
router.put("/:id", async (req: Request, res: Response) => {});
router.delete("/:id", async (req: Request, res: Response) => {});

export default router;
