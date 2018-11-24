import { getConnection } from "typeorm";
import { Request, Response } from "express";
import Player from "../models/player/player";
import User from "../models/user";
import * as loadash from "lodash";

class PlayerService {
  async createPlayer(req: Request, res: Response) {
    const { error } = Player.validatePlayer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const playerRepository = await getConnection().getRepository(Player);
    const player = await playerRepository.create(req.body);
    return player;
  }

  async createPlayerForUser(user: User) {
    const player = new Player();
    player.user = user;
    await getConnection().manager.save(player);
    return player;
  }

  async getAllPlayers(req: Request, res: Response) {
    const players = await getConnection().manager.find(Player, { relations: ["user"] });
    return players;
  }

  async getPlayerWithGivenID(playerID: number) {
    const playersRepository = await getConnection().getRepository(Player);
    const player = await playersRepository.findOne({ id: playerID }, { relations: ["user"] });

    return player;
  }

  async getPlayersWithGivenTeam(teamID: number, res: Response) {
    const playersRepository = await getConnection().getRepository(Player);
    const players = await playersRepository.find({ teamId: teamID });

    if (players) return res.status(404).send("There is no player for given team!");

    res.send(players);
  }

  async getPlayerForUser(userID: number) {
    const userRepository = await getConnection().getRepository(User);
    const user = await userRepository.findOne({ id: userID });

    const playerRepository = await getConnection().getRepository(Player);
    const player = await playerRepository.findOne({ user: user });

    return player;
  }

  async updatePlayerWith(player: Player) {
    await getConnection().manager.save(player);
  }

  async updatePlayer(req: Request, res: Response) {
    const playerRepository = await getConnection().getRepository(Player);
    const player = await playerRepository.findOne({ id: req.params.id });
    loadash.merge(player, req.body);

    await getConnection().manager.save(player);
    res.send(player);
  }

  async deletePlayerWithGivenID(req: Request, res: Response, playerID: number) {
    const playersRepository = await getConnection().getRepository(Player);
    const player = await playersRepository.findOne({ id: req.params.id });

    if (!player) return res.status(404).send("Player with given id does not exist");

    await getConnection().manager.remove(player);
  }
}

export default PlayerService;
