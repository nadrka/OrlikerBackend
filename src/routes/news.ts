import express, { Request, Response } from "express";
import NewsService from "../services/newsService";
import ExpectedError from "../utils/expectedError";

const router = express.Router();
const newsService = new NewsService();

//autoryzacja
router.post("/", async (req: Request, res: Response) => {
  const news = await newsService.createNews(req.body.title, req.body.content, req.body.teamId);
  res.send(news);
});
router.get("/", async (req: Request, res: Response) => {
  const news = await newsService.getNews();
  res.send(news);
});
router.get("/:id", async (req: Request, res: Response) => {
  const news = await newsService.getSingleNews(req.params.id);
  res.send(news);
});
//autoryzacja
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const news = await newsService.changeNews(req.params.id, req.body.title, req.body.content);
    res.send(news);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

export default router;
