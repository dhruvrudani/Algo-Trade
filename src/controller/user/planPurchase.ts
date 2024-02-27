import { KiteConnect } from "kiteconnect";
import config from "config";
import { userModel } from "../../database";
import { apiResponse } from "../../common";
import data from "../../helpers/userdata.json";
import { responseMessage } from "../../helpers/response";
import { kitelogin } from "../../helpers/kiteConnect/index";
import { encryptData } from "../../common/encryptDecrypt";
import mongoose, { Collection } from "mongoose";
import { Request, Response } from 'express'
import jwt from "jsonwebtoken";
import { checkPreferences } from "joi";
import bcrypt from "bcryptjs";

//buy plan
/*
A - 1 trade for each day
B - 2 trade for each day
C - 3 trade for each day
*/

export const BuyPlan = async (req: Request, res: Response) => {
    try {
        let body = req.body;

        const buyPlanData = await userModel.findByIdAndUpdate({ _id: body.id, role: 1 }, { plan: body.plan  }, { new: true });

        if (buyPlanData) {
            res.status(200).json(new apiResponse(200, "plan buy successful", buyPlanData, {}))
        } else {
            res.status(401).json(new apiResponse(401, "some issue in plan buy", buyPlanData, {}))
        }
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error))
    }
} 