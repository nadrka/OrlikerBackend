import { PlayerStatistic } from "./../models/player/playerStatistic";
import { getConnection } from "typeorm";
import { Request, Response } from "express";
import Player, { POSITION_OPTIONS } from "../models/player/player";
import User from "../models/user";
import PlayerService from "../services/playerService";
import loadash from "lodash";
import MatchService from "./matchService";
import ExpectedError from "../utils/expectedError";
import TeamService from "./teamService";
import { randomIntFromMinMax } from "../utils/commonFunctions";
import { Match } from "../models/match/match";

interface statistics {
  playerId: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  matchId: number;
  teamId: number;
}

class PlayerStatisticService {
  matchService = new MatchService();
  playerService = new PlayerService();
  teamService = new TeamService();

  async createStatistic(req: Request) {
    // const { error } = PlayerStatistic.validatePlayerStatistic(req.body);
    // if (error) throw new ExpectedError(error.details[0].message, 400);

    const playerStatisticRepository = await getConnection().getRepository(PlayerStatistic);
    // const existingStatistic = await playerStatisticRepository.findOne({
    //   playerId: req.body.playerId,
    //   matchId: req.body.matchId
    // });
    console.log(req.body);
    // if (existingStatistic) {
    //   throw new ExpectedError(
    //     "Statistic for the player already exists in this match!",
    //     400
    //   );
    // }
    const playerStatistic = await playerStatisticRepository.create(req.body);
    await getConnection().manager.save(playerStatistic);
    // return playerStatistic;
  }

  async generateStatisticsForMatches() {
    const allMatches = await getConnection()
      .getRepository(Match)
      .find({
        where: { status: "Played" },
        relations: ["homeTeam", "homeTeam.players", "awayTeam", "awayTeam.players"]
      });
    let allStats: statistics[] = [];
    for (var index = 0; index < allMatches.length; index++) {
      allStats = [
        ...allStats,
        ...this.generateStatisticsForPlayers(
          allMatches[index].homeTeam.players,
          allMatches[index].homeTeamResult,
          allMatches[index].homeTeam.id,
          allMatches[index].id
        )
      ];
      allStats = [
        ...allStats,
        ...this.generateStatisticsForPlayers(
          allMatches[index].awayTeam.players,
          allMatches[index].awayTeamResult,
          allMatches[index].awayTeam.id,
          allMatches[index].id
        )
      ];
    }
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(PlayerStatistic)
      .values(allStats)
      .execute();
  }

  generateStatisticsForPlayers(players: Player[], numberOfGoalsInMatch: number, teamId: number, matchId: number) {
    let idsPlaying: statistics[] = [],
      idsForChoosingGoals = [],
      idsForChoosingAssists = [];
    for (var playerIndex = 0; playerIndex < players.length; playerIndex++) {
      if (randomIntFromMinMax(0, 3) != 0) {
        let yellowCard = false,
          redCard = false;
        if (randomIntFromMinMax(1, 10) < 2) yellowCard = true;
        if (randomIntFromMinMax(1, 100) < 2) redCard = true;
        idsPlaying.push({
          playerId: players[playerIndex].id,
          goals: 0,
          assists: 0,
          yellowCards: yellowCard ? 1 : 0,
          redCards: redCard ? 1 : 0,
          teamId: teamId,
          matchId: matchId
        });
        let chanceOfGettingGoal = 0;
        let chanceOfGettingAssist = 0;
        switch (players[playerIndex].position) {
          case "Obrońca":
            chanceOfGettingAssist = 1;
            chanceOfGettingGoal = 1;
            break;
          case "Pomocnik":
            chanceOfGettingAssist = 3;
            chanceOfGettingGoal = 2;
            break;
          case "Napastnik":
            chanceOfGettingAssist = 2;
            chanceOfGettingGoal = 3;
            break;
          default:
            chanceOfGettingAssist = 0;
            chanceOfGettingGoal = 0;
            break;
        }
        for (let i = 0; i < chanceOfGettingGoal; i++) {
          idsForChoosingGoals.push(players[playerIndex].id);
        }
        for (let i = 0; i < chanceOfGettingAssist; i++) {
          idsForChoosingAssists.push(players[playerIndex].id);
        }
      }
    }
    for (var goalIndex = 0; goalIndex < numberOfGoalsInMatch; goalIndex++) {
      let idOfScorer = idsForChoosingGoals[randomIntFromMinMax(0, idsForChoosingGoals.length - 1)];
      let idOfAssister = idsForChoosingAssists[randomIntFromMinMax(0, idsForChoosingAssists.length - 1)];
      while (idOfScorer == idOfAssister) {
        idOfAssister = idsForChoosingAssists[randomIntFromMinMax(0, idsForChoosingAssists.length - 1)];
      }
      idsPlaying.find(obj => obj.playerId === idOfScorer).goals++;
      idsPlaying.find(obj => obj.playerId === idOfAssister).assists++;
    }
    return idsPlaying;
  }

  async getStatisticsForMatch(matchID: number) {
    const playerStatisticRepository = await getConnection().getRepository(PlayerStatistic);
    const match = await this.matchService.getMatchForGivenID(matchID);
    const teamStatistics = await playerStatisticRepository.find({
      matchId: matchID
    });

    const awayTeamStatistics = teamStatistics.filter(c => {
      return c.teamId === match.awayTeam.id;
    });
    const awayTeamPlayersStatistics = await Promise.all(
      awayTeamStatistics.map(async c => {
        const player = await this.playerService.getPlayerWithGivenID(c.playerId);
        const x = {
          player: {
            position: player.position,
            firstName: player.user.firstName,
            secondName: player.user.secondName,
            number: player.number,
            imgURL: player.user.imgURL
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
        const player = await this.playerService.getPlayerWithGivenID(c.playerId);
        const x = {
          player: {
            position: player.position,
            firstName: player.user.firstName,
            secondName: player.user.secondName,
            number: player.number,
            imgURL: player.user.imgURL
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
    const statisticsRepository = await getConnection().getRepository(PlayerStatistic);
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
        const player = await this.playerService.getPlayerWithGivenID(statistic.playerId);
        return {
          player: {
            id: player.id,
            firstName: player.user.firstName,
            secondName: player.user.secondName,
            number: player.number,
            imgURL: player.user.imgURL
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
    const statisticsRepository = await getConnection().getRepository(PlayerStatistic);
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
    const statisticsRepository = await getConnection().getRepository(PlayerStatistic);
    let statistics = await statisticsRepository.find({
      relations: ["match"]
    });

    let filteredStatistics = statistics.filter(s => {
      return s.match.leagueId == leagueID;
    });

    var playerTeamStatistics = loadash(filteredStatistics)
      .groupBy(c => c.playerId)
      .map((playerStatistics, id) => ({
        playerId: +id,
        goals: loadash.sumBy(playerStatistics, "goals"),
        assists: loadash.sumBy(playerStatistics, "assists"),
        yellowCards: loadash.sumBy(playerStatistics, "yellowCards"),
        redCards: loadash.sumBy(playerStatistics, "redCards")
      }))
      .value();

    const mappedPlayerTeamStatistics = await Promise.all(
      playerTeamStatistics.map(async statistic => {
        const player = await this.playerService.getPlayerWithGivenID(statistic.playerId);
        const team = await this.teamService.getTeamForGivenId(player.teamId);
        return {
          player: {
            id: statistic.playerId,
            firstName: player.user.firstName,
            secondName: player.user.secondName,
            imgURL: player.user.imgURL
          },
          team: {
            id: team.id,
            name: team.name
          },
          goals: statistic.goals,
          assists: statistic.assists,
          yellowCards: statistic.yellowCards,
          redCards: statistic.redCards
        };
      })
    );

    const bestScorers = loadash(mappedPlayerTeamStatistics)
      .orderBy(c => c.goals, ["desc"])
      .take(3);

    const bestAsistants = loadash(mappedPlayerTeamStatistics)
      .orderBy(c => c.assists, ["desc"])
      .take(3);

    const mostRedCards = loadash(mappedPlayerTeamStatistics)
      .orderBy(c => c.redCards, ["desc"])
      .take(3);

    const mostYellowCards = loadash(mappedPlayerTeamStatistics)
      .orderBy(c => c.yellowCards, ["desc"])
      .take(3);

    return {
      bestScorers: bestScorers,
      bestAsistants: bestAsistants,
      mostYellowCards: mostYellowCards,
      mostRedCards: mostRedCards
    };
  }

  async updateStatistic(req: Request) {
    const playerStatisticRepository = await getConnection().getRepository(PlayerStatistic);
    const playerStatistic = await playerStatisticRepository.findOne({
      id: req.params.id
    });

    if (!playerStatistic) throw new ExpectedError("Player's statistic with given id does not exist", 400);

    loadash.extend(playerStatistic, req.body);
    return playerStatistic;
  }

  async deleteStatistic(req: Request) {
    const playerStatisticRepository = await getConnection().getRepository(PlayerStatistic);
    const playerStatistic = await playerStatisticRepository.findOne({
      id: req.params.id
    });

    if (!playerStatistic) throw new ExpectedError("Player's statistic with given id does not exist", 400);

    await getConnection().manager.remove(playerStatistic);
  }
}

export default PlayerStatisticService;
