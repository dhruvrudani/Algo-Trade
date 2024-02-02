"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const kiteconnect_1 = require("kiteconnect");
const config_1 = __importDefault(require("config"));
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Create an instance of KiteConnect
    const kite = new kiteconnect_1.KiteConnect({
        api_key: config_1.default.api_key,
    });
    // Now you can use the instance to get the login URL
    const loginURL = kite.getLoginURL();
    console.log("Login URL:", loginURL);
    const requestToken = "";
    var accesstoken;
    kite.generateSession(requestToken, config_1.default.api_secret)
        .then(response => {
        accesstoken = response.access_token;
    })
        .catch(error => {
        console.log("Error when generating the access token", error);
    });
    kite.setAccessToken(accesstoken);
    kite.getProfile((error, data) => {
        if (error) {
            console.log("getting error while get profile of the user", error);
        }
        else if (data) {
            console.log("user data is", error);
        }
    });
});
exports.getUser = getUser;
//# sourceMappingURL=getUserdata.js.map