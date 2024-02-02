"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellstock = exports.buystock = void 0;
const database_1 = require("../database");
const common_1 = require("../common");
const userdata_json_1 = __importDefault(require("../helpers/userdata.json"));
const funding_json_1 = __importDefault(require("../helpers/funding.json"));
const response_1 = require("../helpers/response");
const testing_1 = require("../helpers/testing");
const mongoose_1 = __importDefault(require("mongoose"));
const jsondata = userdata_json_1.default;
const funddata = funding_json_1.default;
const ObjectId = mongoose_1.default.Types.ObjectId;
const buystock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let buyAT = new Date();
        let options = { timeZone: 'Asia/kolkata', hour12: false };
        let indiaTime = buyAT.toLocaleString('en-US', options);
        console.log('indiaTime', indiaTime);
        const fundObj = funddata["data"];
        const body = req.body;
        const price = body.quantity * body.price;
        const totalprice = price.toFixed(11);
        const fund = Number(fundObj['equity'].net.toFixed(11));
        const adminTradeEnter = new database_1.adminTrade({
            tradingsymbol: body.tradingsymbol,
            exchange: body.exchange,
            transaction_type: body.transaction_type,
            order_type: body.order_type,
            // quantity: body.quantity,
            product: body.product,
            buyPrice: body.price,
            buyAT: indiaTime
        });
        const resultAdminTradeEnter = yield adminTradeEnter.save();
        const alluserdata = yield database_1.userModel.find();
        console.log('👻alluserdata', alluserdata);
        let userTradeEnter = [];
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
                    lessQuantity: false,
                    tradeStatus: null,
                });
            }
            else if (Number(totalprice) > Number(fund)) {
                const quantity = (0, testing_1.stockQuantity)(body.quantity, fund, Number(totalprice));
                if (quantity != 0) {
                    userTradeEnter.push({
                        trade_id: resultAdminTradeEnter._id,
                        user_id: id,
                        order_id: "123456",
                        quantity: quantity,
                        isSelled: false,
                        buyAT: new Date(),
                        accessToken: alluserdata[i].access_key,
                        lessQuantity: true,
                        TradeStatus: null,
                    });
                }
                else if (quantity === 0) {
                    userTradeEnter.push({
                        trade_id: resultAdminTradeEnter._id,
                        msg: "in insufficient balance",
                        accessToken: alluserdata[i].access_key
                    });
                }
            }
        }
        const insertdata = new database_1.userTrade({
            trade: userTradeEnter
        });
        var resultUserTradeEnter = yield insertdata.save();
        // kite.placeOrder(orderParams, (err, response) => {
        //     if (err) {
        //         console.error("Error placing order:", err);
        //     } else {
        //         console.log("Order placed successfully:", response);
        //     }
        // });
        // console.log(orderParams);
        return res.status(200).json(new common_1.apiResponse(200, "buy stock details", { resultAdminTradeEnter, resultUserTradeEnter }, {}));
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, response_1.responseMessage.internalServerError, {}, error));
    }
});
exports.buystock = buystock;
// sell stock
const sellstock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const price = body.quantity * body.price;
        // const totalprice = price.toFixed(11);
        const adminTradeEnter = new database_1.adminTrade({
            tradingsymbol: body.tradingsymbol,
            exchange: body.exchange,
            transaction_type: body.transaction_type,
            order_type: body.order_type,
            quantity: body.quantity,
            product: body.product,
            sellPrice: body.price,
            sellAT: new Date()
        });
        const resultAdminTradeEnter = yield adminTradeEnter.save();
        const alluserdata = yield database_1.userModel.find();
        let userTradeEnter = [];
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
        const insertdata = new database_1.userTrade({
            trade: userTradeEnter
        });
        var resultUserTradeEnter = yield insertdata.save();
        // kite.placeOrder(orderParams, (err, response) => {
        //     if (err) {
        //         console.error("Error placing order:", err);
        //     } else {
        //         console.log("Order placed successfully:", response);
        //     }
        // });
        // console.log(orderParams);
        return res.status(200).json(new common_1.apiResponse(200, "sell stock details", { resultAdminTradeEnter, resultUserTradeEnter }, {}));
    }
    catch (error) {
        return res.status(500).json(new common_1.apiResponse(500, response_1.responseMessage.internalServerError, {}, error));
    }
});
exports.sellstock = sellstock;
//# sourceMappingURL=tradeAction.js.map