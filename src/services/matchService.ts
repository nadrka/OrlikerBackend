import { getConnection } from "typeorm";
import { Request, Response } from "express";
import { MatchResult } from "./../models/match/matchResult";
import Player from "../models/player/player";
import Match from "../models/match/match";
import League from "../models/league";
import * as _ from "lodash";
class MatchService {
  async createMatch(req: Request, res: Response) {
    const { error } = Match.validateMatch(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.create(req.body);
    res.send(match);
  }

  async createMatchResult(req: Request, res: Response) {
    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.findOne({ id: req.params.id });
    if (!match)
      return res.status(400).send("Match for given id does not exist!");

    const { error } = MatchResult.validateMatchResult(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const matchResultRepository = await getConnection().getRepository(
      MatchResult
    );
    const matchResult = await matchResultRepository.create(req.body);
    match.result = _.head(matchResult);

    res.send(matchResult);
  }

  async getMatchForGivenID(matchID: number, res: Response) {
    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.findOne({ id: matchID });

    if (!match)
      return res.status(400).send("Match for given id does not exist!");

    res.send(match);
  }

  async getUpcomingMatchesForTeam(teamID: number) {
    const matchRepository = await getConnection().getRepository(Match);
    const upcomingMatches = await matchRepository
      .createQueryBuilder("match")
      .where("match.homeTeamId = :id", { id: teamID })
      .orWhere("match.awayTeamId = :id", { id: teamID })
      .andWhere("match.status = :status", { status: "Upcoming" })
      .getMany();
    return upcomingMatches;
  }

  async getPlayedMatchesForTeam(teamID: number) {
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

  async getMatchResult(matchResultID: number) {
    const matchResultRepository = await getConnection().getRepository(
      MatchResult
    );
    const matchResult = await matchResultRepository.findOne({
      id: matchResultID
    });
    return matchResult;
  }

  async updateMatch(match: Match) {}

  async updateMatchResult(matchID: number, req: Request) {}

  async deleteMatch(req: Request, res: Response) {
    const matchRepository = await getConnection().getRepository(Match);
    const match = await matchRepository.findOne({ id: req.params.id });

    if (!match)
      return res.status(404).send("Match with given id does not exist");

    await getConnection().manager.remove(match);
  }
}

export default MatchService;
