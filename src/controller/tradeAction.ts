import { KiteConnect } from "kiteconnect";
import config from "config";
import { adminTrade, userModel, userTrade, tradeQuantity } from "../database";
import { apiResponse } from "../common";
import data from "../helpers/userdata.json";
import fund from "../helpers/funding.json";
import { responseMessage } from "../helpers/response";
import { stockQuantity } from "../helpers/testing";
import { encryptData } from "../common/encryptDecrypt";
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

export const buystock = async (req: Request, res: Response) => {
    try {


        console.log('indiaTime', indiaTime)
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
        for (let i = 0; i < alluserdata.length; i++) {
            const id = alluserdata[i]._id;
            const quantity = await tradeQuantity.findById({ user_id: id });

            const price = quantity.quantity * body.price;
            const totalprice = price.toFixed(11);
            const fund = Number(fundObj['equity'].net.toFixed(11));
            //here get user live margin data 
            if (alluserdata[i].access_key && Number(totalprice) <= Number(fund && alluserdata[i].isKiteLogin === true)) {
                userTradeEnter.push({
                    trade_id: resultAdminTradeEnter._id,
                    user_id: id,
                    tradingsymbol: body.tradingsymbol,
                    buyOrderId: "123456",
                    quantity: quantity.quantity,
                    isSelled: false,
                    buyAT: indiaTime,
                    accessToken: alluserdata[i].access_key,
                    lessQuantity: false,
                    buytradeStatus: null,
                });
            } else if (Number(totalprice) > Number(fund) && alluserdata[i].isKiteLogin === true) {

                const qty = await tradeQuantity.findById({ user_id: alluserdata[i]._id });
                const quantity = stockQuantity(qty.quantity, fund, Number(totalprice))
                if (quantity != 0) {
                    userTradeEnter.push({
                        trade_id: resultAdminTradeEnter._id,
                        user_id: id,
                        tradingsymbol: body.tradingsymbol,
                        buyOrderId: "123456",
                        quantity: quantity,
                        isSelled: false,
                        buyAT: indiaTime,
                        accessToken: alluserdata[i].access_key,
                        lessQuantity: true,
                        buytradeStatus: null,
                    });
                } else if (quantity === 0) {
                    userTradeEnter.push({
                        trade_id: resultAdminTradeEnter._id,
                        msg: "in insufficient balance",
                        accessToken: alluserdata[i].access_key
                    });
                }
            }
        }
        const insertdata = new userTrade({
            trade: userTradeEnter

        })
        var resultUserTradeEnter = await insertdata.save();

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
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

// sell stock
export const sellstock = async (req: Request, res: Response) => {
    try {
        const body = req.body
        const price = body.quantity * body.price;
        // const totalprice = price.toFixed(11);

        // const adminTradeEnter: any = new adminTrade({
        //     tradingsymbol: body.tradingsymbol,
        //     exchange: body.exchange,
        //     transaction_type: body.transaction_type,
        //     order_type: body.order_type,
        //     quantity: body.quantity,
        //     product: body.product,
        //     sellPrice: body.price,
        //     sellAT: indiaTime
        // })

        // const resultAdminTradeEnter = await adminTradeEnter.save();

        const alluserdata = await userModel.find();
        const tradeData = await userTrade.find();
        let sellUserData = [];
        if (tradeData) {

            for (let i = 0; i < alluserdata.length; i++) {
                const id = alluserdata[i]._id;
                const quantity = await tradeQuantity.findById({ user_id: alluserdata[i]._id });

                let counter = quantity;
                if (counter !== 0 && alluserdata[i].isKiteLogin === true) {
                    for (let j = 0; j < tradeData.length; j++) {
                        let data = tradeData[j].trade;
                        for (let k = 0; k < data.length; k++) {
                            if (String(data[k].user_id) === String(id) && data[k].isSelled === false && data[k].quantity > 0 && counter !== 0 && data[k].tradingsymbol === body.tradingsymbol) {
                                counter = counter - data[k].quantity;
                                const order_id = data[k].buyOrderId;
                                const updatedata = await userTrade.findOneAndUpdate({ "trade.buyOrderId": order_id }, { $set: { "trade.$.isSelled": true, "trade.$.sellAt": indiaTime, "trade.$.sellOrderId ": "9090" } })
                                sellUserData.push(updatedata);
                            }
                        }
                    }
                }
            }
            return res.status(200).json(new apiResponse(200, "sell stock details", sellUserData, {}));
        }

        // kite.placeOrder(orderParams, (err, response) => {
        //     if (err) {
        //         console.error("Error placing order:", err);
        //     } else {
        //         console.log("Order placed successfully:", response);
        //     }
        // });


    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

//get quantity from the user

export const getQuantity = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const quantity = await tradeQuantity.find({ user_id: body.id });
        const userData = await userModel.findById({ _id: body.id });
        if (!userData) {
            return res.status(400).json(new apiResponse(400, "user not found", {}, {}));
        } else if (userData) {

            if (quantity.length === 0) {

                if (userData.isKiteLogin === true && userData.isActive === true && userData.isDelete === false && userData.isVerified === true) {
                    let insertdata = new tradeQuantity({
                        user_id: body.id,
                        quantity: body.quantity,
                        setAt: indiaTime,
                    })
                    const data = await insertdata.save();
                    return res.status(200).json(new apiResponse(200, "quantity added successful", { data }, {}));
                }

                else if (userData.isKiteLogin === false) {
                    return res.status(400).json(new apiResponse(400, "kite login is required", {}, {}));
                }
                else if (userData.isActive === false) {
                    return res.status(400).json(new apiResponse(400, "user is not active", {}, {}));
                }
                else if (userData.isDelete === false) {
                    return res.status(400).json(new apiResponse(400, "user not exist", {}, {}));
                }
                else if (userData.isVerified === false) {
                    return res.status(400).json(new apiResponse(400, "user verification is required", {}, {}));
                }

            } else if (quantity.length !== 0) {
                const insertdata = await tradeQuantity.findOneAndUpdate({ user_id: body.id }, { $set: { quantity: body.quantity, setAt: indiaTime } });
                return res.status(200).json(new apiResponse(200, "quantity update successful", { insertdata }, {}));
            }
        }

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}
