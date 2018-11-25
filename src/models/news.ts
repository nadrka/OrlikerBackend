import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Team } from "../models/team/team";

@Entity()
export class News {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  public title: String;

  @Column()
  public content: String;

  @Column()
  public dateOfPublication: Date = new Date();

  @Column()
  public teamId: number;

  @ManyToOne(type => Team)
  @JoinTable()
  team: Team;
}
