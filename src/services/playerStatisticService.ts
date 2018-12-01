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
    const existingStatistic = await playerStatisticRepository.findOne({
      playerId: req.body.playerId,
      matchId: req.body.matchId
    });
    if (existingStatistic) {
      return res
        .status(400)
        .send("Statistic for the player already exists in this match!");
    }
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
      return c.teamId === match.awayTeam.id;
    });
    const awayTeamPlayersStatistics = await Promise.all(
      awayTeamStatistics.map(async c => {
        const player = await this.playerService.getPlayerWithGivenID(
          c.playerId
        );
        const x = {
          player: {
            position: player.position,
            firstName: player.user.firstName,
            secondName: player.user.secondName,
            number: player.number
          },
          goals: c.goals,
          assists: c.assists,
          redCards: c.redCards,
          yellowCards: c.yellowCards
        };

        return x;
      })
    );

    const homeTeamStatistics = teamStatistics.filter(c => {
      return c.teamId === match.homeTeam.id;
    });

    const homeTeamPlayersStatistics = await Promise.all(
      homeTeamStatistics.map(async c => {
        const player = await this.playerService.getPlayerWithGivenID(
          c.playerId
        );
        const x = {
          player: {
            position: player.position,
            firstName: player.user.firstName,
            secondName: player.user.secondName,
            number: player.number
          },
          goals: c.goals,
          assists: c.assists,
          redCards: c.redCards,
          yellowCards: c.yellowCards
        };
        return x;
      })
    );

    const data = {
      league: match.leagueId,
      homeTeam: {
        result: match.homeTeam.result,
        statistics: homeTeamPlayersStatistics
      },
      awayTeam: {
        result: match.awayTeam.result,
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

    var playerTeamStatistics = {
      id: playerID,
      appearance: statistics.length,
      goals: loadash.sumBy(statistics, "goals"),
      assists: loadash.sumBy(statistics, "assists"),
      yellowCards: loadash.sumBy(statistics, "yellowCards"),
      redCards: loadash.sumBy(statistics, "redCards")
    };
    return playerTeamStatistics;
  }

  async getStatisticsForLeague(leagueID: number) {
    const statisticsRepository = await getConnection().getRepository(
      PlayerStatistic
    );
    let statistics = await statisticsRepository.find();

    var playerTeamStatistics = loadash(statistics)
      .groupBy(c => c.playerId)
      .map((playerStatistics, id) => ({
        playerId: +id,
        goals: loadash.sumBy(playerStatistics, "goals"),
        assists: loadash.sumBy(playerStatistics, "assists"),
        yellowCards: loadash.sumBy(playerStatistics, "yellowCards"),
        redCards: loadash.sumBy(playerStatistics, "redCards")
      }))
      .value();

    const bestScorers = loadash(playerTeamStatistics)
      .orderBy(c => c.goals, ["desc"])
      .take(3);

    const bestAsistants = loadash(playerTeamStatistics)
      .orderBy(c => c.assists, ["desc"])
      .take(3);

    const mostRedCards = loadash(playerTeamStatistics)
      .orderBy(c => c.yellowCards, ["desc"])
      .take(3);

    const mostYellowCards = loadash(playerTeamStatistics)
      .orderBy(c => c.redCards, ["desc"])
      .take(3);

    return {
      bestScorers: bestScorers,
      bestAsistants: bestAsistants,
      mostYellowCards: mostYellowCards,
      mostRedCards: mostRedCards
    };
  }

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
