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
exports.userJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const database_1 = require("../database");
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../common");
const ObjectId = mongoose_1.default.Types.ObjectId;
const jwt_token_secret = config_1.default.get('jwt_token_secret');
const refresh_jwt_token_secret = config_1.default.get('refresh_jwt_token_secret');
const userJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { authorization, userType } = req.headers, result;
    if (authorization) {
        try {
            let isVerifyToken = jsonwebtoken_1.default.verify(authorization, jwt_token_secret);
            result = yield database_1.userModel.findOne({ _id: new ObjectId(isVerifyToken._id), isActive: true });
            if ((result === null || result === void 0 ? void 0 : result.isBlock) == true)
                return res.status(403).json(new common_1.apiResponse(403, 'Your account han been blocked.', {}, {}));
            if ((result === null || result === void 0 ? void 0 : result.isActive) == true && isVerifyToken.type == result.userType) {
                // Set in Header Decode Token Information
                req.headers.user = result;
                return next();
            }
            else {
                return res.status(401).json(new common_1.apiResponse(401, "Invalid-Token", {}, {}));
            }
        }
        catch (err) {
            if (err.message == "invalid signature")
                return res.status(403).json(new common_1.apiResponse(403, `Don't try different one token`, {}, {}));
            console.log(err);
            return res.status(401).json(new common_1.apiResponse(401, "Invalid Token", {}, {}));
        }
    }
    else {
        return res.status(401).json(new common_1.apiResponse(401, "Token not found in header", {}, {}));
    }
});
exports.userJWT = userJWT;
//# sourceMappingURL=jwt.js.map