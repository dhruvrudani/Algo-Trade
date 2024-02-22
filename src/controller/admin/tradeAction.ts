import { KiteConnect } from "kiteconnect";
import config from "config";
import { adminTrade, userModel, userTrade, tradeQuantity } from "../../database";
import { apiResponse } from "../../common";
import data from "../../helpers/userdata.json";
import fund from "../../helpers/funding.json";
import { responseMessage, stockQuantity } from "../../helpers/index";
import { buy, sell, getFundsAndMargins, buyTradeFunction } from "../../helpers/kiteConnect/index";
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

// random number generator for order_id in sell trade and buy trade

// Function to generate a random 5-digit number
function generateRandomNumber() {
    return Math.floor(10000 + Math.random() * 90000);
}

// Generate and print a random 5-digit number



export const buystock = async (req: Request, res: Response) => {
    try {
        const random5DigitNumber = generateRandomNumber();
        let userTradeEnter: any = [];
        const body = req.body
        const adminTradeEnter: any = new adminTrade({
            tradingsymbol: body.tradingsymbol,
            exchange: body.exchange,
            transaction_type: body.transaction_type,
            order_type: body.order_type,
            product: body.product,
            buyPrice: body.price,
            buyAT: indiaTime
        })

        const resultAdminTradeEnter = await adminTradeEnter.save();

        const alluserdata = await userModel.find({ isActive: true, isDelete: false, isVerified: true });

        const promises = alluserdata.map(async userData => {
            const quantityObj = await tradeQuantity.findOne({ user_id: userData.id });
            return buyTradeFunction(req, res, userData, body, resultAdminTradeEnter, quantityObj);
        });

        const userTradeResults = await Promise.all(promises);
        userTradeEnter = userTradeResults.filter(result => result !== undefined);

        const customizedTime = usTime.toLocaleDateString('en-US', options);
        const insertdata = new userTrade(
            {
                trade_id: resultAdminTradeEnter._id,
                stockName: body.StockName,
                loatSize: body.LoatSize,
                tradeTime: customizedTime,
                trade: userTradeEnter,
            });

        const resultUserTradeEnter = await insertdata.save();

        return res.status(200).json(new apiResponse(200, "buy stock details", { resultAdminTradeEnter, resultUserTradeEnter }, {}));
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error.message));
    }
}



export const sellstock = async (req: Request, res: Response) => {
    try {
        const { id, sellPrice, tradingsymbol } = req.body;
        const body = req.body
        const buyTradeData = await userTrade.findOne({ trade_id: id });
        const random5DigitNumber = generateRandomNumber();
        const updateAdminTrade = await adminTrade.findOneAndUpdate({ _id: id }, { $set: { sellPrice, sellOrderId: random5DigitNumber, sellAT: indiaTime } });
        let sellUserData = [];
        const alluserdata = await userModel.find({ isActive: true, isDelete: false, isVerified: true });
        for (const userdata of alluserdata) {
            if (buyTradeData && buyTradeData.trade_id === id) {
                const id = userdata._id;
                let quantity = (await tradeQuantity.findOne({ user_id: id }))?.quantity || 0;
                if (quantity > 0 && userdata.isKiteLogin === true) {
                    for (const sellData of buyTradeData.trade) {
                        if (String(sellData.user_id) === String(id) && !sellData.isSelled && sellData.quantity > 0 && quantity !== 0 && sellData.tradingsymbol === tradingsymbol) {
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

                            const profit = (Number(sellData.quantity) * Number(sellPrice) * Number(buyTradeData.loatSize)) - (Number(sellData.quantity) * Number(sellData.buyKitePrice) * Number(buyTradeData.loatSize));
                            console.log((sellData.quantity) * Number(sellData.buyKitePrice) * Number(buyTradeData.loatSize))
                            await userTrade.updateOne(
                                { "trade.user_id": id, "trade.buyOrderId": order_id },
                                {
                                    $set: {
                                        "trade.$.isSelled": true,
                                        "trade.$.sellAt": indiaTime,
                                        "trade.$.sellOrderId": random5DigitNumber,
                                        "trade.$.sellKitePrice": sellPrice,
                                        "trade.$.profit": profit
                                    },
                                });

                            const data = await userTrade.findOne({ "trade.user_id": id, "trade.buyOrderId": order_id });
                            for (const tradeData of data.trade) {
                                if (String(tradeData.user_id) === String(id)) {
                                    sellUserData.push(tradeData)
                                }
                            }
                        }
                    }
                }
            }
        }
        return res.status(200).json(new apiResponse(200, "sell stock details", sellUserData, {}));
    } catch (error) {
        return res
            .status(500)
            .json(new apiResponse(500, responseMessage.internalServerError, {}, error.message));
    }
};


export const getQuantity = async (req: Request, res: Response) => {
    try {
        const { id, quantity } = req.body;

        const userData = await userModel.findById(id);

        if (!userData) {
            return res.status(400).json(new apiResponse(400, "User not found", {}, {}));
        }

        if (!userData.isKiteLogin) {
            return res.status(400).json(new apiResponse(400, "Kite login is required", {}, {}));
        }

        if (!userData.isActive) {
            return res.status(400).json(new apiResponse(400, "User is not active", {}, {}));
        }

        if (!userData.isVerified) {
            return res.status(400).json(new apiResponse(400, "User verification is required", {}, {}));
        }

        const updateOptions = { upsert: true, new: true, setDefaultsOnInsert: true };

        const result = await tradeQuantity.findOneAndUpdate(
            { user_id: id },
            { $set: { quantity, setAt: indiaTime } },
            updateOptions
        );

        const message = quantity.length === 0 ? "Quantity added successfully" : "Quantity updated successfully";

        return res.status(200).json(new apiResponse(200, message, { data: result }, {}));
    } catch (error) {
        return res.status(500).json(new apiResponse(500, "Internal Server Error", {}, error));
    }
};

//set the request token in the data base

export const login = async (req: Request, res: Response) => {
    try {
        const request_token = req.query.request_token;
        const body = req.body;
        if (request_token) {
            const data = await userModel.findOne({ _id: body.id });
            if (data) {
                const updatedata = await userModel.findOneAndUpdate({ _id: body.id }, { $set: { request_token } })
                return res.status(200).json(new apiResponse(200, "access token", { request_token }, {}));
            } else {
                return res.status(402).json(new apiResponse(402, "in valid user id", {}, {}));
            }
        } else {
            return res.status(402).json(new apiResponse(402, "request token is required", {}, {}));
        }
    } catch (error) {
        return res.status(500).json(new apiResponse(500, "Internal Server Error", {}, error));
    }
}