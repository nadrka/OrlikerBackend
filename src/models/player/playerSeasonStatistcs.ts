import Joi from "joi";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import Player from "./player";
import Team from "../team/team";

@Entity()
export class PlayerSeasonStatistic {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  matches: number;

  @Column()
  goals: number;

  @Column()
  assists: number;

  @Column()
  yellowsCards: number;

  @Column()
  redCards: number;

  @Column()
  leagueNumber: number;

  @Column()
  season: string;

  @Column()
  playerId: number;

  @OneToOne(type => Player)
  @JoinColumn({ name: "playerId" })
  captain: Player;

  @Column()
  public teamId: number;

  @OneToOne(type => Team, { nullable: true })
  @JoinColumn({ name: "teamId" })
  team: Team;

  static validateSeasonStatistic(seasonStatistic: PlayerSeasonStatistic) {
    const schema = {
      playerId: Joi.number()
        .min(1)
        .required(),
      teamId: Joi.number()
        .min(1)
        .required(),
      matches: Joi.number()
        .min(1)
        .required(),
      goals: Joi.number()
        .min(0)
        .required(),
      assists: Joi.number()
        .min(0)
        .required(),
      yellowsCards: Joi.number()
        .min(0)
        .required(),
      redCards: Joi.number()
        .min(0)
        .required(),
      leagueNumber: Joi.number()
        .min(1)
        .max(4)
        .required(),
      season: Joi.string().required()
    };

    return Joi.validate(seasonStatistic, schema);
  }
}

export default PlayerSeasonStatistic;
