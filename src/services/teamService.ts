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

    const teamWithName = await teamRepository.find({
      name: teamFromRequestBody.name
    });

    if (teamWithName)
      return res.status(400).send("Team with given name already exists!");

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

  async getTeam(teamID: number, res: Response) {
    const teamRepository = await getConnection().getRepository(Team);
    const team = await teamRepository.findOne({ id: teamID });
    if (team)
      return res.status(400).send("Team with given id does not exists!");

    res.send(team);
  }

  async updateTeam(team: Team) {
    await getConnection().manager.save(team);
  }

  async updateTeamFromRequest(req: Request, res: Response) {
    const teamsRepository = await getConnection().getRepository(Team);
    const team = await teamsRepository.findOne({ id: req.params.id });
    if (!team) return res.status(404).send("Team with given id does not exist");
    const teamWithName = await teamsRepository.findOne({ name: req.body.name });
    if (teamWithName)
      return res.status(404).send("Team with given name already exist");
    team.name = req.body.name;
    team.imgURL = req.body.imgURL;
    team.captainId = team.captainId;
    await getConnection().manager.save(team);
  }

  async deleteTeamWithGivenID(req: Request, res: Response) {
    const teamsRepository = await getConnection().getRepository(Team);
    const team = await teamsRepository.findOne({ id: req.params.id });

    if (!team) return res.status(404).send("Team with given id does not exist");

    await getConnection().manager.remove(team);
  }
}

export default TeamService;
