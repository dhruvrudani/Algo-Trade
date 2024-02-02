export const stockQuantity = (quantity, fund , totalprice) => {
    const userFund = fund;

    if (totalprice > userFund) {
        const newQty = (userFund * quantity) / totalprice;
        const qty = Math.floor(newQty);
        return qty;
    }

};
