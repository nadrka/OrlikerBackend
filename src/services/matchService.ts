import { getConnection } from "typeorm";
import { Request, Response } from "express";
import Player from "../models/player/player";
import Match from "../models/match/match";
import League from "../models/league";
import * as loadash from "lodash";
import TeamService from "./teamService";

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
    const teamService = new TeamService();
    const team = await teamService.getTeamForGivenId(teamID);
    const playedMatches = await matchRepository
      .createQueryBuilder("match")
      .where("(match.homeTeamId = :id OR match.awayTeamId = :id)")
      .andWhere("match.status = :status", { status: "Played" })
      .andWhere("match.league = :league", { league: team.currentLegueId })
      .setParameter("id", teamID)
      .getMany();
    return playedMatches;
  }

  async getUpcomingMatchesForLeague(league: League) {
    const matchRepository = await getConnection().getRepository(Match);
    let upcomingMatches = await matchRepository.find({
      league: league,
      status: "Upcoming"
    });

    return upcomingMatches;
  }

  async getPlayedMatchesForLeague(league: League) {
    const matchRepository = await getConnection().getRepository(Match);
    let playedMatches = await matchRepository.find({
      league: league,
      status: "Played"
    });
    return playedMatches;
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

    if (!match)
      return res.status(400).send("Match for given id does not exist!");
    match.homeTeamResult = req.body.homeTeamResult;
    match.awayTeamResult = req.body.awayTeamResult;

    getConnection().manager.save(match);
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
