import { getConnection } from "typeorm";
import { Request, Response } from "express";
import Player from "../models/player/player";
import User from "../models/user";
import * as loadash from "lodash";
import ExpectedError from "../utils/expectedError";

class PlayerService {
  async createPlayer(req: Request) {
    const { error } = Player.validatePlayer(req.body);
    if (error) throw new ExpectedError(error.details[0].message, 400);

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

  async getAllPlayers(req: Request) {
    const players = await getConnection().manager.find(Player, {
      relations: ["user"]
    });
    return players;
  }

  async getPlayerWithGivenID(playerID: number) {
    const playersRepository = await getConnection().getRepository(Player);
    const player = await playersRepository.findOne({ id: playerID }, { relations: ["user"] });

    return player;
  }

  async getPlayersWithGivenTeam(teamID: number) {
    const playersRepository = await getConnection().getRepository(Player);
    const players = await playersRepository.find({
      where: { teamId: teamID },
      relations: ["user"]
    });

    if (players.length <= 0) throw new ExpectedError("There is no player for given team!", 400);

    return players;
  }

  async getPlayerForUser(userID: number) {
    const playerRepository = await getConnection().getRepository(Player);
    const player = await playerRepository.findOne({ user: { id: userID } });

    return player;
  }

  async updatePlayerWith(player: Player) {
    await getConnection().manager.save(player);
  }

  async updatePlayer(req: Request, senderId: number) {
    const playerRepository = await getConnection().getRepository(Player);
    const player = await playerRepository.findOne({ id: senderId });
    loadash.merge(player, req.body);

    await getConnection().manager.save(player);
    return player;
  }

  async deletePlayerWithGivenID(playerID: number) {
    const playersRepository = await getConnection().getRepository(Player);
    const player = await playersRepository.findOne({ id: playerID });
    const user = player.user;

    if (!player) throw new ExpectedError("Player with given id does not exist", 400);

    await getConnection().manager.remove(player);
    await getConnection().manager.remove(user);
  }
}

export default PlayerService;
