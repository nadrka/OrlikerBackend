import Joi from "joi";
import { Match } from "./../match/match";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import Player from "./player";
import Team from "../team/team";

@Entity()
export class PlayerStatistic {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column({ default: 0 })
  public goals: number;

  @Column({ default: 0 })
  public assists: number;

  @Column({ default: 0 })
  public yellowCards: number;

  @Column({ default: 0 })
  public redCards: number;

  @Column()
  public playerId: number;

  @ManyToOne(type => Player)
  @JoinColumn({ name: "playerId" })
  player: Player;

  /*@Column()
  public teamId: number;

  @ManyToOne(type => Team)
  @JoinColumn({ name: "teamId" })
  team: Team;*/

  @Column()
  public matchId: number;

  @ManyToOne(type => Match)
  @JoinColumn({ name: "matchId" })
  match: Match;

  static validatePlayerStatistic(statistic: PlayerStatistic) {
    const schema = {
      goals: Joi.number()
        .min(0)
        .optional(),
      assists: Joi.number()
        .min(0)
        .optional(),
      yellowCards: Joi.number()
        .min(0)
        .optional(),
      redCards: Joi.number()
        .min(0)
        .optional(),
      playerId: Joi.number()
        .min(1)
        .max(1)
        .required(),
      /*teamId: Joi.number()
        .min(1)
        .required(),*/
      matchId: Joi.number()
        .min(1)
        .max(1)
        .required()
    };

    return Joi.validate(statistic, schema);
  }
}

export default PlayerStatistic;
