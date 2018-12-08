import { Invitation } from "./../models/invitation";
import { getConnection } from "typeorm";
import { Request, Response } from "express";
import * as loadash from "lodash";
import { League } from "../models/league";
import PlayerService from "./playerService";
import TeamService from "./teamService";
import ExpectedError from "../utils/expectedError";

class InvitationService {
  playerService = new PlayerService();
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

    await getConnection().manager.save(invitation);

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
    return true;
  }

  async acceptInvitation(req: Request) {
    const invitationReposistory = await getConnection().getRepository(Invitation);
    const invitation = await invitationReposistory.findOne({
      id: req.params.id
    });
    console.log(invitation);
    if (!invitation) {
      console.log("bebe");
      throw new ExpectedError("Invitation with given id does not exists!", 400);
    }

    const playerService = new PlayerService();
    const player = await playerService.getPlayerWithGivenID(invitation.playerId);

    const teamService = new TeamService();
    const team = await teamService.getTeamForGivenId(invitation.teamId);

    player.teamId = invitation.teamId;
    player.team = team;
    playerService.updatePlayerWith(player);
    await getConnection().manager.remove(invitation);
  }

  async getInvitationForTeam(req: Request) {
    const teamService = new TeamService();
    const team = await teamService.getTeam(req.params.id);

    if (!team) {
      throw new ExpectedError("Team with given id does not exists!", 400);
    }

    const invitationReposistory = await getConnection().getRepository(Invitation);

    const teamInvitations = await invitationReposistory.find({
      teamId: req.params.id,
      requestType: "player"
    });

    const mappedInvitations = await Promise.all(
      teamInvitations.map(async invitation => {
        const player = await this.playerService.getPlayerWithGivenID(invitation.playerId);
        return {
          id: invitation.id,
          player: {
            id: invitation.playerId,
            firstName: player.user.firstName,
            secondName: player.user.secondName,
            number: player.number,
            imgURL: player.user.imgURL
          }
        };
      })
    );

    return mappedInvitations;
  }

  async getInvitationsForPlayer(playerId: number) {
    const playerService = new PlayerService();
    const player = await playerService.getPlayerWithGivenID(playerId);
    if (!player) {
      throw new ExpectedError("Team with given id does not exists!", 400);
    }

    const invitationReposistory = await getConnection().getRepository(Invitation);

    const teamInvitations = await invitationReposistory.find({
      where: { playerId: playerId, requestType: "team" },
      relations: ["team"]
    });

    const mappedInvitations = teamInvitations.map(invitation => {
      return {
        id: invitation.id,
        team: {
          id: invitation.teamId,
          name: invitation.team.name,
          league: invitation.team.currentLegueId,
          imgURL: invitation.team.imgURL
        }
      };
    });
    return mappedInvitations;
  }

  async getAllInvitaitons() {
    const invitationReposistory = await getConnection().getRepository(Invitation);
    const invitations = await invitationReposistory.find();

    return invitations;
  }
}

export default InvitationService;
