import { Invitation } from "./../models/invitation";
import { getConnection } from "typeorm";
import { Request, Response } from "express";
import * as loadash from "lodash";
import { League } from "../models/league";
import PlayerService from "./playerService";
import TeamService from "./teamService";
import ExpectedError from "../utils/expectedError";

class InvitationService {
  async createInvitation(req: Request) {
    const { error } = Invitation.validateInvitation(req.body);
    if (error) throw new ExpectedError(error.details[0].message, 400);

    const playerService = new PlayerService();
    const player = await playerService.getPlayerWithGivenID(req.body.playerId);
    if (!player) {
    }

    const teamService = new TeamService();
    const team = await teamService.getTeam(req.body.teamId);

    if (!team) {
      throw new ExpectedError("Team with given id does not exists!", 400);
    }
    const invitationReposistory = await getConnection().getRepository(Invitation);
    const invitation = await invitationReposistory.create(req.body);
    return invitation;
  }

  async rejectInvitation(req: Request) {
    const invitationReposistory = await getConnection().getRepository(Invitation);
    const invitation = await invitationReposistory.findOne({
      id: req.params.id
    });

    if (!invitation) {
      throw new ExpectedError("Invitation with given id does not exists!", 400);
    }

    await getConnection().manager.remove(invitation);
  }

  async acceptInvitation(req: Request) {
    const invitationReposistory = await getConnection().getRepository(Invitation);
    const invitation = await invitationReposistory.findOne({
      id: req.params.id
    });

    if (!invitation) {
      throw new ExpectedError("Invitation with given id does not exists!", 400);
    }

    const playerService = new PlayerService();
    const player = await playerService.getPlayerWithGivenID(invitation.id);
    const teamService = new TeamService();
    const team = await teamService.getTeamForGivenId(invitation.id);
    player.teamId = invitation.teamId;
    player.team = team;
    playerService.updatePlayerWith(player);
  }

  async getInvitationForTeam(req: Request) {
    const teamService = new TeamService();
    const team = await teamService.getTeam(req.params.id);

    if (!team) {
      throw new ExpectedError("Team with given id does not exists!", 400);
    }

    const invitationReposistory = await getConnection().getRepository(Invitation);

    const teamInvitations = invitationReposistory.find({
      teamId: req.params.id
    });

    return teamInvitations;
  }

  async getInvitationsForPlayer(playerId: number) {
    const playerService = new PlayerService();
    const player = await playerService.getPlayerWithGivenID(playerId);
    if (!player) {
      throw new ExpectedError("Team with given id does not exists!", 400);
    }

    const invitationReposistory = await getConnection().getRepository(Invitation);

    const teamInvitations = invitationReposistory.find({ playerId: playerId });

    return teamInvitations;
  }
}

export default InvitationService;
