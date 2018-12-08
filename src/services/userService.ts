import bcrypt from "bcrypt";
import { User } from "./../models/user";
import { Request, Response } from "express";
import { DeepPartial, getConnection } from "typeorm";

import PlayerService from "./playerService";
import ExpectedError from "../utils/expectedError";

interface credentialsObject {
  firstName: string;
  secondName: string;
  login: string;
  password: string;
  role?: string;
}

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

  //do generowania bazy
  async generateUser(login: string, password: string, firstName: string, lastName: string) {
    const userRepository = await getConnection().getRepository(User);
    /* const existingUser = await userRepository.findOne({
      login: login
    });
    if (existingUser) throw new ExpectedError("User already exist", 404); */

    let user = await userRepository.create({
      login: login,
      password: password,
      firstName: firstName,
      secondName: lastName
    });

    /*const { error } = User.validateUser(user);
    if (error) throw new ExpectedError(error.details[0].message, 400);*/

    const salt = await bcrypt.genSalt(3);
    user.password = await bcrypt.hash(user.password, salt);

    await getConnection().manager.insert(User, user);

    /* const playerService = new PlayerService();
    const player = await playerService.createPlayerForUser(user); */
    // return player;
  }

  async generateManyUsers(credentials: Array<credentialsObject>, referee: boolean) {
    var finalCredentialsObject: Array<credentialsObject> = [];
    for (var index = 0; index < credentials.length; index++) {
      let currentCredentials = credentials[index];
      const salt = await bcrypt.genSalt(3);
      currentCredentials.password = await bcrypt.hash(currentCredentials.password, salt);
      if (referee) currentCredentials.role = "Referee";
      finalCredentialsObject.push(currentCredentials);
    }
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(finalCredentialsObject)
      .execute();
    if (!referee) {
      const playerService = new PlayerService();
      await playerService.generatePlayerForUsers();
    }
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

  async updateUserWithParams(id: number, firstName: string, secondName: string, imgUrl: string) {
    const userRepository = await getConnection().getRepository(User);
    const user = await userRepository.findOne(id);
    if (firstName) user.firstName = firstName;
    if (secondName) user.secondName = secondName;
    if (imgUrl) user.imgURL = imgUrl;
    await getConnection().manager.save(user);
  }
}

export default UserService;
