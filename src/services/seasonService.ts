import { getConnection } from "typeorm";
import { Season } from "../models/season";
import moment, { Moment } from "moment";

class SeasonService {
  async generateSeason(name: string, startDate: Moment, endDate: Moment) {
    const seasonRepository = await getConnection().getRepository(Season);
    const newSeason = seasonRepository.create({
      name: name,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      isActive: moment().isBetween(startDate, endDate)
    });
    await seasonRepository.insert(newSeason);
    return newSeason;
  }

  async getCurrentSeason() {
    const season = await getConnection()
      .getRepository(Season)
      .findOne({ where: { isActive: true } });
    return season;
  }

  async getPastSeasonsWithSort() {
    const seasons = await getConnection()
      .getRepository(Season)
      .find({ where: { isActive: false }, order: { startDate: "DESC" } });
    return seasons;
  }
}

export default SeasonService;
