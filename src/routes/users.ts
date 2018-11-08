import { getConnection } from "typeorm";
import express, { Request, Response } from "express";
import { User } from "../models/user";
import UserService from "../services/userService";
const router = express.Router();
const userService = new UserService();

router.get("/", async (req: Request, res: Response) => {
  const users = await getConnection().manager.find(User);
  res.send(users);
});

router.post("/", async (req: Request, res: Response) => {
  await userService.createUser(req, res);
});

router.put("/:id", async (req: Request, res: Response) => {
  await userService.updateUser(req, res);
});

export default router;
