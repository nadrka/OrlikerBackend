import { getConnection } from "typeorm";
import { News } from "../models/news";
import { Team } from "../models/team/team";
import { Response } from "express";
import ExpectedError from "../utils/expectedError";
import { Player } from "../models/player/player";

class newsService {
  async createNews(title: String, content: String, senderId: number, role: string) {
    let teamId = null;
    if (role === "Player") {
      const player = await getConnection()
        .getRepository(Player)
        .findOne(senderId, { relations: ["captainTeam"] });
      if (player.captainTeam !== null) teamId = player.captainTeam.id;
    }
    const newsRepository = await getConnection().getRepository(News);
    const news = newsRepository.create({ title: title, content: content, teamId: teamId });
    await getConnection().manager.save(news);
    return news;
  }

  async getNews() {
    const news = await getConnection().manager.find(News, {
      relations: ["team"],
      order: {
        dateOfPublication: "DESC"
      }
    });
    return news;
  }

  async getSingleNews(id: number) {
    const news = await getConnection()
      .getRepository(News)
      .findOne(id);
    return news;
  }

  async changeNews(id: number, title: String, content: String) {
    const newsRepository = await getConnection().getRepository(News);
    const chosenNews = await newsRepository.findOne(id);
    if (!chosenNews) throw new ExpectedError("No news with given id", 400);
    chosenNews.title = title;
    chosenNews.content = content;
    await getConnection().manager.save(chosenNews);
    return chosenNews;
  }

  async getNewsForTeam(teamId: number) {
    const newsRepository = await getConnection().getRepository(News);
    const news = await newsRepository.find({ teamId: teamId });
    return news;
  }
}

export default newsService;
