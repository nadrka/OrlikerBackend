import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Joi from "joi";

@Entity()
export class Genre {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  public name: string;

  static validateGenre(genre: Genre) {
    const schema = {
      name: Joi.string()
        .min(3)
        .max(50)
        .required()
    };

    return Joi.validate(genre, schema);
  }
}

export default Genre;
