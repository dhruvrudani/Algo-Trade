import { KiteConnect } from "kiteconnect";
import config from "config";
import { adminTrade, userModel, userTrade, tradeQuantity } from "../../database";
import { apiResponse } from "../../common";

import fund from "../../helpers/funding.json";
import { responseMessage, stockQuantity } from "../../helpers/index";
import { getFundsAndMargins } from "../../helpers/kiteConnect/index";
import { encryptData } from "../../common/encryptDecrypt";
import mongoose from "mongoose";
import { Request, Response } from 'express'
import jwt from "jsonwebtoken";
import { ObjectId } from 'mongoose';

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
        console.log(userData.access_key);
        const fundObj = await getFundsAndMargins("7Fcmz5S9YRBXCnXUlrFnc6MGBb2W4KqU", 'equity').catch(error => {
            console.error("Error in getFundsAndMargins:", error);
            throw error;
        });
        console.log(fundObj['quuity']);
        // const { _id: id, access_key, isKiteLogin } = userData;
        // if (quantityObj) {
        //     const { quantity } = quantityObj;
        //     const price = (quantity * body.price).toFixed(11);
        //     const fund = Number(fundObj['equity'].net.toFixed(11));
        //     if (access_key && isKiteLogin) {

        //         if (Number(price) <= fund) {
        //             const random5DigitNumber = generateRandomNumber();
        //             const data: any = {
        //                 access_key: userData.access_key,
        //                 id: id,
        //                 tradingsymbol: body.tradingsymbol,
        //                 quantity: quantity,
        //                 exchange: body.exchange,
        //                 order_type: body.order_type,
        //                 product: body.product
        //             };

        //             // buy(data);
        //             const alluserdata = await userModel.findOneAndUpdate(
        //                 {
        //                     _id: userData._id,
        //                     isActive: true,
        //                     isDelete: false,
        //                     isVerified: true
        //                 },
        //                 {
        //                     $inc: {
        //                         totalUsePlan: +1
        //                     }
        //                 },
        //                 { new: true }
        //             );
        //             console.log(alluserdata);
        //             return returnObj = {
        //                 user_id: userData._id,
        //                 tradingsymbol: body.tradingsymbol,
        //                 buyOrderId: random5DigitNumber,
        //                 quantity,
        //                 isSelled: false,
        //                 buyKitePrice: body.price,
        //                 buyAT: indiaTime,
        //                 accessToken: access_key,
        //                 lessQuantity: false,
        //                 buytradeStatus: null,
        //             };
        //         }
        //         else {
        //             const updatedQuantity = stockQuantity(quantity, fund, Number(price));

        //             if (updatedQuantity > 0) {

        //                 const random5DigitNumber = generateRandomNumber();
        //                 const data: any = {
        //                     access_key: userData.access_key,
        //                     id: id,
        //                     tradingsymbol: body.tradingsymbol,
        //                     quantity: quantity,
        //                     exchange: body.exchange,
        //                     order_type: body.order_type,
        //                     product: body.product
        //                 };

        //                 // buy(data);
        //                 const alluserdata = await userModel.findOneAndUpdate(
        //                     {
        //                         _id: userData._id,
        //                         isActive: true,
        //                         isDelete: false,
        //                         isVerified: true
        //                     },
        //                     {
        //                         $inc: {
        //                             totalUsePlan: +1
        //                         }
        //                     },
        //                     { new: true }
        //                 );
        //                 console.log(alluserdata);
        //                 return returnObj = {
        //                     user_id: userData._id,
        //                     tradingsymbol: body.tradingsymbol,
        //                     buyOrderId: random5DigitNumber,
        //                     quantity: updatedQuantity,
        //                     isSelled: false,
        //                     buyKitePrice: body.price,
        //                     buyAT: indiaTime,
        //                     accessToken: access_key,
        //                     lessQuantity: true,
        //                     buytradeStatus: null
        //                 };
        //             } else {
        //                 return returnObj = {
        //                     // tradeDate: indiaTime,
        //                     user_id: id,
        //                     trade_id: resultAdminTradeEnter._id,
        //                     msg: "Insufficient balance",
        //                     accessToken: access_key
        //                 };
        //             }
        //         }
        //     } else if (access_key === null) {
        //         return returnObj = {
        //             // tradeDate: indiaTime,
        //             user_id: id,
        //             trade_id: resultAdminTradeEnter._id,
        //             msg: "user not login",
        //         };
        //     }
        // }
        // else {
        //     return returnObj = {
        //         // tradeDate: indiaTime,        
        //         user_id: id,
        //         trade_id: resultAdminTradeEnter._id,
        //         msg: "user does not set quantity of trade",
        //         accessToken: access_key
        //     };
        // }

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error.message));
    }
}

export const sellTradeFunction = async (req: Request, res: Response, userdata, body) => {

    try {
        let obj;
        const buyTradeData = await userTrade.findOne({ trade_id: body.id });
        if (buyTradeData && buyTradeData.trade_id === body.id) {
            const id = userdata._id;
            let quantity = (await tradeQuantity.findOne({ user_id: id }))?.quantity || 0;
            if (quantity > 0 && userdata.isKiteLogin === true) {
                for (const sellData of buyTradeData.trade) {
                    if (String(sellData.user_id) === String(id) && !sellData.isSelled && sellData.quantity > 0 && quantity !== 0 && sellData.tradingsymbol === body.tradingsymbol) {
                        quantity -= sellData.quantity;
                        const order_id = sellData.buyOrderId;
                        const random5DigitNumber = generateRandomNumber();
                        const sellrequireddata: any = {
                            access_key: sellData.access_key,
                            id: id,
                            tradingsymbol: body.tradingsymbol,
                            quantity: quantity,
                            exchange: body.exchange,
                            order_type: body.order_type,
                            product: body.product
                        };

                        // sell(sellrequireddata);

                        const profit = (Number(sellData.quantity) * Number(body.sellPrice) * Number(buyTradeData.loatSize)) - (Number(sellData.quantity) * Number(sellData.buyKitePrice) * Number(buyTradeData.loatSize));
                        console.log((sellData.quantity) * Number(sellData.buyKitePrice) * Number(buyTradeData.loatSize))
                        await userTrade.updateOne(
                            { "trade.user_id": id, "trade.buyOrderId": order_id },
                            {
                                $set: {
                                    "trade.$.isSelled": true,
                                    "trade.$.sellAt": indiaTime,
                                    "trade.$.sellOrderId": random5DigitNumber,
                                    "trade.$.sellKitePrice": body.sellPrice,
                                    "trade.$.profit": profit,
                                    "trade.$.selltradeStatus": null

                                },
                            });

                        const data = await userTrade.findOne({ "trade.user_id": id, "trade.buyOrderId": order_id });
                        for (const tradeData of data.trade) {
                            if (String(tradeData.user_id) === String(id)) {
                                return obj = tradeData
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error.message));
    }
}