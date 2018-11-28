import { getConnection } from "typeorm";
import { Request, Response } from "express";
import * as loadash from "lodash";
import { League } from "../models/league";

class LeagueService {
  async createLeague(req: Request, res: Response) {
    const { error } = League.validateLeague(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const leagueRepository = await getConnection().getRepository(League);
    const league = await leagueRepository.create(req.body);
    await getConnection().manager.save(league);
    return league;
  }

  async getLeagues() {
    const leagues = await getConnection().manager.find(League);
    return leagues;
  }

  async getTeamsFromGivenLeague(leagueID: number, res: Response) {
    const leaguesRepository = await getConnection().getRepository(League);
    const league = await leaguesRepository.findOne({ id: leagueID }, { relations: ["teams"] });

    if (!league) return res.status(404).send("League with given id does not exist");

    return league.teams;
  }

  async updateLeague(req: Request, res: Response) {
    const leagueRepository = await getConnection().getRepository(League);
    const league = await leagueRepository.findOne({ id: req.params.id });
    if (!leagueRepository) return res.status(404).send("League with given id does not exist");
    loadash.merge(league, req.body);

    await getConnection().manager.save(league);
    return league;
  }

  async deleteLeagueWithGivenID(leagueID: number, res: Response) {
    const leaguesRepository = await getConnection().getRepository(League);
    const league = await leaguesRepository.findOne({ id: leagueID });

    if (!league) return res.status(404).send("League with given id does not exist");

    await getConnection().manager.remove(league);
  }
}

export default LeagueService;
