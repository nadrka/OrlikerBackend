import { getConnection } from "typeorm";
import { Request, Response } from "express";
import { MatchResult } from "./../models/match/matchResult";
import Player from "../models/player/player";
import Match from "../models/match/match";
import League from "../models/league";
// var loadash = require("lodash");
class MatchService {
  async createMatch(req: Request, res: Response) {
    const { error } = Match.validateMatch(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.create(req.body);
    res.send(match);
  }

  async createMatchResult(matchID: number) {}

  async getUpcomingMatches(teamID: number) {
    const matchRepository = await getConnection().getRepository(Match);
    const upcomingMatches = await matchRepository
      .createQueryBuilder("match")
      .where("match.homeTeamId = :id", { id: teamID })
      .orWhere("match.awayTeamId = :id", { id: teamID })
      .andWhere("match.status = :status", { status: "Upcoming" })
      .getMany();
    return upcomingMatches;
  }

  async getPlayedMatches(teamID: number) {
    const matchRepository = await getConnection().getRepository(Match);
    const playedMatches = await matchRepository
      .createQueryBuilder("match")
      .where("match.homeTeamId = :id", { id: teamID })
      .orWhere("match.awayTeamId = :id", { id: teamID })
      .andWhere("match.status = :status", { status: "Played" })
      .getMany();
    return playedMatches;
  }

  async getUpcomingMatchesForLeague(league: League) {
    const matchRepository = await getConnection().getRepository(Match);
    let upcomingMatches = await matchRepository.find({ league: league });
    upcomingMatches = upcomingMatches.filter(match => {
      match.status == "Upcoming";
    });
    return upcomingMatches;
  }

  async getPlayedMatchesForLeague(league: League) {
    const matchRepository = await getConnection().getRepository(Match);
    let playedMatches = await matchRepository.find({ league: league });
    playedMatches = playedMatches.filter(match => {
      match.status == "Played";
    });
    return playedMatches;
  }

  async updateMatch(match: Match) {}

  async updateMatchResult(matchID: number, matchResult: MatchResult) {}

  async deleteMatch(matchID: number) {}
}

export default MatchService;
