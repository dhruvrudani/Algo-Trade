"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseConnection = void 0;
const config_1 = __importDefault(require("config"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongooseConnection = (0, express_1.default)();
exports.mongooseConnection = mongooseConnection;
const db_url = config_1.default.get('db_url');
mongoose_1.default.connect(db_url, {})
    .then(result => console.log('Database successfully connected'))
    .catch(error => console.log(error));
//# sourceMappingURL=index.js.map