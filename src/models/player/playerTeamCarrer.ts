import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import Joi from "joi";
import Player from "./player";
import Team from "../team/team";

@Entity()
export class PlayerTeamCarrer {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @ManyToOne(type => Player, player => player.playerTeamCarrers)
  player: Player;

  @ManyToOne(type => Team, team => team.playerTeamCarrers)
  team: Team;

  static validateGenre(playerTeamCarrer: PlayerTeamCarrer) {
    const schema = {
      name: Joi.string()
        .min(3)
        .max(50)
        .required()
    };

    return Joi.validate(playerTeamCarrer, schema);
  }
}

export default PlayerTeamCarrer;
