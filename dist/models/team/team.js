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
const player_1 = __importDefault(require("../player/player"));
const playerTeamCarrer_1 = __importDefault(require("../player/playerTeamCarrer"));
const teamParticipation_1 = __importDefault(require("./teamParticipation"));
const league_1 = __importDefault(require("../league"));
let Team = class Team {
    static validateTeam(team) {
        const schema = {
            name: joi_1.default.string()
                .min(3)
                .max(50)
                .required(),
            captainId: joi_1.default.number().required(),
            imgURL: joi_1.default.string().optional()
        };
        return joi_1.default.validate(team, schema);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("increment"),
    __metadata("design:type", Number)
], Team.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Team.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Team.prototype, "imgURL", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Team.prototype, "captainId", void 0);
__decorate([
    typeorm_1.OneToOne(type => player_1.default),
    typeorm_1.JoinColumn({ name: "captainId" }),
    __metadata("design:type", player_1.default)
], Team.prototype, "captain", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Team.prototype, "currentLegueId", void 0);
__decorate([
    typeorm_1.OneToOne(type => league_1.default, { nullable: true }),
    typeorm_1.JoinColumn({ name: "currentLegueId" }),
    __metadata("design:type", league_1.default)
], Team.prototype, "currentLegue", void 0);
__decorate([
    typeorm_1.OneToMany(type => playerTeamCarrer_1.default, carrer => carrer.team),
    __metadata("design:type", Array)
], Team.prototype, "playerTeamCarrers", void 0);
__decorate([
    typeorm_1.OneToMany(type => teamParticipation_1.default, teamParcitipation => teamParcitipation.team),
    __metadata("design:type", Array)
], Team.prototype, "teamParcitipations", void 0);
Team = __decorate([
    typeorm_1.Entity()
], Team);
exports.Team = Team;
exports.default = Team;
//# sourceMappingURL=team.js.map