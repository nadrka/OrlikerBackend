import express, { Request, Response } from "express";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {});
router.get("/:id/statistics", async (req: Request, res: Response) => {});
router.get("/:id", async (req: Request, res: Response) => {});
router.get("/", async (req: Request, res: Response) => {});
router.put("/:id", async (req: Request, res: Response) => {});
router.delete("/:id", async (req: Request, res: Response) => {});

export default router;