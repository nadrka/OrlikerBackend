import { getConnection } from "typeorm";
import { MatchPlace } from "../models/match/matchPlace";

class PlacesService {
  async saveMultiplePlaces(names: string[], howMuch: number) {
    var finalObject = [];
    for (var index = 0; index < howMuch; index++) {
      finalObject.push({ place: names[index] });
    }
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(MatchPlace)
      .values(finalObject)
      .execute();
  }

  async getPlaces() {
    const places = await getConnection()
      .getRepository(MatchPlace)
      .find();
    return places;
  }
}

export default PlacesService;
