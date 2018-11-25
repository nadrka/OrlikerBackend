import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import Joi from "joi";
import Player from "../player/player";
import League from "../league";

@Entity()
export class Team {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public imgURL: string;

  @Column()
  public matches: number = 0;

  @Column()
  public wins: number = 0;

  @Column()
  public loses: number = 0;

  @Column()
  public draws: number = 0;

  @Column()
  public scoredGoals: number = 0;

  @Column()
  public concedeGoals: number = 0;

  @Column()
  captainId: number;

  @OneToOne(type => Player)
  @JoinColumn({ name: "captainId" })
  captain: Player;

  @Column()
  currentLegueId: number;

  @ManyToOne(type => League, league => league.teams, { nullable: true })
  currentLegue: League;

  @OneToMany(type => Player, player => player.team)
  players: Player[];

  static validateTeam(team: Team) {
    const schema = {
      name: Joi.string()
        .min(3)
        .max(50)
        .required(),
      captainId: Joi.number().required(),
      currentLegueId: Joi.number().required(),
      imgURL: Joi.string().optional(),
      matches: Joi.number()
        .min(0)
        .optional(),
      wins: Joi.number()
        .min(0)
        .optional(),
      loses: Joi.number()
        .min(0)
        .optional(),
      draws: Joi.number()
        .min(0)
        .optional(),
      scoredGoals: Joi.number()
        .min(0)
        .optional(),
      concedeGoals: Joi.number()
        .min(0)
        .optional()
    };
    return Joi.validate(team, schema);
  }
}

export default Team;
