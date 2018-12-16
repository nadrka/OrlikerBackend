import { getConnection } from "typeorm";
import { Request, Response } from "express";
import Player, { POSITION_OPTIONS, FOOT_OPTIONS } from "../models/player/player";
import User from "../models/user";
import * as loadash from "lodash";
import ExpectedError from "../utils/expectedError";
import Match from "../models/match/match";
import { Team } from "../models/team/team";
import { PLAYERS_IN_TEAMS } from "../startups/db";
import { randomIntFromMinMax } from "../utils/commonFunctions";
import Invitation from "../models/invitation";

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

  async generatePlayerForUsers() {
    const users = await getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("player", "player", "player.userId = user.id")
      .where("player.id IS NULL")
      .getMany();
    const teams = await getConnection()
      .getRepository(Team)
      .find();
    var objectToInsert = [];
    if (teams.length > 0) {
      let teamIndex = 0;
      for (var index = 0; index < users.length; ) {
        for (var innerIndex = 0; innerIndex < PLAYERS_IN_TEAMS - 1 && index < users.length; innerIndex++, index++)
          objectToInsert.push({
            user: users[index],
            team: teamIndex < teams.length ? teams[teamIndex] : null,
            position: innerIndex == 0 ? POSITION_OPTIONS[0] : POSITION_OPTIONS[randomIntFromMinMax(1, 3)],
            number: randomIntFromMinMax(1, 99),
            strongerFoot: FOOT_OPTIONS[randomIntFromMinMax(0, 2)]
          });
        teamIndex++;
      }
    } else {
      for (var index = 0; index < users.length; index++) {
        objectToInsert.push({
          user: users[index],
          position: POSITION_OPTIONS[randomIntFromMinMax(0, 3)],
          number: randomIntFromMinMax(1, 99),
          strongerFoot: FOOT_OPTIONS[randomIntFromMinMax(0, 2)]
        });
      }
    }
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Player)
      .values(objectToInsert)
      .execute();
  }

  async getAllPlayers(req: Request) {
    const players = await getConnection().manager.find(Player, {
      relations: ["user"]
    });
    return players;
  }

  async getAllPlayersWithoutTeam() {
    const playersRepository = await getConnection().getRepository(Player);
    const invitationRepository = await getConnection().getRepository(Invitation);
    const players = await playersRepository.find({
      where: { teamId: null },
      relations: ["user"]
    });

    const mappedPlayers = players.map(player => {
      return {
        id: player.id,
        firstName: player.user.firstName,
        secondName: player.user.secondName,
        number: player.number,
        imgURL: player.user.imgURL
      };
    });
    return mappedPlayers;
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

  async getAllPlayersForMatch(matchID: number) {
    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.findOne({ id: matchID }, { relations: ["homeTeam", "awayTeam"] });
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
      homeTeam: mappedHomeTeamPlayers,
      awayTeam: mappedAwayTeamPlayers
    };
  }

  async getPlayerForUser(userID: number) {
    const playerRepository = await getConnection().getRepository(Player);
    const player = await playerRepository.findOne({ user: { id: userID } }, { relations: ["captainTeam"] });

    return player;
  }

  async updatePlayerWith(player: Player) {
    await getConnection().manager.save(player);
  }

  async updatePlayer(req: Request, senderId: number) {
    const playerRepository = await getConnection().getRepository(Player);
    const player = await playerRepository.findOne({ id: senderId }, { relations: ["user"] });
    player.number = req.body.number;
    player.position = req.body.position;
    player.strongerFoot = req.body.strongerFoot;
    player.user.firstName = req.body.firstName;
    player.user.secondName = req.body.secondName;

    await getConnection().manager.save(player);
    await getConnection().manager.save(player.user);
    return player;
  }

  async updatePlayerImage(imgURL: string, senderId: number) {
    const playerRepository = await getConnection().getRepository(Player);
    const player = await playerRepository.findOne({ id: senderId }, { relations: ["user"] });
    player.user.imgURL = imgURL;
    await getConnection().manager.save(player);
    await getConnection().manager.save(player.user);
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
