"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
require("reflect-metadata");
const db_1 = __importDefault(require("./startups/db"));
const routers_1 = __importDefault(require("./startups/routers"));
if (!config_1.default.get("jwtPrivateKey")) {
    console.log("Private key is not defined!");
    process.exit(1);
}
const app = express_1.default();
db_1.default();
routers_1.default(app);
app.listen(3000, () => console.log("Example app listening on port 3000!"));
//# sourceMappingURL=server.js.map