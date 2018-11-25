import { PlayerStatistic } from "./../models/player/playerStatistic";
import { getConnection } from "typeorm";
import { Request, Response } from "express";
import Player from "../models/player/player";
import User from "../models/user";
import PlayerService from "../services/playerService";
import loadash from "lodash";
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
    await getConnection().manager.save(playerStatistic);
    return playerStatistic;
  }

  async getStatisticsForMatch(matchID: number) {
    const playerStatisticRepository = await getConnection().getRepository(
      PlayerStatistic
    );
    const match = await this.matchService.getMatchForGivenID(matchID);

    const teamStatistics = await playerStatisticRepository.find({
      matchId: matchID
    });

    const awayTeamStatistics = teamStatistics.filter(c => {
      c.player.teamId == match.awayTeamId;
    });
    const awayTeamPlayersStatistics = await Promise.all(
      awayTeamStatistics.map(async c => {
        const player = await this.playerService.getPlayerWithGivenID(
          c.playerId
        );
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
      })
    );

    const homeTeamStatistics = teamStatistics.filter(c => {
      c.player.teamId == match.homeTeamId;
    });
    const homeTeamPlayersStatistics = await Promise.all(
      homeTeamStatistics.map(async c => {
        const player = await this.playerService.getPlayerWithGivenID(
          c.playerId
        );
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
      })
    );

    const data = {
      league: match.league,
      homeTeam: {
        result: match.homeTeamResult,
        statistics: homeTeamPlayersStatistics
      },
      awayTeam: {
        result: match.awayTeamResult,
        statistics: awayTeamPlayersStatistics
      }
    };
    return data;
  }

  async getStatisticsForTeam(teamId: number) {
    const statisticsRepository = await getConnection().getRepository(
      PlayerStatistic
    );
    let statistics = await statisticsRepository.find({ teamId: teamId });

    var playerTeamStatistics = loadash(statistics)
      .groupBy(c => c.playerId)
      .map((playerStatistics, id) => ({
        playerId: +id,
        goalSum: loadash.sumBy(playerStatistics, "goals"),
        assistSum: loadash.sumBy(playerStatistics, "assists"),
        yellowCardSum: loadash.sumBy(playerStatistics, "yellowCards"),
        redCardSum: loadash.sumBy(playerStatistics, "redCards")
      }))
      .value();

    let data = await Promise.all(
      playerTeamStatistics.map(async statistic => {
        const player = await this.playerService.getPlayerWithGivenID(
          statistic.playerId
        );
        return {
          player: {
            id: player.id,
            firstName: player.user.firstName,
            secondName: player.user.secondName,
            number: player.number
          },
          goals: statistic.goalSum,
          assists: statistic.assistSum,
          yellowCards: statistic.yellowCardSum,
          redCards: statistic.redCardSum
        };
      })
    );

    return data;
  }

  async getStatisticsForPlayer(playerID: number) {
    const statisticsRepository = await getConnection().getRepository(
      PlayerStatistic
    );
    const statistics = await statisticsRepository.find({ playerId: playerID });
    return statistics;
  }

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
