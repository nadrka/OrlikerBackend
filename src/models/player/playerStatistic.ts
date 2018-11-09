import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PlayerStatistic {
  @PrimaryGeneratedColumn("increment")
  public id: number;
}

export default PlayerStatistic;
