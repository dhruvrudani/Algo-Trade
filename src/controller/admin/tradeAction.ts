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
import { ObjectId } from 'mongoose';
const jsondata = data;
const funddata = fund;
const { Types } = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
let usTime = new Date()
let options = { timeZone: 'Asia/kolkata', hour12: false }
let indiaTime = usTime.toLocaleString('en-US', options)

export const buystock = async (req: Request, res: Response) => {
    console.log('req.boy', req.body)
    try {
        console.log('👻indiaTime', indiaTime)
        const fundObj = funddata["data"];
        const body = req.body
        const adminTradeEnter: any = new adminTrade({
            tradingsymbol: body.tradingsymbol,
            exchange: body.exchange,
            transaction_type: body.transaction_type,
            order_type: body.order_type,
            // quantity: body.quantity,
            product: body.product,
            buyPrice: body.price,
            buyAT: indiaTime
        })


        const resultAdminTradeEnter = await adminTradeEnter.save();

        const alluserdata = await userModel.find();
        let userTradeEnter: any = [];
        console.log('👻resultAdminTradeEnter', resultAdminTradeEnter, "allUserData", alluserdata)

        for (const userData of alluserdata) {

            const { _id: id, access_key, isKiteLogin } = userData;
            const quantityObj = await tradeQuantity.findOne({ user_id: id });
            if (quantityObj) {
                const { quantity } = quantityObj;
                console.log('👻👻quantity', quantity)
                const price = (quantity * body.price).toFixed(11);
                const fund = Number(fundObj['equity'].net.toFixed(11));

                if (access_key && Number(price) <= fund) {
                    userTradeEnter.push({
                        user_id: id,
                        tradingsymbol: body.tradingsymbol,
                        buyOrderId: "123456",
                        quantity,
                        isSelled: false,
                        buyAT: indiaTime,
                        accessToken: access_key,
                        lessQuantity: false,
                        buytradeStatus: null,
                    });
                } else {
                    const updatedQuantity = stockQuantity(quantity, fund, Number(price));

                    if (updatedQuantity > 0) {
                        userTradeEnter.push({
                            user_id: id,
                            tradingsymbol: body.tradingsymbol,
                            buyOrderId: "123456",
                            quantity: updatedQuantity,
                            isSelled: false,
                            buyAT: indiaTime,
                            accessToken: access_key,
                            lessQuantity: true,
                            buytradeStatus: null,
                        });
                    } else {
                        userTradeEnter.push({
                            trade_id: resultAdminTradeEnter._id,
                            msg: "Insufficient balance",
                            accessToken: access_key
                        });
                    }
                }
            }
            else {
                console.log('User not found in tradeQuantity collection:', id);
            }
            console.log('✨🔥✨✨userTradeEnter', userTradeEnter);
        }

        console.log('👻👻userTradeEnter', userTradeEnter)
        const insertdata = new userTrade(
            {
                trade_id: resultAdminTradeEnter._id,
                trade: userTradeEnter
            });

        console.log('👻insertdata', insertdata)
        const resultUserTradeEnter = await insertdata.save();



        // kite.placeOrder(orderParams, (err, response) => {
        //     if (err) {
        //         console.error("Error placing order:", err);
        //     } else {
        //         console.log("Order placed successfully:", response);
        //     }
        // });

        // console.log(orderParams);

        return res.status(200).json(new apiResponse(200, "buy stock details", { resultAdminTradeEnter, resultUserTradeEnter }, {}));

    } catch (error) {
        console.log('✨',)
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error.message));
    }
}

// sell stock
export const sellstock = async (req: Request, res: Response) => {
    try {
        const body = req.body
        const id = body.id;
        const price = body.quantity * body.price;
       
        const buyTradeData = await userTrade.findOne({ trade_id: id })
        const buyTradeId = buyTradeData.trade_id

        const buyTradeDataLength = buyTradeData.trade
    
        if (buyTradeId === id) {

            for (const sellData of buyTradeDataLength) {
                console.log('How many time runing ', sellData)
                console.log('sellData.user_id', sellData.user_id)
            }
        }

        const adminTradeEnter: any = new adminTrade({
            tradingsymbol: body.tradingsymbol,
            exchange: body.exchange,
            transaction_type: body.transaction_type,
            order_type: body.order_type,
            product: body.product,
            sellPrice: body.price,
            sellAT: indiaTime
        })

        const resultAdminTradeEnter = await adminTradeEnter.save();

        const alluserdata = await userModel.find();
        const tradeData = await userTrade.find();
        let sellUserData = [];
        if (tradeData) {

            for (let userdata of alluserdata) {
                const id = userdata._id;
                let quantity = await tradeQuantity.findOne({ user_id: id });
                quantity = quantity.quantity;
                let counter = quantity;
                if (counter !== 0 && userdata.isKiteLogin === true) {
                    for (let trade of tradeData) {
                        let data = trade.trade;

                        for (let Onedata of data) {

                            // console.log(Onedata);
                            if (String(Onedata.user_id) === String(id) && Onedata.isSelled === false && Onedata.quantity > 0 && counter !== 0 && Onedata.tradingsymbol === body.tradingsymbol) {
                                counter = counter - Onedata.quantity;
                                const order_id = Onedata.buyOrderId;
                                const updatedata = await userTrade.findOneAndUpdate({ "trade.buyOrderId": order_id }, { $set: { "trade.$.isSelled": true, "trade.$.sellAt": indiaTime, "trade.$.sellOrderId ": "9090" } })
                                sellUserData.push(updatedata);
                            }
                        }
                    }
                }
            }
        }
        console.log(sellUserData);
        return res.status(200).json(new apiResponse(200, "sell stock details", sellUserData, {}));


        // kite.placeOrder(orderParams, (err, response) => {
        //     if (err) {
        //         console.error("Error placing order:", err);
        //     } else {
        //         console.log("Order placed successfully:", response);
        //     }
        // });


    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error.message));
    }
}

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


export const get_user_quantity = async (req: Request, res: Response) => {
    const { filter, id } = req.body;
    console.log('👻👻', filter, id);

    try {
        let userData = null;

        if (filter === 0) {
            const data = await tradeQuantity.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user_data"
                    }
                }
            ]);
            userData = data;
        } else if (filter === 1) {
            const user = await userModel.findById(id);
            if (!user) {
                return res.status(404).json(new apiResponse(404, "User not found", {}, {}));
            }
            const data = await tradeQuantity.aggregate([
                {
                    $match: { user_id: new ObjectId(id) }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user_data"
                    }
                }
            ]);
            userData = data;
        } else {
            return res.status(400).json(new apiResponse(400, "Invalid filter value", {}, {}));
        }

        return res.status(200).json(new apiResponse(200, "User data fetched successfully", { userData }, {}));
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}
