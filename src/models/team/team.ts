import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import Joi from "joi";
import Player from "../player/player";
import PlayerTeamCarrer from "../player/playerTeamCarrer";
import TeamParticipation from "./teamParticipation";
import League from "../league";

@Entity()
export class Team {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public imgURL: string;

  @Column()
  captainId: number;

  @OneToOne(type => Player)
  @JoinColumn({ name: "captainId" })
  captain: Player;

  @Column()
  currentLegueId: number;

  @OneToOne(type => League, { nullable: true })
  @JoinColumn({ name: "currentLegueId" })
  currentLegue: League;

  @OneToMany(type => PlayerTeamCarrer, carrer => carrer.team)
  playerTeamCarrers: PlayerTeamCarrer[];

  @OneToMany(
    type => TeamParticipation,
    teamParcitipation => teamParcitipation.team
  )
  teamParcitipations: TeamParticipation[];

  static validateTeam(team: Team) {
    const schema = {
      name: Joi.string()
        .min(3)
        .max(50)
        .required(),
      captainId: Joi.number().required(),
      imgURL: Joi.string().optional()
    };

    return Joi.validate(team, schema);
  }
}

export default Team;
