import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import Joi from "joi";
import Season from "./season";

@Entity()
export class League {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  public leagueNumber: number;

  @Column()
  public group: string;

  @ManyToOne(type => Season, season => season.leagues)
  season: Season;

  static validateLeague(league: League) {
    const schema = {
      leagueNumber: Joi.number()
        .min(1)
        .max(4)
        .required(),
      group: Joi.string().equal(["A", "B", "C", "D"])
    };

    return Joi.validate(league, schema);
  }
}

export default League;
