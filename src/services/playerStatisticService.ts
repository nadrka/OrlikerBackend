import { getConnection } from "typeorm";
import { Request, Response } from "express";
import Player from "../models/player/player";
import User from "../models/user";

class PlayerStatisticService {
  async createStatistic(req: Request, res: Response) {}

  async getStatisticsForTeam(matchID: number, teamID: number) {}

  async getStatisticsForPlayer(playerID: number) {}

  async getStatisticsForLeague(leagueID: number) {}

  async updateStatistic() {}

  async deleteStatistic() {}
}

export default PlayerStatisticService;
