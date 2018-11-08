"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const joi_1 = __importDefault(require("joi"));
const team_1 = __importDefault(require("../team/team"));
const league_1 = __importDefault(require("../../models/league"));
let TeamParticipation = class TeamParticipation {
    static validateGenre(playerTeamCarrer) {
        const schema = {
            player: joi_1.default.object().required(),
            team: joi_1.default.object().required()
        };
        return joi_1.default.validate(playerTeamCarrer, schema);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("increment"),
    __metadata("design:type", Number)
], TeamParticipation.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => league_1.default, league => league.teamParcitipations),
    __metadata("design:type", league_1.default)
], TeamParticipation.prototype, "league", void 0);
__decorate([
    typeorm_1.ManyToOne(type => team_1.default, team => team.teamParcitipations),
    __metadata("design:type", team_1.default)
], TeamParticipation.prototype, "team", void 0);
TeamParticipation = __decorate([
    typeorm_1.Entity()
], TeamParticipation);
exports.TeamParticipation = TeamParticipation;
exports.default = TeamParticipation;
//# sourceMappingURL=teamParticipation.js.map