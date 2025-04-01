export default {
    applyRules: (transaction, rules) => {
        rules.forEach(rule => {
            const { _id, contains } = rule;
            transaction.appliedRules = transaction.appliedRules || {};
            if (_id in transaction.appliedRules) return;
            const description = _.lowerCase(transaction.description);
            const keywords = _.split(_.lowerCase(contains), ",");
            if (_.some(keywords, (word) => description.includes(word))) {
                transaction.appliedRules[_id] = 1;
            }
        });
    },
}