import { Player } from "../models/player/player";
import { getConnection, DeepPartial } from "typeorm";
import { Request, Response } from "express";
import Team from "../models/team/team";
import PlayerService from "./playerService";
import loadash from "lodash";
import { Match } from "../models/match/match";
import LeagueService from "../services/leagueService";
import ExpectedError from "../utils/expectedError";
class TeamService {
  async createTeam(req: Request) {
    const { error } = Team.validateTeam(req.body);
    if (error) throw new ExpectedError(error.details[0].message, 400);

    const teamRepository = await getConnection().getRepository(Team);
    const teamFromRequestBody: DeepPartial<Team> = req.body;

    const teamWithName = await teamRepository.findOne({
      name: teamFromRequestBody.name
    });

    if (teamWithName) throw new ExpectedError("Team with given name already exists!", 400);

    const team = await teamRepository.create(teamFromRequestBody);

    const playerService = new PlayerService();
    const player = await playerService.getPlayerWithGivenID(req.body.captainId);

    const savedTeam = await getConnection().manager.save(team);

    player.team = savedTeam;
    player.teamId = savedTeam.id;
    playerService.updatePlayerWith(player);
    return team;
    // const playerService = new PlayerService();
    // const player = await playerService.getPlayerWithGivenID(senderId);
    // if (!player.teamId) {
    //   const teamRepository = await getConnection().getRepository(Team);
    //   let teamData = { captainId: senderId, name: req.body.name, currentLegueId: req.body.currentLegueId };
    //   const teamWithName = await teamRepository.findOne({
    //     name: teamData.name
    //   });
    //   if (teamWithName) throw new ExpectedError("Team with given name already exists!", 400);
    //   const team = await teamRepository.create(teamData);
    //   const { error } = Team.validateTeam(team);
    //   if (error) throw new ExpectedError(error.details[0].message, 400);
    //   await getConnection().manager.save(team);
    //   player.team = team;
    //   player.teamId = team.id;
    //   await playerService.updatePlayerWith(player);
    //   return team;
    // } else {
    //   throw new ExpectedError("User is in team already!", 400);
    // }
  }

  //do generowania bazy
  async createTeamWithoutToken(name: string, currentLeague: number) {
    const player = await getConnection()
      .getRepository(Player)
      .findOne({ where: { teamId: null } });
    const teamRepository = await getConnection().getRepository(Team);
    /* const teamWithName = await teamRepository.findOne({
      name: name
    });
    if (teamWithName) throw new ExpectedError("Team with given name already exists!", 400); */

    const team = await teamRepository.create({ name: name, currentLegueId: currentLeague, captainId: player.id });

    /* const { error } = Team.validateTeam(team);
    if (error) throw new ExpectedError(error.details[0].message, 400); */

    const playerService = new PlayerService();

    const savedTeam = await getConnection().manager.save(team);

    player.team = savedTeam;
    player.teamId = savedTeam.id;
    await playerService.updatePlayerWith(player);
    return team;
  }

  async getTeamsForGivenLeague(leagueID: number) {
    const teamRepository = await getConnection().getRepository(Team);
    const teams = await teamRepository.find({ currentLegueId: leagueID });
    return teams;
  }

  async getAllTeams() {
    const teamRepository = await getConnection().getRepository(Team);
    const teams = await teamRepository.find();

    var playerTeamStatistics = loadash(teams)
      .groupBy(t => t.currentLegueId)
      .map((teams, id) => ({
        league: +id,
        teams: teams
      }));

    return playerTeamStatistics;
  }

  async getTeam(teamID: number) {
    const teamRepository = await getConnection().getRepository(Team);
    const team = await teamRepository.findOne(
      { id: teamID },
      { relations: ["captain", "captain.user", "currentLegue"] }
    );
    //get position
    const leagueService = new LeagueService();
    const leagueTeams = await leagueService.getTeamsFromGivenLeague(team.currentLegueId);
    const position = leagueTeams.findIndex(elem => elem.id == teamID);
    const response = { ...team, position: position + 1 };
    /*let newestMatch;
    for(var i = 0; i<=team.matches; i++){
      if (!newestMatch)
      newestMatch = team.matches[i];
      else if (newestMatch < team.matches[i])
    }
    /*const playerService = new PlayerService();
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
    };*/
    return response;
  }

  async getTeamForGivenId(teamID: number) {
    const teamRepository = await getConnection().getRepository(Team);
    const team = await teamRepository.findOne({ id: teamID });
    return team;
  }

  async updateTeam(team: Team) {
    await getConnection().manager.save(team);
  }

  async updateTeamFromRequest(req: Request, senderId: number) {
    const playerService = new PlayerService();
    const player = await playerService.getPlayerWithGivenID(senderId);
    //console.log(player);
    const teamsRepository = await getConnection().getRepository(Team);
    const team = await teamsRepository.findOne({ id: player.teamId });
    if (!team) throw new ExpectedError("Team with given id does not exist", 400);
    if (team.captainId !== senderId) throw new ExpectedError("User is not captain of a team", 400);
    const teamWithName = await teamsRepository.findOne({ name: req.body.name });
    if (teamWithName) throw new ExpectedError("Team with given name already exist", 400);
    loadash.merge(team, req.body);
    await getConnection().manager.save(team);
    return team;
  }

  async deleteTeamWithGivenID(senderId: number) {
    const playerService = new PlayerService();
    const player = await playerService.getPlayerWithGivenID(senderId);
    const teamsRepository = await getConnection().getRepository(Team);
    const team = await teamsRepository.findOne({ id: player.teamId }, { relations: ["players"] });

    if (team.players.length > 1) throw new ExpectedError("Deleting team with more than one player is forbiden!", 400);
    if (!team) throw new ExpectedError("Team with given id does not exist", 400);

    player.teamId = null;
    await getConnection().manager.save(player);
    await getConnection().manager.remove(team);
  }
}

export default TeamService;
