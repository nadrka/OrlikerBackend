import { Team } from "./../team/team";
import { User } from "./../user";
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import Joi from "joi";

@Entity()
export class Player {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column({ default: 0, nullable: true })
  public number: number = 0;

  @Column({ default: "" })
  public position: string = "";

  @Column({ default: "" })
  public strongerFoot: string = "";

  @Column({ type: "datetime", nullable: true })
  public dateOfBirth: Date = new Date(1990, 1, 1);

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @OneToOne(type => Team, team => team.captain, { nullable: true })
  captainTeam: Team;

  @Column({ nullable: true })
  public teamId: number;

  @ManyToOne(type => Team, team => team.players, { nullable: true })
  @JoinColumn({ name: "teamId" })
  team: Team;

  static validatePlayer(player: Player) {
    const schema = {
      number: Joi.number()
        .min(0)
        .max(99)
        .required(),
      position: Joi.string().equal(["Bramkarz", "Obrońca", "Pomocnik", "Napastnik"]),
      strongerFoot: Joi.string().equal(["Prawa", "Lewa", "Obunożny"])
    };

    return Joi.validate(player, schema);
  }
}

export default Player;
