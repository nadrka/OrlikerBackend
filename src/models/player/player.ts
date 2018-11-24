import { Team } from "./../team/team";
import { User } from "./../user";
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
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

  @Column({ nullable: true })
  public teamId: number;

  @OneToOne(type => Team, { nullable: true })
  @JoinColumn({ name: "teamId" })
  team: Team;

  static validatePlayer(player: Player) {
    const schema = {
      number: Joi.number()
        .min(0)
        .max(99)
        .required(),
      position: Joi.string().equal(["goalkeeper", "defender", "midfielder", "striker"]),
      strongerFoot: Joi.string().equal(["left", "right", "both"])
    };

    return Joi.validate(player, schema);
  }
}

export default Player;
