import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Joi from "joi";
import jwt from "jsonwebtoken";
import Config from "config";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  public firstName: string;

  @Column()
  public secondName: string;

  @Column({ unique: true })
  public login: string;

  @Column()
  public password: string;

  @Column({ default: "Player" })
  public role: string;

  @Column({ nullable: true })
  public imgURL: string = "uploads/user-image-placeholder.png";

  generateAuthToken = function() {
    const token = jwt.sign({ id: this.id }, Config.get("jwtPrivateKey"));
    return token;
  };

  static validateUser(user: User) {
    const schema = {
      firstName: Joi.string()
        .min(3)
        .max(50)
        .required(),
      secondName: Joi.string()
        .min(3)
        .max(50)
        .required(),
      role: Joi.string()
        .equal(["Referee", "Player", "Captain"])
        .optional(),
      login: Joi.string()
        .min(3)
        .max(50)
        .required(),
      password: Joi.string()
        .min(5)
        .max(50)
        .required(),
      imgURL: Joi.string().optional()
    };

    return Joi.validate(user, schema);
  }
}

export default User;
