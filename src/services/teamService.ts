import { getConnection, DeepPartial } from "typeorm";
import { Request, Response } from "express";
import Team from "../models/team/team";
import PlayerService from "./playerService";
import * as loadash from "lodash";
class TeamService {
  async createTeam(req: Request, res: Response) {
    const { error } = Team.validateTeam(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const teamRepository = await getConnection().getRepository(Team);
    const teamFromRequestBody: DeepPartial<Team> = req.body;

    const teamWithName = await teamRepository.findOne({
      name: teamFromRequestBody.name
    });

    if (teamWithName)
      return res.status(400).send("Team with given name already exists!");

    const team = await teamRepository.create(teamFromRequestBody);

    const playerService = new PlayerService();
    const player = await playerService.getPlayerWithGivenID(req.body.captainId);

    const savedTeam = await getConnection().manager.save(team);

    player.team = savedTeam;
    player.teamId = savedTeam.id;
    playerService.updatePlayerWith(player);
    res.send(team);
  }

  async getTeamsForGivenLeague(leagueID: number) {
    const teamRepository = await getConnection().getRepository(Team);
    const teams = await teamRepository.find({ currentLegueId: leagueID });
    return teams;
  }

  async getAllTeams() {
    const teamRepository = await getConnection().getRepository(Team);
    const teams = await teamRepository.find();
    return teams;
  }

  async getTeam(teamID: number) {
    const teamRepository = await getConnection().getRepository(Team);
    const team = await teamRepository.findOne({ id: teamID });
    const playerService = new PlayerService();
    const captain = await playerService.getPlayerWithGivenID(team.captainId);
    const data = {
      id: team.id,
      name: team.name,
      currentLeagueId: team.currentLegueId,
      imgUrl: team.imgURL,
      captain: {
        id: captain.id,
        firstName: captain.user.firstName,
        secondName: captain.user.secondName
      }
      //todo: dodać liczbę zwyciestw
    };
    return data;
  }

  async getTeamForGivenId(teamID: number) {
    const teamRepository = await getConnection().getRepository(Team);
    const team = await teamRepository.findOne({ id: teamID });
    return team;
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
    loadash.merge(team, req.body);
    await getConnection().manager.save(team);
    res.send(team);
  }

  async deleteTeamWithGivenID(req: Request, res: Response) {
    const teamsRepository = await getConnection().getRepository(Team);
    const team = await teamsRepository.findOne({ id: req.params.id });

    if (!team) return res.status(404).send("Team with given id does not exist");

    await getConnection().manager.remove(team);
  }
}

export default TeamService;
