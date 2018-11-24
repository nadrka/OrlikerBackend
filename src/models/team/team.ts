import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn
} from "typeorm";
import Joi from "joi";
import Player from "../player/player";
import League from "../league";

@Entity()
export class Team {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public imgURL: string;

  @Column()
  captainId: number;

  @OneToOne(type => Player)
  @JoinColumn({ name: "captainId" })
  captain: Player;

  @Column()
  currentLegueId: number;

  @OneToOne(type => League, { nullable: true })
  @JoinColumn({ name: "currentLegueId" })
  currentLegue: League;

  static validateTeam(team: Team) {
    const schema = {
      name: Joi.string()
        .min(3)
        .max(50)
        .required(),
      captainId: Joi.number().required(),
      imgURL: Joi.string().optional()
    };
    return Joi.validate(team, schema);
  }
}

export default Team;
