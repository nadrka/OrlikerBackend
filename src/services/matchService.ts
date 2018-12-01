import { getConnection } from "typeorm";
import { Request, Response } from "express";
import Player from "../models/player/player";
import Match from "../models/match/match";
import League from "../models/league";
import * as loadash from "lodash";
import TeamService from "./teamService";
import { Team } from "../models/team/team";

class MatchService {
  async createMatch(req: Request, res: Response) {
    const { error } = Match.validateMatch(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.create(req.body);
    await getConnection().manager.save(match);
    res.send(match);
  }

  async getMatchForGivenID(matchID: number) {
    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.findOne({ id: matchID });

    return match;
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
      leagueId: leagueID,
      status: "Upcoming"
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
      status: "Played",
      leagueId: leagueID
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

  async updateMatchWithRequestBody(req: Request, res: Response) {
    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.findOne({ id: req.params.id });

    if (!match)
      return res.status(400).send("Match for given id does not exist!");
    const reqBody = req.body;
    loadash.merge(match, reqBody);
    res.send(match);
  }

  async updateMatchResult(req: Request, res: Response) {
    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.findOne({ id: req.params.id });
    const teamRepository = await getConnection().getRepository(Team);
    const homeTeam = await teamRepository.findOne(match.homeTeamId);
    const awayTeam = await teamRepository.findOne(match.awayTeamId);
    if (!match)
      return res.status(400).send("Match for given id does not exist!");
    match.homeTeamResult = req.body.homeTeamResult;
    match.awayTeamResult = req.body.awayTeamResult;
    match.status = req.body.status;
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
    res.send(match);
  }

  async deleteMatch(req: Request, res: Response) {
    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.findOne({ id: req.params.id });

    if (!match)
      return res.status(404).send("Match with given id does not exist");

    await getConnection().manager.remove(match);
  }
}

export default MatchService;
