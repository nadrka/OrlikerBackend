import { getConnection } from "typeorm";
import { Request, Response } from "express";
import Player from "../models/player/player";
import User from "../models/user";
import * as loadash from "lodash";
import ExpectedError from "../utils/expectedError";
import Match from "../models/match/match";

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

  async getAllPlayersWithoutTeam() {
    const playersRepository = await getConnection().getRepository(Player);
    const players = await playersRepository.find({
      where: { teamId: null },
      relations: ["user"]
    });

    const mappedPlayers = players.map(player => {
      return {
        id: player.id,
        firstName: player.user.firstName,
        secondName: player.user.secondName,
        number: player.number
      };
    });
    return mappedPlayers;
  }

  async getPlayerWithGivenID(playerID: number) {
    const playersRepository = await getConnection().getRepository(Player);
    const player = await playersRepository.findOne(
      { id: playerID },
      { relations: ["user"] }
    );

    return player;
  }

  async getPlayersWithGivenTeam(teamID: number) {
    const playersRepository = await getConnection().getRepository(Player);
    const players = await playersRepository.find({
      where: { teamId: teamID },
      relations: ["user"]
    });

    if (players.length <= 0)
      throw new ExpectedError("There is no player for given team!", 400);

    return players;
  }

  async getAllPlayersForMatch(matchID: number) {
    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.findOne(
      { id: matchID },
      { relations: ["homeTeam", "awayTeam"] }
    );
    const playersRepository = await getConnection().getRepository(Player);
    const homeTeamPlayers = await playersRepository.find({
      where: { teamId: match.homeTeamId },
      relations: ["user"]
    });

    const awayTeamPlayers = await playersRepository.find({
      where: { teamId: match.awayTeamId },
      relations: ["user"]
    });

    const mappedAwayTeamPlayers = awayTeamPlayers.map(atp => {
      return {
        id: atp.id,
        firstName: atp.user.firstName,
        secondName: atp.user.secondName,
        number: atp.number
      };
    });
    const mappedHomeTeamPlayers = homeTeamPlayers.map(htp => {
      return {
        id: htp.id,
        firstName: htp.user.firstName,
        secondName: htp.user.secondName,
        number: htp.number
      };
    });

    return {
      homeTeam: mappedAwayTeamPlayers,
      awayTeam: mappedHomeTeamPlayers
    };
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

    if (!player)
      throw new ExpectedError("Player with given id does not exist", 400);

    await getConnection().manager.remove(player);
    await getConnection().manager.remove(user);
  }
}

export default PlayerService;
