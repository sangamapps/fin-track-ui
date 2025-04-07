const utils = {
    getFormattedAmount: (amount) => {
        return amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
        });
    },
    getParsedAmount: (amount) => {
        return utils.getFormattedAmount(parseFloat(amount));
    },
}

export default utils;