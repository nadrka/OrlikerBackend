import { getConnection } from "typeorm";
import { Request, Response } from "express";
import * as loadash from "lodash";
import { League } from "../models/league";
import ExpectedError from "../utils/expectedError";
import SeasonService from "../services/seasonService";
import { Season } from "../models/season";

class LeagueService {
  async createLeague() {
    const seasonService = new SeasonService();
    const season = await seasonService.getCurrentSeason();
    //console.log(season);
    const leagues = await getConnection()
      .getRepository(League)
      .find({
        relations: ["season"],
        where: { seasonId: season.id },
        order: { leagueNumber: "DESC" },
        skip: 0,
        take: 1
      });
    let leagueNumber = 1;
    if (leagues[0]) leagueNumber = leagues[0].leagueNumber + 1;
    const leagueRepository = await getConnection().getRepository(League);
    let league = new League();
    league.season = season;
    league.leagueNumber = leagueNumber;
    //const league = await leagueRepository.create({ leagueNumber: leagueNumber, season: season });
    // const { error } = League.validateLeague(league);
    // if (error) throw new ExpectedError(error.details[0].message, 400);
    const leagueToReturn = await getConnection().manager.save(league);
    return leagueToReturn;
  }

  async generateLeaguesForSeason(numberOfLeagues: number, season: Season) {
    let leagueArray = [];
    for (var index = 0; index < numberOfLeagues; index++) {
      leagueArray.push({ leagueNumber: index + 1, season: season });
    }
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(League)
      .values(leagueArray)
      .execute();
  }

  async getLeagues() {
    const seasonService = new SeasonService();
    const season = await seasonService.getCurrentSeason();
    const leagues = await getConnection()
      .getRepository(League)
      .find({ relations: ["season"], where: { season: season } });
    return leagues;
  }

  async getWeakestLeague() {
    const seasonService = new SeasonService();
    const season = await seasonService.getCurrentSeason();
    const leagues = await getConnection()
      .getRepository(League)
      .find({ relations: ["season"], where: { season: season }, order: { leagueNumber: "DESC" }, skip: 0, take: 1 });
    return leagues[0];
  }

  async getTeamsWithoutSort(leagueID: number) {
    const leaguesRepository = await getConnection().getRepository(League);
    const league = await leaguesRepository.findOne({ id: leagueID }, { relations: ["teams"] });

    if (!league) throw new ExpectedError("League with given id does not exist", 400);

    let teams = league.teams;

    return teams;
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
        // "scoredGoals"
        team => {
          return team.scoredGoals - team.concedeGoals;
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
