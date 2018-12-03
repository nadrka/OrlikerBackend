import { User } from "./../user";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne
} from "typeorm";
import Joi from "joi";
import Team from "../team/team";
import League from "../league";
import MatchPlace from "./matchPlace";

@Entity()
export class Match {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  public status: string = "Upcoming";

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

  @ManyToOne(type => Team)
  homeTeam: Team;

  @Column()
  public awayTeamId: number;

  @ManyToOne(type => Team)
  awayTeam: Team;

  @Column()
  public placeId: number;

  @ManyToOne(type => MatchPlace)
  place: MatchPlace;

  @Column()
  public leagueId: number;

  @ManyToOne(type => League)
  league: League;

  static validateMatch(match: Match) {
    const schema = {
      status: Joi.string()
        .equal(["Upcoming", "Played"])
        .optional(),
      awayTeamId: Joi.number()
        .min(1)
        .required(),
      homeTeamId: Joi.number()
        .min(1)
        .required(),
      refereeId: Joi.number()
        .min(1)
        .optional(),
      leagueId: Joi.number()
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
      placeId: Joi.number().required()
    };

    return Joi.validate(match, schema);
  }
}

export default Match;
