import SeasonService from "./seasonService";
import PlayerService from "./playerService";
import { randomIntFromMinMax } from "../utils/commonFunctions";
import TeamService from "./teamService";
import { TEAMS_IN_LEAGUES } from "../startups/db";
import { getConnection } from "typeorm";
import { PlayerSeasonStatistic } from "../models/player/playerSeasonStatistcs";
import lodash from "lodash";

interface stats {
  matches: number;
  goals: number;
  assists: number;
  yellowsCards: number;
  redCards: number;
  seasonId: number;
  playerId: number;
  teamId: number;
}

class PlayerSeasonStatsService {
  async generatePastStats() {
    const seasonService = new SeasonService(),
      playerService = new PlayerService(),
      teamService = new TeamService();
    const pastSeasons = await seasonService.getPastSeasonsWithSort();
    const players = await playerService.getAllPlayers();
    const allTeams = await teamService.getAllTeams();
    let pastStats: stats[] = [];
    for (var playerIndex = 0; playerIndex < players.length; playerIndex++) {
      for (var seasonIndex = 0; seasonIndex < pastSeasons.length; seasonIndex++) {
        if (randomIntFromMinMax(1, 100) <= 5) {
          players[playerIndex].teamId = allTeams[randomIntFromMinMax(0, allTeams.length - 1)].id;
        }
        if (players[playerIndex].teamId !== null) {
          let goals = 0,
            assists = 0,
            yellowsCards = 0,
            redCards = 0,
            matches = randomIntFromMinMax(0, (TEAMS_IN_LEAGUES - 1) * 2);
          if (players[playerIndex].position === "Bramkarz") {
            pastStats.push({
              matches,
              goals,
              assists,
              yellowsCards: randomIntFromMinMax(0, ~~(matches / 4)),
              redCards: randomIntFromMinMax(0, ~~(matches / 15)),
              seasonId: pastSeasons[seasonIndex].id,
              playerId: players[playerIndex].id,
              teamId: players[playerIndex].teamId
            });
          } else if (players[playerIndex].position === "Obrońca") {
            pastStats.push({
              matches,
              goals: randomIntFromMinMax(0, ~~(matches / 10)),
              assists: randomIntFromMinMax(0, ~~(matches / 8)),
              yellowsCards: randomIntFromMinMax(0, ~~(matches / 3)),
              redCards: randomIntFromMinMax(0, ~~(matches / 9)),
              seasonId: pastSeasons[seasonIndex].id,
              playerId: players[playerIndex].id,
              teamId: players[playerIndex].teamId
            });
          } else if (players[playerIndex].position === "Pomocnik") {
            pastStats.push({
              matches,
              goals: randomIntFromMinMax(0, ~~(matches / 4)),
              assists: randomIntFromMinMax(0, ~~(matches / 2)),
              yellowsCards: randomIntFromMinMax(0, ~~(matches / 5)),
              redCards: randomIntFromMinMax(0, ~~(matches / 15)),
              seasonId: pastSeasons[seasonIndex].id,
              playerId: players[playerIndex].id,
              teamId: players[playerIndex].teamId
            });
          } else if (players[playerIndex].position === "Napastnik") {
            pastStats.push({
              matches,
              goals: randomIntFromMinMax(0, ~~(matches / 2)),
              assists: randomIntFromMinMax(0, ~~(matches / 3)),
              yellowsCards: randomIntFromMinMax(0, matches / 6),
              redCards: randomIntFromMinMax(0, matches / 15),
              seasonId: pastSeasons[seasonIndex].id,
              playerId: players[playerIndex].id,
              teamId: players[playerIndex].teamId
            });
          }
        }
      }
    }
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(PlayerSeasonStatistic)
      .values(pastStats)
      .execute();
  }

  async getStatsForPlayer(playerId: number) {
    const stats = await getConnection()
      .getRepository(PlayerSeasonStatistic)
      .find({ where: { playerId: playerId }, relations: ["season", "team"] });
    return stats;
  }
}

export default PlayerSeasonStatsService;
