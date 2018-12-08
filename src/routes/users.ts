import { getConnection } from "typeorm";
import express, { Request, Response } from "express";
import { User } from "../models/user";
import UserService from "../services/userService";
import ExpectedError from "../utils/expectedError";
import auth from "../middlewares/auth";
const router = express.Router();
const userService = new UserService();

router.get("/", async (req: Request, res: Response) => {
  const users = await getConnection().manager.find(User);
  res.send(users);
});

router.post("/", async (req: Request, res: Response) => {
  try {
    await userService.createUser(req, res);
  } catch (error) {
    if (error instanceof ExpectedError) res.status(error.errorCode).send(error.message);
    else res.status(500).send(error.message);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const user = await getConnection().manager.findOne(User, req.params.id);
  res.send(user);
});

router.put("/", auth, async (req: Request, res: Response) => {
  await userService.updateUserWithParams(res.locals.senderId, req.body.firstName, req.body.secondName, req.body.imgUrl);
  res.status(204).send();
});

export default router;
