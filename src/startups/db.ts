import moment from "moment";
import { createConnection, Connection } from "typeorm";
import LeagueService from "../services/leagueService";
import TeamService from "../services/teamService";
import UserService from "../services/userService";
import ExpectedError from "../utils/expectedError";
import PlayerService from "../services/playerService";
import PlacesService from "../services/placesService";
import MatchService from "../services/matchService";
import { randomIntFromMinMax } from "../utils/commonFunctions";
import PlayerStatisticService from "../services/playerStatisticService";

const NAMES = `Jan
Andrzej
Piotr
Krzysztof
Stanisław
Tomasz
Paweł
Józef
Marcin
Marek
Michał
Grzegorz
Jerzy
Tadeusz
Adam
Łukasz
Zbigniew
Ryszard
Dariusz
Henryk
Mariusz
Kazimierz
Wojciech
Robert
Mateusz
Marian
Rafał
Jacek
Janusz
Mirosław
Maciej
Sławomir
Jarosław
Kamil
Wiesław
Roman
Władysław
Jakub
Artur
Zdzisław
Edward
Mieczysław
Damian
Dawid
Przemysław
Sebastian
Czesław
Leszek
Daniel
Waldemar`;

const LASTNAMES = `Nowak
Kowalski
Wiśniewski
Dąbrowski
Lewandowski
Wójcik
Kamiński
Kowalczyk
Zieliński
Szymański
Woźniak
Kozłowski
Jankowski
Wojciechowski
Kwiatkowski
Kaczmarek
Mazur
Krawczyk
Piotrowski
Grabowski
Nowakowski
Pawłowski
Michalski
Nowicki
Adamczyk
Dudek
Zając
Wieczorek
Jabłoński
Król
Majewski
Olszewski
Jaworski
Wróbel
Malinowski
Pawlak
Witkowski
Walczak
Stępień
Górski
Rutkowski
Michalak
Sikora
Ostrowski
Baran
Duda
Szewczyk
Tomaszewski
Pietrzak
Marciniak
Wróblewski
Zalewski
Jakubowski
Jasiński
Zawadzki
Sadowski
Bąk
Chmielewski
Włodarczyk
Borkowski
Czarnecki
Sawicki
Sokołowski
Urbański
Kubiak
Maciejewski
Szczepański
Kucharski
Wilk
Kalinowski
Lis
Mazurek
Wysocki
Adamski
Kaźmierczak
Wasilewski
Sobczak
Czerwiński
Andrzejewski
Cieślak
Głowacki`;

const TEAM_NAMES = `Apoel Morena
Hanza Lider
Ego Club Sopot
KP Brzeźno
Lechia Gdańsk
AST Wrzeszcz
KS Orunia
Currenda Team
Akademia Gepetto
KP Sopot
Prawda Prawda Stara
Frassati Fajsławice
Żyrzyniak Żyrzyn
Amator Rosoł
Powiślak Końskowola
Cosmos Józefów
Olimpiakos Tarnogród
Sparta Babunie
Drako Kowala
Victoria Kurozwęki
Sygnał Chodak
Gigant Przytoczno
Koziołek Lublin
Legion Komarów
Relax Radecznica
Meblarz Bondyrz
Zryw Skroniów
Cyklon Rogoźnik
Orzeł Koty
Fortuna Wyry
Grom Cykarzew
Kmicic Kruszyna
Pogoń Pludry
Jedność Rozpierka
LZS Mokre Łapy 
LZS Zimna Wódka
Vineta Wolin
Gwiazda Żalęcino
Ogniwo Babinek
Czcibor Cedynia
Ewingi Zalewo
GKS Wisielec
Tęcz Siwiałka
Gieret Giby
Rospuda Filipów
Bobry Choroszcz
Husar Nurzec
Iskra Poryte Jabłoń
Victoria Łyski Klepacze
Huragan Skórcz
Resovia Cenowa Bomba
Strażak Kokotów
Partyzant Dojazdów
Junak Słocina
Grom Mogielnica
Inter Gnojnica
Plantator Nienadówka
Trzcinka Trzciana
Huragan Buchcice
Orzeł Cików
Huragan Kostomloty
Plon Klęczany
Wicher Kobyłka 
Wieczfnianka Wieczfnia
Orkan Bełżec
Huragan Łaszczówka
Cementarnica
Zepter Idea Śląsk Wrocław
Proch Pionki
Spartakus Szarowola`;

const PLACES_NAMES = "SP76 Osowa Orunia Morena Oliwa Gedania Politechnika AWF Sahara Przejazdowo";

const NUMBER_OF_LEAGUES = 3;
const TEAMS_IN_LEAGUES = 10;
export const PLAYERS_IN_TEAMS = 12;
const nameArr = NAMES.split("\n");
const surnamesArr = LASTNAMES.split("\n");
const teamNameArr = TEAM_NAMES.split("\n");
const placesNamesArr = PLACES_NAMES.split(" ");
const NUMBER_OF_REFEREES = 15;
const NUMBER_OF_PLACES = 10;

function generateRandomCredentials(alreadyChosenArr: Array<string>) {
  let randomName = nameArr[randomIntFromMinMax(0, nameArr.length - 1)];
  let randomSurname = surnamesArr[randomIntFromMinMax(0, surnamesArr.length - 1)];
  let randomLogin,
    hasChosen = false;
  while (!hasChosen) {
    randomLogin = `${randomName}${randomSurname.slice(0, 1)}${randomIntFromMinMax(0, 100)}`;
    if (alreadyChosenArr.indexOf(randomLogin) == -1) hasChosen = true;
  }
  return { firstName: randomName, secondName: randomSurname, login: randomLogin, password: "12345" };
}

async function generateInitialData() {
  const leagueService = new LeagueService();
  const teamService = new TeamService();
  const userService = new UserService();
  const matchService = new MatchService();
  const placesService = new PlacesService();
  const playerStatisticService = new PlayerStatisticService();
  var listOfLogins: Array<string> = [];
  let time = moment();
  var randomCredentials = [];
  for (var initialIndex = 0; initialIndex < TEAMS_IN_LEAGUES * NUMBER_OF_LEAGUES; initialIndex++) {
    if (initialIndex == 0) {
      randomCredentials.push({ firstName: "Gustaw", secondName: "Ohler", login: "goodstuff", password: "12345" });
      randomCredentials.push({ firstName: "Karol", secondName: "Nadratowski", login: "karol", password: "12345" });
    }
    let credentials = generateRandomCredentials(listOfLogins);
    listOfLogins.push(credentials.login);
    randomCredentials.push(credentials);
  }
  await userService.generateManyUsers(randomCredentials, false);
  for (var mainIndex = 0; mainIndex < NUMBER_OF_LEAGUES; mainIndex++) {
    let league = await leagueService.createLeague();
    for (var teamIndex = 0; teamIndex < TEAMS_IN_LEAGUES; teamIndex++) {
      await teamService.createTeamWithoutToken(teamNameArr[mainIndex * TEAMS_IN_LEAGUES + teamIndex], league.id);
    }
  }
  let usersNotCaptainsCredentials = [];
  for (var userIndex = 0; userIndex < TEAMS_IN_LEAGUES * NUMBER_OF_LEAGUES * PLAYERS_IN_TEAMS; userIndex++) {
    let credentials = generateRandomCredentials(listOfLogins);
    listOfLogins.push(credentials.login);
    randomCredentials.push(credentials);
    usersNotCaptainsCredentials.push(credentials);
  }
  await userService.generateManyUsers(usersNotCaptainsCredentials, false);
  await placesService.saveMultiplePlaces(placesNamesArr, NUMBER_OF_PLACES);
  let referees = [];
  for (var refereeIndex = 0; refereeIndex < NUMBER_OF_REFEREES; refereeIndex++) {
    let credentials = generateRandomCredentials(listOfLogins);
    listOfLogins.push(credentials.login);
    randomCredentials.push(credentials);
    referees.push(credentials);
  }
  await userService.generateManyUsers(referees, true);
  await matchService.generateMatches();
  await teamService.updateTeams();
  await playerStatisticService.generateStatisticsForMatches();
  await userService.generateAdmin("Jakub", "Szef");
  console.log("generowanie zajelo: " + moment().diff(time, "second") + " sekund");
}

function startDatabase() {
  createConnection()
    .then(async connection => {
      console.log("Connecting to database was succesfull!");
      // await deleteDatabase(connection);
      // await generateInitialData();
      // await genereteStatsOnly();
      console.log("Generating data was succesfull!");
      console.log("done");
    })
    .catch(error => console.log(error));
}

/* async function isThereADatabase(connection: Connection) {
  let hasDatabase = await connection.createQueryRunner().hasDatabase("footballLeague");
  let table = await connection.createQueryRunner().getTable("league")
  table.checks()
  console.log("Jest baza danych? " + hasDatabase);
}


 */

async function createDatabase(connection: Connection) {
  const queryRunner = connection.createQueryRunner();
  await queryRunner.createDatabase("footballLeague", true);
  let hasDatabase = await queryRunner.hasDatabase("footballLeague");
  console.log("Jest baza danych? " + hasDatabase);
}

async function deleteDatabase(connection: Connection) {
  const queryRunner = connection.createQueryRunner();

  await queryRunner.dropDatabase("footballLeague");
  let hasDatabase = await queryRunner.hasDatabase("footballLeague");

  await queryRunner.executeMemoryDownSql();

  hasDatabase = await queryRunner.hasDatabase("footballLeague");

  await queryRunner.release();
}

export default startDatabase;
