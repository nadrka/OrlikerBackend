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

  @Column({ nullable: true })
  public writtenById: number;

  @OneToOne(type => User, { nullable: true })
  @JoinColumn({ name: "writtenById" })
  writtenBy: User;

  static validateMatchResult(matchResult: MatchResult) {
    const schema = {
      homeTeamResult: Joi.number()
        .min(0)
        .max(50)
        .required(),
      awayTeamResult: Joi.number()
        .min(0)
        .max(50)
        .required(),
      writtenById: Joi.number()
        .min(1)
        .optional()
    };

    return Joi.validate(matchResult, schema);
  }
}

export default MatchResult;
