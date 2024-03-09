import { KiteConnect } from "kiteconnect";
import config from "config";
import { userModel, connectHistory, LastConnectHistory } from "../../database";
import { apiResponse } from "../../common";
import { responseMessage } from "../../helpers/response";
import { kitelogin } from "../../helpers/kiteConnect/index";
import { encryptData } from "../../common/encryptDecrypt";
import mongoose, { Collection } from "mongoose";
import { Request, Response } from 'express'
import jwt from "jsonwebtoken";
import { checkPreferences } from "joi";
import bcrypt from "bcryptjs";
import { json } from "body-parser";
import { request } from "http";


export const passwordOrOtp = async (req: Request, res: Response)=>{
    try {
        const role=1
        const result = await userModel.findOne({role:role}) 
        return res.status(200).json(new apiResponse(200, "data Share successfully", result.usingPassword, {}));
        } catch (error) {
        
    }

}