"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockQuantity = void 0;
const stockQuantity = (quantity, fund, totalprice) => {
    const userFund = fund;
    if (totalprice > userFund) {
        const newQty = (userFund * quantity) / totalprice;
        const qty = Math.floor(newQty);
        return qty;
    }
};
exports.stockQuantity = stockQuantity;
//# sourceMappingURL=testing.js.map