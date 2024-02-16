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

//get trade data for admin

export const trade_get = async (req: Request, res: Response) => {
    let body = req.body;
    try {
        const alltrade = [];
        if (body.type === 0) { //admin
            const tradedata = await adminTrade.find();
            tradedata.forEach(data => {
                if ((data.sellPrice === null || data.sellPrice === 0) && data.sellAT === null) {
                    alltrade.push(data);
                }
            });
        }

        return res.status(200).json(new apiResponse(200, "all trade data", { alltrade }, {}));

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }

}

//get trade data for user

export const user_trade_get = async (req: Request, res: Response) => {
    let body = req.body;
    try {
        const alltrade = [];
        if (body.type === 1 && body.id !== null) { //user
            const tradedata = await userTrade.find();
            tradedata.forEach(data => {
                let e = data.trade
                for (data of e) {

                    if (String(data.user_id) === String(body.id) && data.isSelled === false) {
                        alltrade.push(e)
                    }
                }

            });
        }

        return res.status(200).json(new apiResponse(200, "all trades data", { alltrade }, {}));

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }

}

export const profit_loss = async (req: Request, res: Response) => {
    let body = req.body;
    const customizedTime = usTime.toLocaleDateString('en-US', options);

    try {
        //for single day
        if (body.type === 0) { // admin
            let money = 0;
            const buyTradeData = await userTrade.find({ tradeTime: customizedTime });

            if (buyTradeData) {
                buyTradeData.forEach((e) => {
                    e['trade'].forEach((data) => {
                        if (data.isSelled === true) {
                            money = money + data.profit;
                        }
                    })
                })
            }
            return res.status(200).json(new apiResponse(200, "data of profit and loss is", money, {}));
        } else if (body.type === 1) {
            let invested = 0;
            let totalinvested = 0;
            let money = 0;
            const buyTradeData = await userTrade.find();

            if (buyTradeData) {
                buyTradeData.forEach((e) => {
                    e['trade'].forEach((data) => {
                        if (data.isSelled === true) {
                            money = money + data.profit;
                            invested = invested + (data.buyKitePrice * data.quantity);
                        }
                    })
                    console.log(invested)
                    totalinvested = invested * e.loatSize
                })
            }

            console.log(totalinvested);
            const calculation = (money / totalinvested) * 100;
            return res.status(200).json(new apiResponse(200, "data of profit and loss is", { money, calculation }, {}));
        }
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

// API for calculate investment money

export const totalInverstment = async (req: Request, res: Response) => {
    try {
        const tradedata = await userTrade.find();
        let invested = 0;
        let totalinvested = 0;

        if (tradedata) {
            tradedata.forEach((e) => {
                e['trade'].forEach((data) => {
                    if (data.isSelled === false) {
                        invested = invested + (data.buyKitePrice * data.quantity);
                    }
                })
                console.log(invested)
                totalinvested = invested * e.loatSize
            })
        }
        return res.status(200).json(new apiResponse(200, "data of total investment", { totalinvested }, {}));
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}
// API market value

export const marketValue = async (req: Request, res: Response) => {
    try {
        const tradedata = await userTrade.find();
        const priceArray = tradedata.map((e) => {
            const filteredTrades = e['trade'].filter((data) => !data.isSelled);
            const totalQty = filteredTrades.reduce((sum, trade) => sum + trade.quantity, 0);
            return totalQty !== 0 ? { table: { tradeSymbol: filteredTrades[0].tradingsymbol, totalQty } } : null;
        }).filter(Boolean);

        return res.status(200).json(new apiResponse(200, "data of total investment", { priceArray }, {}));
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}