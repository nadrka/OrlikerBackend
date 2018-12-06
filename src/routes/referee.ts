import { getConnection } from "typeorm";
import express, { Request, Response } from "express";
import { User } from "../models/user";
import UserService from "../services/userService";
import ExpectedError from "../utils/expectedError";
const router = express.Router();
const userService = new UserService();

router.get("/", async (req: Request, res: Response) => {
  const users = await userService.getAllReferees();
  res.send(users);
});

export default router;
