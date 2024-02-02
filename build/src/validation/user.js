"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.by_id = exports.updateuser = exports.deletes = exports.verificationOtp = exports.signUp = void 0;
const Joi = __importStar(require("joi"));
const common_1 = require("../common");
//user registration
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("👻req....", req.body);
    var schema = Joi.object({ phoneNumber: Joi.string().required().pattern(/^[0-9]{10}$/).messages({ 'any.required': 'phoneNumber is required', 'string.pattern.base': 'phoneNumber must be a 10-digit number' }) });
    schema.validateAsync(req.body).then(result => {
        return next();
    }).catch(error => {
        res.status(400).json(new common_1.apiResponse(400, error.message, {}, {}));
    });
});
exports.signUp = signUp;
//verifivstion of OTP
const verificationOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = Joi.object({
        phoneNumber: Joi.string()
            .required()
            .pattern(/^[0-9]{10}$/)
            .messages({
            'any.required': 'phoneNumber is required',
            'string.pattern.base': 'phoneNumber must be a 10-digit number'
        }),
        otp: Joi.number().required().messages({ 'any.required': 'Otp is required', 'number.base': 'Otp must be a number' }),
    });
    schema.validateAsync(req.body).then(result => {
        return next();
    }).catch(error => {
        res.status(400).json(new common_1.apiResponse(400, error.message, {}, {}));
    });
});
exports.verificationOtp = verificationOtp;
//delete the user
const deletes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = Joi.object({
        id: Joi.string().error(new Error('id is required!'))
    });
    schema.validateAsync(req.query).then(result => {
        return next();
    }).catch(error => {
        res.status(400).json(new common_1.apiResponse(400, error.message, {}, {}));
    });
});
exports.deletes = deletes;
//update user
const updateuser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = Joi.object({
        id: Joi.string().required().error(new Error('id is reqired')),
        fullname: Joi.string().required().error(new Error('name is required!')),
        email: Joi.string()
            .required()
            .pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
            .messages({
            'any.required': 'email is required',
            'string.pattern.base': 'email format must be followed'
        })
    });
    schema.validateAsync(req.body).then(result => {
        return next();
    }).catch(error => {
        res.status(400).json(new common_1.apiResponse(400, error.message, {}, {}));
    });
});
exports.updateuser = updateuser;
//det user by id
const by_id = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = Joi.object({
        id: Joi.string().error(new Error('id is required!'))
    });
    schema.validateAsync(req.query).then(result => {
        return next();
    }).catch(error => {
        res.status(400).json(new common_1.apiResponse(400, error.message, {}, {}));
    });
});
exports.by_id = by_id;
//# sourceMappingURL=user.js.map