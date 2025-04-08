const utils = {
    getFormattedAmount: (amount) => {
        return amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
        });
    },
}

export default utils;