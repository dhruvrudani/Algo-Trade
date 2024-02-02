import { KiteConnect } from "kiteconnect";
import config from "config";
import { adminTrade, userModel, userTrade } from "../database";
import { apiResponse } from "../common";
import data from "../helpers/userdata.json";
import fund from "../helpers/funding.json";
import { responseMessage } from "../helpers/response";
import { stockQuantity } from "../helpers/testing";
import { encryptData } from "../common/encryptDecrypt";
import mongoose from "mongoose";
import { Request, Response } from 'express'
import jwt from "jsonwebtoken";
const jsondata = data;
const funddata = fund;
const ObjectId = mongoose.Types.ObjectId

export const buystock = async (req: Request, res: Response) => {
    try {
        let buyAT = new Date()
        let options = { timeZone: 'Asia/kolkata', hour12: false }
        let indiaTime = buyAT.toLocaleString('en-US', options)
        console.log('indiaTime', indiaTime)
        const fundObj = funddata["data"];
        const body = req.body
        const price = body.quantity * body.price;
        const totalprice = price.toFixed(11);
        const fund = Number(fundObj['equity'].net.toFixed(11));


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
        console.log('👻alluserdata', alluserdata)
        let userTradeEnter: any = [];
        for (let i = 0; i < alluserdata.length; i++) {
            const id = alluserdata[i]._id;
            //here get user live margin data 
            if (alluserdata[i].access_key && Number(totalprice) <= Number(fund)) {

                userTradeEnter.push({
                    trade_id: resultAdminTradeEnter._id,
                    user_id: id,
                    buyOrderId: "123456",
                    quantity: body.quantity,
                    isSelled: false,
                    buyAT: indiaTime,
                    accessToken: alluserdata[i].access_key,
                    lessQuantity:false,
                    buytradeStatus: null,
                });
            } else if (Number(totalprice) > Number(fund)) {

                const quantity = stockQuantity(body.quantity, fund, Number(totalprice))

                if (quantity != 0) {
                    userTradeEnter.push({
                        trade_id: resultAdminTradeEnter._id,
                        user_id: id,
                        order_id: "123456",
                        quantity: quantity,
                        isSelled: false,
                        buyAT: new Date(),
                        accessToken: alluserdata[i].access_key,
                        lessQuantity:true, 
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

        const adminTradeEnter: any = new adminTrade({
            tradingsymbol: body.tradingsymbol,
            exchange: body.exchange,
            transaction_type: body.transaction_type,
            order_type: body.order_type,
            quantity: body.quantity,
            product: body.product,
            sellPrice: body.price,
            sellAT: new Date()
        })

        const resultAdminTradeEnter = await adminTradeEnter.save();

        const alluserdata = await userModel.find();
        let userTradeEnter: any = [];
        for (let i = 0; i < alluserdata.length; i++) {
            const id = alluserdata[i]._id;
            //here get user live margin data 
            if (alluserdata[i].access_key) {

                userTradeEnter.push({
                    trade_id: resultAdminTradeEnter._id,
                    user_id: id,
                    order_id: "123456",
                    buyAT: new Date(),
                    accessToken: alluserdata[i].access_key
                });
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

        return res.status(200).json(new apiResponse(200, "sell stock details", { resultAdminTradeEnter, resultUserTradeEnter }, {}));
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}
