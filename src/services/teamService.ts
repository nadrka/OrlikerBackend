import { getConnection, DeepPartial } from "typeorm";
import { Request, Response } from "express";
import Team from "../models/team/team";
import PlayerService from "./playerService";

class TeamService {
  async createTeam(req: Request, res: Response) {
    const { error } = Team.validateTeam(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const teamRepository = await getConnection().getRepository(Team);
    const teamFromRequestBody: DeepPartial<Team> = req.body;
    const team = await teamRepository.create(teamFromRequestBody);

    await getConnection().manager.save(team);
    res.send(team);
  }

  async getTeamsForGivenLeague() {
    const teamRepository = await getConnection().getRepository(Team);
  }

  async getAllTeams() {
    const teamRepository = await getConnection().getRepository(Team);
    const teams = await teamRepository.find();
    return teams;
  }

  async deletePlayerWithGivenID(req: Request, res: Response, playerID: number) {
    const teamsRepository = await getConnection().getRepository(Team);
    const team = await teamsRepository.findOne({ id: req.params.id });

    if (!team) return res.status(404).send("Team with given id does not exist");

    await getConnection().manager.remove(team);
  }
}

export default TeamService;
