import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn
} from "typeorm";
import Team from "./team/team";
import Player from "./player/player";

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  playerId: number;

  @OneToOne(type => Player)
  @JoinColumn({ name: "playerId" })
  captain: Player;

  @Column()
  public teamId: number;

  @OneToOne(type => Team, { nullable: true })
  @JoinColumn({ name: "teamId" })
  team: Team;

  @Column()
  public requestType: string;
}

export default Invitation;
