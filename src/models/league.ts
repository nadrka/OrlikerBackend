import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from "typeorm";
import Joi from "joi";
import Season from "./season";
import Team from "./team/team";

@Entity()
export class League {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  public leagueNumber: number;

  @ManyToOne(type => Season, season => season.leagues)
  @JoinColumn({ name: "seasonId" })
  season: Season;

  @OneToMany(type => Team, team => team.currentLegue)
  teams: Team[];

  static validateLeague(league: League) {
    const schema = {
      leagueNumber: Joi.number()
        .min(1)
        .max(4)
        .required()
    };

    return Joi.validate(league, schema);
  }
}

export default League;
