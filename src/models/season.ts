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

  @Column()
  public name: string;

  @Column()
  public isActive: boolean;

  @OneToMany(type => League, league => league.season)
  leagues: League[];
}

export default Season;
