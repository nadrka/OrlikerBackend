import Joi from "joi";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn
} from "typeorm";
import Team from "./team/team";
import Player from "./player/player";

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  playerId: number;

  @OneToOne(type => Player)
  @JoinColumn({ name: "playerId" })
  player: Player;

  @Column()
  public teamId: number;

  @OneToOne(type => Team, { nullable: true })
  @JoinColumn({ name: "teamId" })
  team: Team;

  @Column()
  public requestType: string;

  static validateInvitation(invitation: Invitation) {
    const schema = {
      playerId: Joi.number()
        .min(1)
        .required(),
      teamId: Joi.number()
        .min(1)
        .required(),
      requestType: Joi.string()
        .equal(["player", "team"])
        .required()
    };

    return Joi.validate(invitation, schema);
  }
}

export default Invitation;
