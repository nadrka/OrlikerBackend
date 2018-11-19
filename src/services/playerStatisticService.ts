import { PlayerStatistic } from "./../models/player/playerStatistic";
import { getConnection } from "typeorm";
import { Request, Response } from "express";
import Player from "../models/player/player";
import User from "../models/user";
import PlayerService from "../services/playerService";
import * as loadash from "lodash";
import MatchService from "./matchService";

class PlayerStatisticService {
  matchService = new MatchService();
  playerService = new PlayerService();

  async createStatistic(req: Request, res: Response) {
    const { error } = PlayerStatistic.validatePlayerStatistic(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const playerStatisticRepository = await getConnection().getRepository(
      PlayerStatistic
    );
    const playerStatistic = await playerStatisticRepository.create(req.body);
    res.send(playerStatistic);
  }

  async getStatisticsForMatch(matchID: number) {
    const playerStatisticRepository = await getConnection().getRepository(
      PlayerStatistic
    );
    const match = await this.matchService.getMatchForGivenID(matchID);

    const homeTeamStatistics = await playerStatisticRepository.find({
      teamId: match.homeTeamId
    });

    const awayTeamStatistics = await playerStatisticRepository.find({
      teamId: match.awayTeamId
    });
    const sd = awayTeamStatistics.map(async c => {
      const player = await this.playerService.getPlayerWithGivenID(c.playerId);
      return loadash.pick(c, [
        player.position,
        player.user.firstName,
        player.user.secondName,
        player.number,
        c.goals,
        c.assists,
        c.redCards,
        c.yellowCards
      ]);
    });
  }

  async getStatisticsForPlayer(playerID: number) {}

  async getStatisticsForLeague(leagueID: number) {}

  async updateStatistic(req: Request, res: Response) {
    const playerStatisticRepository = await getConnection().getRepository(
      PlayerStatistic
    );
    const playerStatistic = await playerStatisticRepository.findOne({
      id: req.params.id
    });

    if (!playerStatistic)
      return res
        .status(404)
        .send("Player's statistic with given id does not exist");

    loadash.extend(playerStatistic, req.body);
    res.send(playerStatistic);
  }

  async deleteStatistic(req: Request, res: Response) {
    const playerStatisticRepository = await getConnection().getRepository(
      PlayerStatistic
    );
    const playerStatistic = await playerStatisticRepository.findOne({
      id: req.params.id
    });

    if (!playerStatistic)
      return res
        .status(404)
        .send("Player's statistic with given id does not exist");

    await getConnection().manager.remove(playerStatistic);
  }
}

export default PlayerStatisticService;
