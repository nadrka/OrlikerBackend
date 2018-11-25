import { User } from "./../user";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn
} from "typeorm";
import Joi from "joi";
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
  public matchDate: Date = new Date(1990, 1, 1);

  @Column({ nullable: true })
  public acceptMatchDate: Date;

  @Column({ nullable: true })
  public homeTeamResult: number;

  @Column({ nullable: true })
  public awayTeamResult: number;

  @Column({ nullable: true })
  public refereeId: number;

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
      refereeId: Joi.number()
        .min(1)
        .optional(),
      resultId: Joi.number()
        .min(1)
        .optional(),
      homeTeamResult: Joi.number()
        .min(0)
        .optional(),
      awayTeamResult: Joi.number()
        .min(0)
        .optional(),
      matchDate: Joi.date().optional(),
      acceptMatchDate: Joi.date().optional(),
      place: Joi.string().required()
    };

    return Joi.validate(match, schema);
  }
}

export default Match;
