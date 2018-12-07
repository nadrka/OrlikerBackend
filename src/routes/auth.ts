import Joi from "joi";
import { getConnection, DeepPartial } from "typeorm";
import express, { Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import PlayerService from "../services/playerService";
import jwt from "jsonwebtoken";
import config from "config";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const userRepository = await getConnection().getRepository(User);

  const existingUser: User = await userRepository.findOne({
    login: req.body.login
  });
  if (!existingUser) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, existingUser.password);

  if (!validPassword) return res.status(400).send("Invalid email or password");
  const token = existingUser.generateAuthToken();

  const playerService = new PlayerService();
  const player = await playerService.getPlayerForUser(existingUser.id);
  let data = {
    token: token,
    firstName: existingUser.firstName,
    secondName: existingUser.secondName,
    role: existingUser.role
  };
  if (player)
    Object.assign(data, player, {
      isCaptain: player.captainTeam !== null
    });
  res.send(data);
});

/*router.get("/", async (req: Request, res: Response) => {
  res.send(
    jwt.verify(req.headers.authorization, config.get("jwtPrivateKey"), function(err, decoded) {
      if (err) res.sendStatus(403);
      else {
        res.send(decoded);
      }
    })
  );
});*/

function validate(req: Request) {
  const schema = {
    login: Joi.string()
      .min(5)
      .max(50)
      .required(),
    password: Joi.string()
      .min(5)
      .max(50)
      .required()
  };

  return Joi.validate(req, schema);
}

export default router;
