import { User } from "./../user";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn
} from "typeorm";
import Joi from "joi";

@Entity()
export class MatchResult {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  public homeTeamResult: number;

  @Column()
  public awayTeamResult: number;

  @OneToOne(type => User)
  @JoinColumn()
  writtenBy: User;

  static validateGenre(matchResult: MatchResult) {
    const schema = {
      name: Joi.string()
        .min(3)
        .max(50)
        .required()
    };

    return Joi.validate(matchResult, schema);
  }
}

export default MatchResult;
