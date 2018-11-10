import { User } from "./../user";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn
} from "typeorm";
import Joi from "joi";
import MatchResult from "./matchResult";
import Team from "../team/team";
import League from "../league";

@Entity()
export class Match {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  public status: string;

  @Column()
  public place: string;

  @Column()
  public matchDate: Date;

  @Column({ nullable: true })
  public acceptMatchDate: Date;

  @OneToOne(type => MatchResult, { nullable: true })
  @JoinColumn({})
  result: MatchResult;

  @OneToOne(type => User, { nullable: true })
  @JoinColumn({})
  referee: User;

  @Column()
  public homeTeamId: number;

  @OneToOne(type => Team)
  @JoinColumn({ name: "homeTeamId" })
  homeTeam: Team;

  @Column()
  public awayTeamId: number;

  @OneToOne(type => Team)
  @JoinColumn({ name: "awayTeamId" })
  awayTeam: Team;

  @OneToOne(type => League)
  @JoinColumn({})
  league: League;

  static validateMatch(match: Match) {
    const schema = {
      status: Joi.string().equal(["Upcoming", "Played"]),
      awayTeamId: Joi.number()
        .min(1)
        .required(),
      homeTeamId: Joi.number()
        .min(1)
        .required(),
      matchDate: Joi.date().required(),
      acceptMatchDate: Joi.date().optional()
    };

    return Joi.validate(match, schema);
  }
}

export default Match;
