import { KiteConnect } from "kiteconnect";
import config from "config";
import { userModel } from "../../database";
import { apiResponse } from "../../common";
import data from "../../helpers/userdata.json";
import { responseMessage } from "../../helpers/response";
import { encryptData } from "../../common/encryptDecrypt";
import mongoose, { Collection } from "mongoose";
import { Request, Response } from 'express'
import jwt from "jsonwebtoken";
const jsondata = data;
const ObjectId = mongoose.Types.ObjectId
// Create an instance of KiteConnect
const kite = new KiteConnect({
    api_key: config.get('api_key'),
});

export const getUser = async (req: Request, res: Response) => {
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
        const userdata = await userModel.findOneAndUpdate({
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
        }, { new: true })
        return res.status(200).json(new apiResponse(200, "kite data added successfully", userdata, {}));

    } catch (error) {
        return res.status(500).send(error)
    }
}

//buy stock


// signup API
export const signUp = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const isAlready: any = await userModel.findOne({
            phoneNumber: body.phoneNumber,
            isActive: true,
            isDelete: false
        });
        console.log('🔥🔥🔥isAlready', isAlready)
        console.log('🔥🔥🔥isAlready && isAlready.fullname === null', isAlready && isAlready.fullname === null)
        if (isAlready && isAlready.fullname === null) {

            let phoneNumber = body.phoneNumber
            let OTPcode: any = Math.floor(100000 + Math.random() * 900000);
            const encryptedCode = await encryptData(OTPcode)
            console.log("👻encryptedCode", encryptedCode)
            var OTP = OTPcode
            const bodyData = {
                ...body,
                otp: encryptedCode,
                otpExpire: new Date()
            };

            const updateuser = await userModel.findOneAndUpdate({ phoneNumber: phoneNumber, isVerified: true, isDelete: false, isActive: true }, { $set: bodyData })
            bodyData.otpCode = OTPcode
            console.log('🔥🔥updateuser1', updateuser)
            return res.status(200).json(new apiResponse(200, responseMessage.otpSend, bodyData, {}));

        }
        //if user already exist or verification process is incomplete
        else if (isAlready && isAlready.isVerified === false) {
            let phoneNumber = body.phoneNumber
            let OTPcode: any = Math.floor(100000 + Math.random() * 900000);
            const encryptedCode = await encryptData(OTPcode)
            var OTP = OTPcode
            const bodyData = {
                ...body,
                otp: encryptedCode,
                otpExpire: new Date()
            };



            if (phoneNumber) {
                const updateuser = await userModel.findOneAndUpdate({ phoneNumber: phoneNumber, isVerified: false, isDelete: false, isActive: true }, { $set: bodyData })
                const userData = {
                    _id: updateuser._id,
                    phoneNumber: updateuser.phoneNumber,
                    otp: encryptedCode,
                    otpdcrypt: OTP
                }
                return res.status(200).json(new apiResponse(200, responseMessage.otpSend, userData, {}));
            } else {
                return res.status(400).json(new apiResponse(200, responseMessage.invalidPhone, {}, {}));
            }
        }

        //if user exist and it was verified so login it
        else if (isAlready && isAlready.isVerified === true && isAlready.email !== null && isAlready.fullname !== null) {

            let OTPCode: any = Math.floor(100000 + Math.random() * 900000);

            const encryptedCode = await encryptData(OTPCode)
            const bodyData = {
                ...body,
                otp: encryptedCode,
                otpExpire: new Date()
            };

            const updateuser = await userModel.findOneAndUpdate({ phoneNumber: body.phoneNumber, isVerified: true, isDelete: false, isActive: true }, { $set: bodyData })
            const userDetail = {
                _id: updateuser._id,
                phoneNumber: updateuser.phoneNumber,
                otp: encryptedCode,
                otpdcrypt: OTPCode
            };

            return res.status(200).json(new apiResponse(200, responseMessage.otpSend, userDetail, {}));
        }

        else if (isAlready && isAlready.isVerified === true && isAlready.email === null && isAlready.fullname === null) {

            return res.status(200).json(new apiResponse(200, "registration is incomplete", ["rendedr to registration page", isAlready._id], {}));
        }


        //if user create account first time
        else if (!isAlready) {
            let phone = body.phoneNumber
            // let ownerEmail = body.ownerEmail

            // const newuser = new userModel({
            //     phoneNumber: phone
            // })
            let OTPCode: any = Math.floor(100000 + Math.random() * 900000);

            const encryptedCode = await encryptData(OTPCode)
            const bodyData = {
                phoneNumber: phone,
                otp: encryptedCode,
                otpExpire: new Date()
            };

            await new userModel(bodyData).save().then(async (data) => {
                // Return user data in the response
                const userDetail = {
                    _id: data._id,
                    phoneNumber: data.phoneNumber,
                    otp: encryptedCode,
                    otpdcrypt: OTPCode
                };
                return res.status(200).json(new apiResponse(200, responseMessage.otpSend, userDetail, {}));
            });

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
};

//OTP verification

export const OtpVerification = async (req: Request, res: Response) => {
    var body = req.body
    let buyAT = new Date();
    let options = { timeZone: 'Asia/Kolkata', hour12: false };
    let indiaTime = buyAT.toLocaleString('en-US', options);
    console.log('👻indianTime', indiaTime)
    try {
        let otp = body.otp
        let encodeotp = encryptData(otp)

        let response: any = await userModel.findOne({ phoneNumber: body.phoneNumber, isActive: true, isDelete: false })
        if (!response || response === null) {
            return res.status(401).json(new apiResponse(401, responseMessage.invalidCraditional, {}, {}));
        }

        //register otp verification
        if (response.isVerified === false) {


            let data: any = await userModel.findOne({ phoneNumber: body.phoneNumber, otp: encodeotp, isActive: true, isDelete: false })

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
                        }
                        let response = await userModel.findOneAndUpdate({ phoneNumber: body.phoneNumber, isActive: true, isDelete: false }, updatedata);
                        let responsedata = await userModel.findOne({ phoneNumber: body.phoneNumber, isActive: true, isDelete: false }).select("_id phoneNumber isVerified isActive isDelete createdAt updatedAt");
                        return res.status(200).json(new apiResponse(200, "render to registration form", response._id, {}));

                    } else {
                        return res.status(401).json(new apiResponse(401, responseMessage.invalidOTP, {}, {}))
                    }
                } else {
                    return res.status(401).json(new apiResponse(401, responseMessage.expireOTP, {}, {}))
                }

            } else {
                return res.status(401).json(new apiResponse(401, responseMessage.invalidOTP, {}, {}))
            }

        } else if (response.isVerified === true) {//login otp verification
            let data: any = await userModel.findOne({ phoneNumber: body.phoneNumber, otp: encodeotp, isActive: true, isDelete: false, isVerified: true })
            if (data) {

                let difference = new Date(indiaTime).getTime() - new Date(data.otpExpire).getTime();

                if (difference <= 60000) {
                    if (data.otp === encodeotp) {

                        const payload = {
                            _id: data._id,
                            status: "Login",
                            generatedOn: new Date().getTime()
                        }

                        const token = await jwt.sign(payload, config.get('jwt_token_secret'));
                        const refresh_token = await jwt.sign({
                            _id: data._id,
                            generateOn: new Date().getTime()

                        }, config.get('jwt_token_secret'));


                        let updatedata = {
                            otp: null
                        }
                        let response = await userModel.findOneAndUpdate({ phoneNumber: body.phoneNumber, isActive: true, isDelete: false, isVerified: true }, updatedata);
                        let responsedata = await userModel.findOne({ phoneNumber: body.phoneNumber, isActive: true, isDelete: false, isVerified: true }).select("_id phoneNumber isVerified isActive isDelete createdAt updatedAt");

                        let responseresult = { data: responsedata, token, refresh_token }

                        return res.status(200).json(new apiResponse(200, responseMessage.loginSuccess, responseresult, {}));

                    } else {
                        return res.status(401).json(new apiResponse(401, responseMessage.invalidOTP, {}, {}))
                    }
                } else {
                    return res.status(401).json(new apiResponse(401, responseMessage.expireOTP, {}, {}))
                }

            } else {
                return res.status(401).json(new apiResponse(401, responseMessage.invalidOTP, {}, {}))
            }
        }
    } catch (error) {
        console.log('error', error)
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}


//update user

export const updateUser = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const data = await userModel.findOne({ _id: body.id, isActive: true, isVerified: true, isDelete: false });

        if (data) {
            const updateuser = await userModel.findByIdAndUpdate({ _id: body.id, isActive: true, isVerified: true, isDeleted: false }, { $set: body }, { new: true });
            return res.status(200).json(new apiResponse(200, responseMessage.signupSuccess, updateuser, {}))

        } else {
            return res.status(401).json(new apiResponse(401, responseMessage.invalidCraditional, {}, {}))
        }

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error))
    }
}

//delete user

export const deleteuser = async (req: Request, res: Response) => {
    try {
        let id: any = req.query.id;
        const response = await userModel.findOne({ _id: new ObjectId(id), isActive: true, isDelete: false });

        if (response) {
            const deleteUser = await userModel.findByIdAndUpdate({ _id: new ObjectId(id), isActive: true, isDelete: false }, { $set: { isDelete: true } })

            return res.status(200).json(new apiResponse(200, responseMessage.deleteDataSuccess("user"), {}, {}))
        } else {
            return res.status(400).json(new apiResponse(400, responseMessage.invalidId('user'), {}, {}))
        }
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}