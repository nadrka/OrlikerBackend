import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Team } from "../models/team/team";

@Entity()
export class News {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  public title: String;

  @Column({ type: "longtext" })
  public content: String;

  @Column()
  public dateOfPublication: Date = new Date();

  @Column({ nullable: true })
  public teamId: number = null;

  @ManyToOne(type => Team, { nullable: true })
  @JoinTable()
  team: Team;
}
