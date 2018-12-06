import Joi from "joi";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class MatchPlace {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  public place: string;

  static validateInvitation(matchPlace: MatchPlace) {
    const schema = {
      playerId: Joi.number()
        .min(1)
        .required(),
      place: Joi.string()
        .min(3)
        .required()
    };

    return Joi.validate(matchPlace, schema);
  }
}

export default MatchPlace;
