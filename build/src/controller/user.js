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
exports.deleteuser = exports.updateUser = exports.OtpVerification = exports.signUp = exports.getUser = void 0;
const kiteconnect_1 = require("kiteconnect");
const config_1 = __importDefault(require("config"));
const database_1 = require("../database");
const common_1 = require("../common");
const userdata_json_1 = __importDefault(require("../helpers/userdata.json"));
const response_1 = require("../helpers/response");
const encryptDecrypt_1 = require("../common/encryptDecrypt");
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jsondata = userdata_json_1.default;
const ObjectId = mongoose_1.default.Types.ObjectId;
// Create an instance of KiteConnect
const kite = new kiteconnect_1.KiteConnect({
    api_key: config_1.default.get('api_key'),
});
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Now you can use the instance to get the login URL
        // const loginURL = kite.getLoginURL();
        // console.log("Login URL:", loginURL);
        // const requestToken = "";
        // var accesstoken;
        // kite.generateSession(requestToken, config.get('api_secret'))
        //     .then(response => {
        //         accesstoken = response.access_token;
        //     })
        //     .catch(error => {
        //         console.log("Error when generating the access token", error)
        //     })
        // kite.setAccessToken(accesstoken);
        // kite.getProfile((error, data) => {
        //     if (error) {
        //         console.log("getting error while get profile of the user", error);
        //     } else if (data) {
        //         console.log("user data is", data);
        //     }
        // })
        // return res.status(200).send(loginURL)
        // console.log(data)
        const data = jsondata["data"];
        // console.log(data);
        const body = req.body;
        const userdata = yield database_1.userModel.findOneAndUpdate({
            _id: body.id,
            isActive: true, isDelete: false, isVerified: true
        }, {
            $set: {
                access_key: "123",
                z_user_id: data.user_id,
                z_user_type: data.user_type,
                z_email: data.email,
                z_user_name: data.user_name,
                z_user_shortname: data.user_shortname,
                z_broker: data.broker,
                z_exchanges: data.exchanges,
                z_products: data.products,
                z_order_types: data.order_types,
                z_avatar_url: data.avatar_url,
                z_meta: data.meta
            }
        }, { new: true });
        return res.status(200).json(new common_1.apiResponse(200, "kite data added successfully", userdata, {}));
    }
    catch (error) {
        return res.status(500).send(error);
    }
});
exports.getUser = getUser;
//buy stock
// signup API
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        //find the user that is already exist or not 
        const isAlready = yield database_1.userModel.findOne({
            phoneNumber: body.phoneNumber,
            isActive: true,
            isDelete: false
        });
        //if user already exist or verification process is incomplete
        if (isAlready && isAlready.isVerified === false) {
            let phoneNumber = body.phoneNumber;
            let OTPcode = Math.floor(100000 + Math.random() * 900000);
            const encryptedCode = yield (0, encryptDecrypt_1.encryptData)(OTPcode);
            var OTP = OTPcode;
            const bodyData = Object.assign(Object.assign({}, body), { otp: encryptedCode, otpExpire: new Date() });
            if (phoneNumber) {
                const updateuser = yield database_1.userModel.findOneAndUpdate({ phoneNumber: phoneNumber, isVerified: false, isDelete: false, isActive: true }, { $set: bodyData });
                const userData = {
                    _id: updateuser._id,
                    phoneNumber: updateuser.phoneNumber,
                    otp: encryptedCode,
                    otpdcrypt: OTP
                };
                return res.status(200).json(new common_1.apiResponse(200, response_1.responseMessage.otpSend, userData, {}));
            }
            else {
                return res.status(400).json(new common_1.apiResponse(200, response_1.responseMessage.invalidPhone, {}, {}));
            }
        }
        //if user exist and it was verified so login it
        else if (isAlready && isAlready.isVerified === true && isAlready.email !== null && isAlready.fullname !== null) {
            let OTPCode = Math.floor(100000 + Math.random() * 900000);
            const encryptedCode = yield (0, encryptDecrypt_1.encryptData)(OTPCode);
            const bodyData = Object.assign(Object.assign({}, body), { otp: encryptedCode, otpExpire: new Date() });
            const updateuser = yield database_1.userModel.findOneAndUpdate({ phoneNumber: body.phoneNumber, isVerified: true, isDelete: false, isActive: true }, { $set: bodyData });
            const userDetail = {
                _id: updateuser._id,
                phoneNumber: updateuser.phoneNumber,
                otp: encryptedCode,
                otpdcrypt: OTPCode
            };
            return res.status(200).json(new common_1.apiResponse(200, response_1.responseMessage.otpSend, userDetail, {}));
        }
        else if (isAlready && isAlready.isVerified === true && isAlready.email === null && isAlready.fullname === null) {
            return res.status(200).json(new common_1.apiResponse(200, "registration is incomplete", ["rendedr to registration page", isAlready._id], {}));
        }
        //if user create account first time
        else if (!isAlready) {
            let phone = body.phoneNumber;
            // let ownerEmail = body.ownerEmail
            // const newuser = new userModel({
            //     phoneNumber: phone
            // })
            let OTPCode = Math.floor(100000 + Math.random() * 900000);
            const encryptedCode = yield (0, encryptDecrypt_1.encryptData)(OTPCode);
            const bodyData = {
                phoneNumber: phone,
                otp: encryptedCode,
                otpExpire: new Date()
            };
            yield new database_1.userModel(bodyData).save().then((data) => __awaiter(void 0, void 0, void 0, function* () {
                // Return user data in the response
                const userDetail = {
                    _id: data._id,
                    phoneNumber: data.phoneNumber,
                    otp: encryptedCode,
                    otpdcrypt: OTPCode
                };
                return res.status(200).json(new common_1.apiResponse(200, response_1.responseMessage.otpSend, userDetail, {}));
            }));
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, response_1.responseMessage.internalServerError, {}, error));
    }
});
exports.signUp = signUp;
//OTP verification
const OtpVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var body = req.body;
    let buyAT = new Date();
    let options = { timeZone: 'Asia/Kolkata', hour12: false };
    let indiaTime = buyAT.toLocaleString('en-US', options);
    console.log('indianTime', indiaTime);
    try {
        let otp = body.otp;
        let encodeotp = (0, encryptDecrypt_1.encryptData)(otp);
        let response = yield database_1.userModel.findOne({ phoneNumber: body.phoneNumber, isActive: true, isDelete: false });
        if (!response || response === null) {
            return res.status(401).json(new common_1.apiResponse(401, response_1.responseMessage.invalidCraditional, {}, {}));
        }
        //register otp verification
        if (response.isVerified === false) {
            let data = yield database_1.userModel.findOne({ phoneNumber: body.phoneNumber, otp: encodeotp, isActive: true, isDelete: false });
            // console.log(new Date().getTime())
            // console.log(data.otpExpire.getMinutes())
            // console.log(data.otpExpire.getSeconds())
            if (data) {
                let difference = new Date(indiaTime).getTime() - new Date(data.otpExpire).getTime();
                if (difference <= 60000) {
                    // console.log(difference)
                    if (data.otp === encodeotp) {
                        let updatedata = {
                            isVerified: true, otp: null
                        };
                        let response = yield database_1.userModel.findOneAndUpdate({ phoneNumber: body.phoneNumber, isActive: true, isDelete: false }, updatedata);
                        let responsedata = yield database_1.userModel.findOne({ phoneNumber: body.phoneNumber, isActive: true, isDelete: false }).select("_id phoneNumber isVerified isActive isDelete createdAt updatedAt");
                        return res.status(200).json(new common_1.apiResponse(200, "render to registration form", response._id, {}));
                    }
                    else {
                        return res.status(401).json(new common_1.apiResponse(401, response_1.responseMessage.invalidOTP, {}, {}));
                    }
                }
                else {
                    return res.status(401).json(new common_1.apiResponse(401, response_1.responseMessage.expireOTP, {}, {}));
                }
            }
            else {
                return res.status(401).json(new common_1.apiResponse(401, response_1.responseMessage.invalidOTP, {}, {}));
            }
        }
        else if (response.isVerified === true) { //login otp verification
            let data = yield database_1.userModel.findOne({ phoneNumber: body.phoneNumber, otp: encodeotp, isActive: true, isDelete: false, isVerified: true });
            if (data) {
                let difference = new Date(indiaTime).getTime() - new Date(data.otpExpire).getTime();
                if (difference <= 60000) {
                    if (data.otp === encodeotp) {
                        const payload = {
                            _id: data._id,
                            status: "Login",
                            generatedOn: new Date().getTime()
                        };
                        const token = yield jsonwebtoken_1.default.sign(payload, config_1.default.get('jwt_token_secret'));
                        const refresh_token = yield jsonwebtoken_1.default.sign({
                            _id: data._id,
                            generateOn: new Date().getTime()
                        }, config_1.default.get('jwt_token_secret'));
                        let updatedata = {
                            otp: null
                        };
                        let response = yield database_1.userModel.findOneAndUpdate({ phoneNumber: body.phoneNumber, isActive: true, isDelete: false, isVerified: true }, updatedata);
                        let responsedata = yield database_1.userModel.findOne({ phoneNumber: body.phoneNumber, isActive: true, isDelete: false, isVerified: true }).select("_id phoneNumber isVerified isActive isDelete createdAt updatedAt");
                        let responseresult = { data: responsedata, token, refresh_token };
                        return res.status(200).json(new common_1.apiResponse(200, response_1.responseMessage.loginSuccess, responseresult, {}));
                    }
                    else {
                        return res.status(401).json(new common_1.apiResponse(401, response_1.responseMessage.invalidOTP, {}, {}));
                    }
                }
                else {
                    return res.status(401).json(new common_1.apiResponse(401, response_1.responseMessage.expireOTP, {}, {}));
                }
            }
            else {
                return res.status(401).json(new common_1.apiResponse(401, response_1.responseMessage.invalidOTP, {}, {}));
            }
        }
    }
    catch (error) {
        console.log('error', error);
        return res.status(500).json(new common_1.apiResponse(500, response_1.responseMessage.internalServerError, {}, error));
    }
});
exports.OtpVerification = OtpVerification;
//update user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const data = yield database_1.userModel.findOne({ _id: body.id, isActive: true, isVerified: true, isDelete: false });
        if (data) {
            const updateuser = yield database_1.userModel.findByIdAndUpdate({ _id: body.id, isActive: true, isVerified: true, isDeleted: false }, { $set: body }, { new: true });
            return res.status(200).json(new common_1.apiResponse(200, response_1.responseMessage.signupSuccess, updateuser, {}));
        }
        else {
            return res.status(401).json(new common_1.apiResponse(401, response_1.responseMessage.invalidCraditional, {}, {}));
        }
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, response_1.responseMessage.internalServerError, {}, error));
    }
});
exports.updateUser = updateUser;
//delete user
const deleteuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = req.query.id;
        const response = yield database_1.userModel.findOne({ _id: new ObjectId(id), isActive: true, isDelete: false });
        if (response) {
            const deleteUser = yield database_1.userModel.findByIdAndUpdate({ _id: new ObjectId(id), isActive: true, isDelete: false }, { $set: { isDelete: true } });
            return res.status(200).json(new common_1.apiResponse(200, response_1.responseMessage.deleteDataSuccess("user"), {}, {}));
        }
        else {
            return res.status(400).json(new common_1.apiResponse(400, response_1.responseMessage.invalidId('user'), {}, {}));
        }
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, response_1.responseMessage.internalServerError, {}, error));
    }
});
exports.deleteuser = deleteuser;
//# sourceMappingURL=user.js.map