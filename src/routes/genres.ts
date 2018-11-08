import { Genre } from "./../models/genre";
import auth from "./../middlewares/auth";
import express, { Response, Request } from "express";
import { getConnection } from "typeorm";

const router = express.Router();
router.post("/", async (req: Request, res: Response) => {
  const { error } = Genre.validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genreRepository = await getConnection().getRepository(Genre);
  const genre = await genreRepository.create(req.body);
  await getConnection().manager.save(genre);
  res.send(genre);
});

router.get("/", auth, async (req, res) => {
  const genres = await getConnection().manager.find(Genre);
  res.send(genres);
});

router.put("/:id", async (req: Request, res: Response) => {
  const genreRepository = await getConnection().getRepository(Genre);
  const genre = await genreRepository.findOne({ id: req.params.id });
  genre.name = req.body.name;
  await getConnection().manager.save(genre);
  res.send(genre);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const genreRepository = getConnection().getRepository(Genre);
  const genre = await genreRepository.findOne({ id: req.params.id });
  await genreRepository.remove(genre);
  const genres = await getConnection().manager.find(Genre);
  res.send(genres);
});

export default router;
