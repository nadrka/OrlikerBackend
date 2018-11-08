import { PlayerTeamCarrer } from "./playerTeamCarrer";
import { Team } from "./../team/team";
import { User } from "./../user";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import Joi from "joi";

@Entity()
export class Player {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column({ nullable: true })
  public number: number = 0;

  @Column()
  public position: string = "";

  @Column()
  public strongerFoot: string = "";

  @Column({ type: "datetime" })
  public dateOfBirth: Date = new Date(1990, 1, 1);

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @OneToOne(type => Team, { nullable: true })
  @JoinColumn({})
  team: Team;

  @OneToMany(type => PlayerTeamCarrer, carrer => carrer.player)
  playerTeamCarrers: PlayerTeamCarrer[];

  static validatePlayer(player: Player) {
    const schema = {
      number: Joi.number()
        .min(0)
        .max(99)
        .required(),
      position: Joi.string().equal([
        "goalkeeper",
        "defender",
        "midfielder",
        "striker"
      ]),
      strongerFoot: Joi.string().equal(["left", "right", "both"])
    };

    return Joi.validate(player, schema);
  }
}

export default Player;
