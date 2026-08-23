"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const knexInstance = (0, knex_1.default)({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'psychologist_directory',
    },
    migrations: {
        directory: path_1.default.join(__dirname, '../migrations'),
    },
    seeds: {
        directory: path_1.default.join(__dirname, '../seeds'),
    },
    pool: { min: 2, max: 10 },
    debug: process.env.NODE_ENV !== 'production',
});
exports.default = knexInstance;
//# sourceMappingURL=database.js.map