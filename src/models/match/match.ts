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

  @Column()
  public acceptMatchDate: Date;

  @OneToOne(type => MatchResult, { nullable: true })
  @JoinColumn({})
  result: MatchResult;

  @OneToOne(type => User, { nullable: true })
  @JoinColumn({})
  referee: User;

  @OneToOne(type => Team)
  @JoinColumn({})
  homeTeam: Team;

  @OneToOne(type => Team)
  @JoinColumn({})
  awayTeam: MatchResult;

  @OneToOne(type => League)
  @JoinColumn({})
  league: League;

  static validateMatch(match: Match) {
    const schema = {
      status: Joi.string().equal(["Upcoming", "Played"])
    };

    return Joi.validate(match, schema);
  }
}

export default Match;
