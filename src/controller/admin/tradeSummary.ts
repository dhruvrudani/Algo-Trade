import { KiteConnect } from "kiteconnect";
import config from "config";
import { adminTrade, userModel, userTrade, tradeQuantity } from "../../database";
import { apiResponse } from "../../common";
import data from "../../helpers/userdata.json";
import fund from "../../helpers/funding.json";
import { responseMessage } from "../../helpers/response";
import { stockQuantity } from "../../helpers/testing";
import { encryptData } from "../../common/encryptDecrypt";
import mongoose from "mongoose";
import { Request, Response } from 'express'
import jwt from "jsonwebtoken";
import { builtinModules, findSourceMap } from "module";
const jsondata = data;
const funddata = fund;
const ObjectId = mongoose.Types.ObjectId
let usTime = new Date()
let options = { timeZone: 'Asia/kolkata', hour12: false }
let indiaTime = usTime.toLocaleString('en-US', options)

export const trade_get = async (req: Request, res: Response) => {


    let body = req.body;
        
    try {
        if("a"){}

    } catch (error) {

    }

}
