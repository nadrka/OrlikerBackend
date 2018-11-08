import { League } from "./league";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class Season {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  public startDate: Date;

  @Column()
  public endDate: Date;

  @OneToMany(type => League, league => league.season)
  leagues: League[];
}

export default Season;
