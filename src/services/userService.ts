import bcrypt from "bcrypt";
import { User } from "./../models/user";
import { Request, Response } from "express";
import { DeepPartial, getConnection } from "typeorm";

import PlayerService from "./playerService";
import ExpectedError from "../utils/expectedError";

class UserService {
  async createUser(req: Request, res: Response) {
    const { error } = User.validateUser(req.body);
    if (error) throw new ExpectedError(error.details[0].message, 400);

    const userRepository = await getConnection().getRepository(User);

    const existingUser = await userRepository.findOne({
      login: req.body.login
    });
    if (existingUser) throw new ExpectedError("User already exist", 400);
    this.saveUser(req, res);
  }

  async getAllReferees() {
    const userRepository = await getConnection().getRepository(User);
    const referees = await userRepository.find({ role: "Referee" });

    return referees;
  }

  async saveUser(req: Request, res: Response) {
    const userRepository = await getConnection().getRepository(User);
    const userFromRequestBody: DeepPartial<User> = req.body;
    let user: User = await userRepository.create(userFromRequestBody);
    const token = user.generateAuthToken();

    const salt = await bcrypt.genSalt(7);
    user.password = await bcrypt.hash(user.password, salt);

    await getConnection().manager.save(user);

    const playerService = new PlayerService();
    const player = await playerService.createPlayerForUser(user);
    if (player) {
      res.send({ ...player, token });
    }
  }

  async updateUser(updatedUser: User) {
    const userRepository = await getConnection().getRepository(User);
    const user = await userRepository.findOne({ id: updatedUser.id });
    user.firstName = updatedUser.firstName;
    user.secondName = updatedUser.secondName;
    user.imgURL = updatedUser.imgURL;
    await getConnection().manager.save(user);
  }
}

export default UserService;
