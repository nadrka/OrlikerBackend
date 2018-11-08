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

  @OneToOne(type => User)
  @JoinColumn({})
  referee: User;

  @OneToOne(type => Team)
  @JoinColumn({})
  homeTeam: Team;

  @OneToOne(type => Team)
  @JoinColumn({})
  awayTeam: MatchResult;

  static validateGenre(match: Match) {
    const schema = {
      name: Joi.string()
        .min(3)
        .max(50)
        .required()
    };

    return Joi.validate(match, schema);
  }
}

export default Match;
