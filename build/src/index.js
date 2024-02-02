"use strict";
// const {KiteConnect} = require("kiteconnect");
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const apiKey = "c8klttwlwiop0bi5";
// // Create an instance of KiteConnect
// const kite = new KiteConnect({
//   api_key: apiKey,
// });
// // Now you can use the instance to get the login URL
// const loginURL = kite.getLoginURL();
// console.log("Login URL:", loginURL);      
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
// ... start your server
const os_1 = __importDefault(require("os"));
const packageInfo = __importStar(require("../package.json"));
const connection_1 = require("./database/connection");
const router_1 = require("./router");
const app = (0, express_1.default)();
app.use(connection_1.mongooseConnection);
app.use((0, cors_1.default)());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
global.osName = os_1.default.platform();
const health = (req, res) => {
    return res.status(200).json({
        message: "Node.js backend server is running",
        app: packageInfo.name,
        version: packageInfo.version,
        author: "Webito infotech",
        license: packageInfo.license,
        contributors: [
            {
                name: "Webito infotech",
                email: "webitoinfotech@gmail.com"
            }
        ]
    });
};
const bad_gateway = (req, res) => {
    return res.status(502).json({ status: 502, message: "box Backend API Bad Gateway!" });
};
app.get('/', health);
app.get('/health', health);
app.get('/isServerUp', (req, res) => { res.send('Server is running '); });
app.use(router_1.router);
app.use('*', bad_gateway);
let server = new http_1.default.Server(app);
exports.default = server;
//# sourceMappingURL=index.js.map