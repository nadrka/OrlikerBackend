import express, { Request, Response } from "express";
import NewsService from "../services/newsService";

const router = express.Router();
const newsService = new NewsService();

router.post("/", async (req: Request, res: Response) => {
  const news = await newsService.createNews(req.body.title, req.body.content, req.body.teamId);
  res.send(news);
});
router.get("/", async (req: Request, res: Response) => {
  const news = await newsService.getNews();
  res.send(news);
});
router.put("/:id", async (req: Request, res: Response) => {
  const news = await newsService.changeNews(req.params.id, req.body.title, req.body.content, res);
  res.send(news);
});

export default router;
