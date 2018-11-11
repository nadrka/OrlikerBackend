import bcrypt from "bcrypt";
import { User } from "./../models/user";
import { Request, Response } from "express";
import { DeepPartial, getConnection } from "typeorm";

import PlayerService from "./playerService";

class UserService {
  async createUser(req: Request, res: Response) {
    const { error } = User.validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const userRepository = await getConnection().getRepository(User);

    const existingUser = await userRepository.findOne({
      login: req.body.login
    });
    if (existingUser) return res.status(400).send("User already exist");
    this.saveUser(req, res);
  }

  async saveUser(req: Request, res: Response) {
    const userRepository = await getConnection().getRepository(User);
    const userFromRequestBody: DeepPartial<User> = req.body;
    let user: User = await userRepository.create(userFromRequestBody);

    const salt = await bcrypt.genSalt(7);
    user.password = await bcrypt.hash(user.password, salt);

    await getConnection().manager.save(user);

    const playerService = new PlayerService();
    const player = await playerService.createPlayerForUser(user);
    res.send(player);
  }

  async updateUser(req: Request, res: Response) {
    const userRepository = await getConnection().getRepository(User);
    const user = await userRepository.findOne({ id: req.params.id });
    user.firstName = req.body.firstName;
    user.secondName = req.body.secondName;
    user.imgURL = req.body.imgURL;
    await getConnection().manager.save(user);
    res.send(user);
  }
  //todo
  async deleteUser() {}
}

export default UserService;
