import { getConnection } from "typeorm";
import { Request, Response } from "express";
import * as loadash from "lodash";
import { League } from "../models/league";

class InvitationService {
  async createLeague(req: Request, res: Response) {}

  async getLeagues() {}

  async updateLeague(req: Request, res: Response) {}

  async deleteLeagueWithGivenID(req: Request, res: Response) {}
}

export default InvitationService;
