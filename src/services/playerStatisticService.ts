import { PlayerStatistic } from "./../models/player/playerStatistic";
import { getConnection } from "typeorm";
import { Request, Response } from "express";
import Player from "../models/player/player";
import User from "../models/user";
import PlayerService from "../models/player/playerStatistic";
import * as loadash from "lodash";

class PlayerStatisticService {
  async createStatistic(req: Request, res: Response) {
    const { error } = PlayerService.validatePlayerStatistic(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const playerStatisticRepository = await getConnection().getRepository(
      PlayerStatistic
    );
    const playerStatistic = await playerStatisticRepository.create(req.body);
    res.send(playerStatistic);
  }

  async getStatisticsForTeam(matchID: number, teamID: number) {}

  async getStatisticsForPlayer(playerID: number) {}

  async getStatisticsForLeague(leagueID: number) {}

  async updateStatistic(statisticID: number, req: Request, res: Response) {
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
