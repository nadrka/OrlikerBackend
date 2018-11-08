import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import Joi from "joi";
import Team from "../team/team";
import Match from "../match/match";
import League from "../../models/league";

@Entity()
export class TeamParticipation {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @ManyToOne(type => League, league => league.teamParcitipations)
  league: League;

  @ManyToOne(type => Team, team => team.teamParcitipations)
  team: Team;

  static validateGenre(playerTeamCarrer: TeamParticipation) {
    const schema = {
      player: Joi.object().required(),
      team: Joi.object().required()
    };

    return Joi.validate(playerTeamCarrer, schema);
  }
}

export default TeamParticipation;
