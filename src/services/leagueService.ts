import { getConnection } from "typeorm";
import { Request, Response } from "express";
import * as loadash from "lodash";
import { League } from "../models/league";
import ExpectedError from "../utils/expectedError";

class LeagueService {
  async createLeague(req: Request) {
    const { error } = League.validateLeague(req.body);
    if (error) throw new ExpectedError(error.details[0].message, 400);

    const leagueRepository = await getConnection().getRepository(League);
    const league = await leagueRepository.create(req.body);
    await getConnection().manager.save(league);
    return league;
  }

  async getLeagues() {
    const leagues = await getConnection().manager.find(League);
    return leagues;
  }

  async getTeamsFromGivenLeague(leagueID: number) {
    const leaguesRepository = await getConnection().getRepository(League);
    const league = await leaguesRepository.findOne({ id: leagueID }, { relations: ["teams"] });

    if (!league) throw new ExpectedError("League with given id does not exist", 400);

    let teams = league.teams;
    let sortedTeams = loadash.orderBy(
      teams,
      [
        "points",
        team => {
          team.scoredGoals - team.concedeGoals;
        }
      ],
      ["desc", "desc"]
    );

    return sortedTeams;
  }

  async updateLeague(req: Request) {
    const leagueRepository = await getConnection().getRepository(League);
    const league = await leagueRepository.findOne({ id: req.params.id });
    if (!league) throw new ExpectedError("League with given id does not exist", 400);
    loadash.merge(league, req.body);

    await getConnection().manager.save(league);
    return league;
  }

  async deleteLeagueWithGivenID(leagueID: number) {
    const leaguesRepository = await getConnection().getRepository(League);
    const league = await leaguesRepository.findOne({ id: leagueID });

    if (!league) throw new ExpectedError("League with given id does not exist", 400);

    await getConnection().manager.remove(league);
  }
}

export default LeagueService;
