"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculation = void 0;
const common_1 = require("../common");
const calculation = (req, res) => {
    try {
        const quantity = req.body.quantity;
        const price = req.body.price;
        const userFund = req.body.fund;
        const totalprice = quantity * price;
        if (totalprice <= userFund) {
            return res.status(200).json(new common_1.apiResponse(200, "buy successful", {}, {}));
        }
        else if (totalprice > userFund) {
            const newQty = (userFund * quantity) / totalprice;
            const qty = Math.floor(newQty);
            return res.status(200).json(new common_1.apiResponse(200, "buy successful with adjusted quantity", { qty, totalprice, userFund }, {}));
        }
    }
    catch (error) {
        console.error("Error in calculation:", error);
        return res.status(500).json(new common_1.apiResponse(500, "Internal Server Error", {}, {}));
    }
};
exports.calculation = calculation;
//# sourceMappingURL=testing%20copy.js.map