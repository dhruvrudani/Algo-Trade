import { KiteConnect } from "kiteconnect";
import config from "config";
import { adminTrade, userModel, userTrade, tradeQuantity } from "../../database";
import { apiResponse } from "../../common";
import data from "../../helpers/userdata.json";
import fund from "../../helpers/funding.json";
import { responseMessage, stockQuantity } from "../../helpers/index";
import { buy, sell, getFundsAndMargins } from "../../helpers/kiteConnect/index";
import { encryptData } from "../../common/encryptDecrypt";
import mongoose from "mongoose";
import { Request, Response } from 'express'
import jwt from "jsonwebtoken";
import { ObjectId } from 'mongoose';
const jsondata = data;
const funddata = fund;
const ObjectId = mongoose.Types.ObjectId
let usTime = new Date()
let options = { timeZone: 'Asia/kolkata', hour12: false }
let indiaTime = usTime.toLocaleString('en-US', options)
function generateRandomNumber() {
    return Math.floor(10000 + Math.random() * 90000);
}

export const buyTradeFunction = async (req: Request, res: Response, userData, body, resultAdminTradeEnter, quantityObj) => {

    try {

        //get user trade and margin
        // getFundsAndMargins(userData.access_key);

        let returnObj;
        const fundObj = funddata["data"];

        const { _id: id, access_key, isKiteLogin } = userData;
        if (quantityObj) {
            const { quantity } = quantityObj;
            const price = (quantity * body.price).toFixed(11);
            const fund = Number(fundObj['equity'].net.toFixed(11));
            if (access_key) {

                if (Number(price) <= fund) {
                    const random5DigitNumber = generateRandomNumber();
                    const data: any = {
                        access_key: userData.access_key,
                        id: id,
                        tradingsymbol: body.tradingsymbol,
                        quantity: quantity,
                        exchange: body.exchange,
                        order_type: body.order_type,
                        product: body.product
                    };

                    // buy(data);

                    return returnObj = {
                        user_id: userData._id,
                        tradingsymbol: body.tradingsymbol,
                        buyOrderId: random5DigitNumber,
                        quantity,
                        isSelled: false,
                        buyKitePrice: body.price,
                        buyAT: indiaTime,
                        accessToken: access_key,
                        lessQuantity: false,
                        buytradeStatus: null,
                    };
                }
                else {
                    const updatedQuantity = stockQuantity(quantity, fund, Number(price));

                    if (updatedQuantity > 0) {

                        const random5DigitNumber = generateRandomNumber();
                        const data: any = {
                            access_key: userData.access_key,
                            id: id,
                            tradingsymbol: body.tradingsymbol,
                            quantity: quantity,
                            exchange: body.exchange,
                            order_type: body.order_type,
                            product: body.product
                        };

                        // buy(data);
                        return returnObj = {
                            user_id: userData._id,
                            tradingsymbol: body.tradingsymbol,
                            buyOrderId: random5DigitNumber,
                            quantity: updatedQuantity,
                            isSelled: false,
                            buyKitePrice: body.price,
                            buyAT: indiaTime,
                            accessToken: access_key,
                            lessQuantity: true,
                            buytradeStatus: null,
                        };
                    } else {
                        return returnObj = {
                            // tradeDate: indiaTime,
                            user_id: id,
                            trade_id: resultAdminTradeEnter._id,
                            msg: "Insufficient balance",
                            accessToken: access_key
                        };
                    }
                }
            } else if (access_key === null) {
                return returnObj = {
                    // tradeDate: indiaTime,
                    user_id: id,
                    trade_id: resultAdminTradeEnter._id,
                    msg: "user not login",
                };
            }
        }
        else {
            return returnObj = {
                // tradeDate: indiaTime,        
                user_id: id,
                trade_id: resultAdminTradeEnter._id,
                msg: "user does not set quantity of trade",
                accessToken: access_key
            };
        }

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error.message));
    }
}