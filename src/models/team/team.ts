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

  @OneToOne(type => Player)
  @JoinColumn()
  captain: Player;

  @OneToOne(type => League)
  @JoinColumn()
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
        .required()
    };

    return Joi.validate(team, schema);
  }
}

export default Team;
