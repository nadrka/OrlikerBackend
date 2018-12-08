import { getConnection } from "typeorm";
import { Request, Response } from "express";
import Player from "../models/player/player";
import Match from "../models/match/match";
import League from "../models/league";
import * as loadash from "lodash";
import TeamService from "./teamService";
import { Team } from "../models/team/team";
import LeagueService from "./leagueService";
import ExpectedError from "../utils/expectedError";

class MatchService {
  async createMatch(req: Request) {
    // const senderTeam = await getConnection()
    //   .getRepository(Team)
    //   .findOne({ captainId: req.body.captainId });
    // if (!senderTeam)
    //   throw new ExpectedError("User is not captain of any team", 400);
    let matchData = {
      status: "ToAccept",
      homeTeamId: req.body.homeTeamId,
      awayTeamId: req.body.awayTeamId,
      matchDate: req.body.matchDate,
      placeId: req.body.placeId,
      leagueId: req.body.leagueId,
      refereeId: req.body.refereeId
    };
    console.log(matchData);
    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.create(matchData);

    const { error } = Match.validateMatch(match);
    if (error) throw new ExpectedError(error.details[0].message, 400);
    await getConnection().manager.save(match);
    return match;
  }

  async getSentMatchInvites(senderId: number) {
    const senderPlayer = await getConnection()
      .getRepository(Player)
      .findOne(senderId, { relations: ["captainTeam"] });
    if (senderPlayer.captainTeam !== null) {
      const matches = await getConnection()
        .getRepository(Match)
        .find({ where: { homeTeamId: senderPlayer.captainTeam.id, status: "ToAccept" }, relations: ["awayTeam"] });
      let toReturn = matches.map(value => {
        return {
          place: value.place,
          id: value.id,
          date: value.matchDate,
          teamName: value.awayTeam.name,
          imgURL: value.awayTeam.imgURL
        };
      });
      return toReturn;
    } else {
      throw new ExpectedError("User is not captain of any team!", 400);
    }
  }

  async getReceivedMatchInvites(senderId: number) {
    const senderPlayer = await getConnection()
      .getRepository(Player)
      .findOne(senderId, { relations: ["captainTeam"] });
    if (senderPlayer.captainTeam !== null) {
      const matches = await getConnection()
        .getRepository(Match)
        .find({ where: { awayTeamId: senderPlayer.captainTeam.id, status: "ToAccept" }, relations: ["homeTeam"] });
      let toReturn = matches.map(value => {
        return {
          place: value.place,
          id: value.id,
          date: value.matchDate,
          teamName: value.homeTeam.name,
          imgURL: value.homeTeam.imgURL
        };
      });
      return toReturn;
    } else {
      throw new ExpectedError("User is not captain of any team!", 400);
    }
  }

  async acceptMatchInvite(senderId: number, matchId: number) {
    const match = await getConnection()
      .getRepository(Match)
      .findOne(matchId);
    const senderPlayer = await getConnection()
      .getRepository(Player)
      .findOne(senderId, { relations: ["captainTeam"] });
    if (match.awayTeamId == senderPlayer.captainTeam.id && match.status === "ToAccept") {
      match.status = "Upcoming";
      await getConnection().manager.save(match);
    } else {
      throw new ExpectedError("Wrong parameters!", 400);
    }
  }

  async cancelMatchInvite(senderId: number, matchId: number) {
    const match = await getConnection()
      .getRepository(Match)
      .findOne(matchId);
    const senderPlayer = await getConnection()
      .getRepository(Player)
      .findOne(senderId, { relations: ["captainTeam"] });
    if (
      (match.homeTeamId == senderPlayer.captainTeam.id || match.awayTeamId == senderPlayer.captainTeam.id) &&
      match.status === "ToAccept"
    ) {
      match.status = "Declined";
      await getConnection().manager.save(match);
    } else {
      throw new ExpectedError("Wrong parameters!", 400);
    }
  }

  async getMatchForGivenID(matchID: number) {
    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.findOne(
      { id: matchID },
      { relations: ["homeTeam", "awayTeam", "referee", "place"] }
    );

    const leagueService = new LeagueService();
    const leagueTeams = await leagueService.getTeamsFromGivenLeague(match.homeTeam.currentLegueId);
    const homeTeamPosition = leagueTeams.findIndex(elem => elem.id == match.homeTeamId);
    const leagueTeams2 = await leagueService.getTeamsFromGivenLeague(match.awayTeam.currentLegueId);
    const awayTeamPosition = leagueTeams2.findIndex(elem => elem.id == match.awayTeamId);

    return {
      homeTeam: {
        id: match.homeTeamId,
        name: match.homeTeam.name,
        result: match.homeTeamResult,
        position: homeTeamPosition + 1
      },
      awayTeam: {
        id: match.awayTeamId,
        name: match.awayTeam.name,
        result: match.awayTeamResult,
        position: awayTeamPosition + 1
      },
      place: match.place.place,
      status: match.status,
      matchDate: match.matchDate,
      acceptMatchDate: match.acceptMatchDate,
      leagueId: match.leagueId,
      referee: {
        id: match.refereeId,
        firstName: match.referee.firstName,
        secondName: match.referee.secondName
      }
    };
  }

  async getUpcomingMatchesForTeam(teamID: number) {
    const matchRepository = await getConnection().getRepository(Match);
    const teamService = new TeamService();
    const team = await teamService.getTeamForGivenId(teamID);
    const upcomingMatches = await matchRepository
      .createQueryBuilder("match")
      .where("(match.homeTeamId = :id OR match.awayTeamId = :id)")
      .andWhere("match.status = :status", { status: "Upcoming" })
      .andWhere("match.league = :league", { league: team.currentLegueId })
      .setParameter("id", teamID)
      .orderBy("match.matchDate", "ASC")
      .getMany();

    const data = await Promise.all(
      upcomingMatches.map(async match => {
        const homeTeam = await teamService.getTeamForGivenId(match.homeTeamId);
        const awayTeam = await teamService.getTeamForGivenId(match.awayTeamId);
        return {
          id: match.id,
          matchDate: match.matchDate,
          leagueId: match.leagueId,
          homeTeam: {
            id: homeTeam.id,
            name: homeTeam.name,
            imgURL: homeTeam.imgURL,
            result: match.homeTeamResult
          },
          awayTeam: {
            id: awayTeam.id,
            name: awayTeam.name,
            imgURL: awayTeam.imgURL,
            result: match.awayTeamResult
          }
        };
      })
    );
    return data;
  }

  async getPlayedMatchesForTeam(teamID: number) {
    const matchRepository = await getConnection().getRepository(Match);
    const teamService = new TeamService();
    const team = await teamService.getTeamForGivenId(teamID);
    const playedMatches = await matchRepository
      .createQueryBuilder("match")
      .where("(match.homeTeamId = :id OR match.awayTeamId = :id)")
      .andWhere("match.status = :status", { status: "Played" })
      .andWhere("match.league = :league", { league: team.currentLegueId })
      .setParameter("id", teamID)
      .orderBy("match.matchDate", "DESC")
      .getMany();

    const data = await Promise.all(
      playedMatches.map(async match => {
        const homeTeam = await teamService.getTeamForGivenId(match.homeTeamId);
        const awayTeam = await teamService.getTeamForGivenId(match.awayTeamId);
        return {
          id: match.id,
          matchDate: match.matchDate,
          leagueId: match.leagueId,
          homeTeam: {
            id: homeTeam.id,
            name: homeTeam.name,
            imgURL: homeTeam.imgURL,
            result: match.homeTeamResult
          },
          awayTeam: {
            id: awayTeam.id,
            name: awayTeam.name,
            imgURL: awayTeam.imgURL,
            result: match.awayTeamResult
          }
        };
      })
    );
    return data;
  }

  async getUpcomingMatchesForLeague(leagueID: number) {
    const matchRepository = await getConnection().getRepository(Match);

    let upcomingMatches = await matchRepository.find({
      where: { leagueId: leagueID, status: "Upcoming" },
      order: {
        matchDate: "ASC"
      }
    });
    const teamService = new TeamService();

    const data = await Promise.all(
      upcomingMatches.map(async match => {
        const homeTeam = await teamService.getTeamForGivenId(match.homeTeamId);
        const awayTeam = await teamService.getTeamForGivenId(match.awayTeamId);
        return {
          id: match.id,
          matchDate: match.matchDate,
          leagueId: match.leagueId,
          homeTeam: {
            id: homeTeam.id,
            name: homeTeam.name,
            imgURL: homeTeam.imgURL,
            result: match.homeTeamResult
          },
          awayTeam: {
            id: awayTeam.id,
            name: awayTeam.name,
            imgURL: awayTeam.imgURL,
            result: match.awayTeamResult
          }
        };
      })
    );
    return data;
  }

  async getPlayedMatchesForLeague(leagueID: number) {
    const matchRepository = await getConnection().getRepository(Match);
    let playedMatches = await matchRepository.find({
      where: { status: "Played", leagueId: leagueID },
      order: {
        matchDate: "DESC"
      }
    });

    const teamService = new TeamService();

    const data = await Promise.all(
      playedMatches.map(async match => {
        const homeTeam = await teamService.getTeamForGivenId(match.homeTeamId);
        const awayTeam = await teamService.getTeamForGivenId(match.awayTeamId);
        return {
          id: match.id,
          matchDate: match.matchDate,
          leagueId: match.leagueId,
          homeTeam: {
            id: homeTeam.id,
            name: homeTeam.name,
            imgURL: homeTeam.imgURL,
            result: match.homeTeamResult
          },
          awayTeam: {
            id: awayTeam.id,
            name: awayTeam.name,
            imgURL: awayTeam.imgURL,
            result: match.awayTeamResult
          }
        };
      })
    );
    return data;
  }

  async updateMatch(match: Match) {
    await getConnection().manager.save(match);
    return match;
  }

  async updateMatchWithRequestBody(req: Request) {
    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.findOne({ id: req.params.id });
    console.log(match);
    if (!match) throw new ExpectedError("Match for given id does not exist!", 400);
    const reqBody = req.body;
    loadash.merge(match, reqBody);
    console.log(match.id);
    await getConnection().manager.save(match);
    return match;
  }

  async updateMatchResult(req: Request) {
    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.findOne({ id: req.params.id });
    const teamRepository = await getConnection().getRepository(Team);
    const homeTeam = await teamRepository.findOne(match.homeTeamId);
    const awayTeam = await teamRepository.findOne(match.awayTeamId);
    if (!match) throw new ExpectedError("Match for given id does not exist!", 400);
    if (match.homeTeamResult != null && match.awayTeamResult != null) {
      homeTeam.matches--;
      awayTeam.matches--;
      homeTeam.concedeGoals -= match.awayTeamResult;
      homeTeam.scoredGoals -= match.homeTeamResult;
      awayTeam.concedeGoals -= match.homeTeamResult;
      awayTeam.scoredGoals -= match.awayTeamResult;
      if (match.homeTeamResult > match.awayTeamResult) {
        homeTeam.points -= 3;
        homeTeam.wins--;
        awayTeam.loses--;
      } else if (match.homeTeamResult < match.awayTeamResult) {
        awayTeam.points -= 3;
        awayTeam.wins--;
        homeTeam.loses--;
      } else {
        homeTeam.draws--;
        homeTeam.points--;
        awayTeam.draws--;
        awayTeam.points--;
      }
    }
    match.homeTeamResult = req.body.homeTeamResult;
    match.awayTeamResult = req.body.awayTeamResult;
    match.status = "Played";
    homeTeam.matches++;
    awayTeam.matches++;
    homeTeam.concedeGoals += req.body.awayTeamResult;
    homeTeam.scoredGoals += req.body.homeTeamResult;
    awayTeam.concedeGoals += req.body.homeTeamResult;
    awayTeam.scoredGoals += req.body.awayTeamResult;
    if (req.body.homeTeamResult > req.body.awayTeamResult) {
      homeTeam.points += 3;
      homeTeam.wins++;
      awayTeam.loses++;
    } else if (req.body.homeTeamResult < req.body.awayTeamResult) {
      awayTeam.points += 3;
      awayTeam.wins++;
      homeTeam.loses++;
    } else {
      homeTeam.draws++;
      homeTeam.points++;
      awayTeam.draws++;
      awayTeam.points++;
    }

    await getConnection().manager.save(match);
    await getConnection().manager.save(homeTeam);
    await getConnection().manager.save(awayTeam);
    return match;
  }

  async deleteMatch(req: Request) {
    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.findOne({ id: req.params.id });

    if (!match) throw new ExpectedError("Match for given id does not exist!", 400);

    await getConnection().manager.remove(match);
  }
}

export default MatchService;
