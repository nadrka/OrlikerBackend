import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn
} from "typeorm";
import Player from "./player";
import Team from "models/team/team";

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  matches: number;

  @Column()
  goals: number;

  @Column()
  assists: number;

  @Column()
  yellowsCards: number;

  @Column()
  redCards: number;

  @Column()
  leagueNumber: number;

  @Column()
  season: string;

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
