import Joi from "joi";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import Player from "./player";
import Team from "../team/team";
import { League } from "../league";
import { Season } from "../season";

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
  seasonId: number;

  @ManyToOne(type => Season)
  @JoinColumn({ name: "seasonId" })
  season: Season;

  @Column()
  playerId: number;

  @ManyToOne(type => Player)
  @JoinColumn({ name: "playerId" })
  player: Player;

  @Column()
  public teamId: number;

  @ManyToOne(type => Team, { nullable: true })
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
