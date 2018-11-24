import { Invitation } from "./../models/invitation";
import { getConnection } from "typeorm";
import { Request, Response } from "express";
import * as loadash from "lodash";
import { League } from "../models/league";
import PlayerService from "./playerService";
import TeamService from "./teamService";

class InvitationService {
  async createInvitation(req: Request, res: Response) {
    const { error } = Invitation.validateInvitation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const playerService = new PlayerService();
    const player = await playerService.getPlayerWithGivenID(req.body.playerId);
    if (!player) {
      return res.status(400).send("Player with given id does not exists!");
    }

    const teamService = new TeamService();
    const team = await teamService.getTeam(req.body.teamId);

    if (!team) {
      return res.status(400).send("Team with given id does not exists!");
    }
    const invitationReposistory = await getConnection().getRepository(
      Invitation
    );
    const invitation = await invitationReposistory.create(req.body);
    res.send(invitation);
  }

  async rejectInvitation(req: Request, res: Response) {
    const invitationReposistory = await getConnection().getRepository(
      Invitation
    );
    const invitation = await invitationReposistory.findOne({
      id: req.params.id
    });

    if (!invitation) {
      return res.status(400).send("Invitation with given id does not exists!");
    }

    await getConnection().manager.remove(invitation);
  }

  async acceptInvitation(req: Request, res: Response) {
    const invitationReposistory = await getConnection().getRepository(
      Invitation
    );
    const invitation = await invitationReposistory.findOne({
      id: req.params.id
    });

    if (!invitation) {
      return res.status(400).send("Invitation with given id does not exists!");
    }

    const playerService = new PlayerService();
    const player = await playerService.getPlayerWithGivenID(invitation.id);
    const teamService = new TeamService();
    const team = await teamService.getTeamForGivenId(invitation.id);
    player.teamId = invitation.teamId;
    player.team = team;
    playerService.updatePlayerWith(player);
  }

  async getInvitationForTeam(req: Request, res: Response) {
    const teamService = new TeamService();
    const team = await teamService.getTeam(req.params.id);

    if (!team) {
      return res.status(400).send("Team with given id does not exists!");
    }

    const invitationReposistory = await getConnection().getRepository(
      Invitation
    );

    const teamInvitations = invitationReposistory.find({
      teamId: req.params.id
    });

    return teamInvitations;
  }
}

export default InvitationService;
