export default {
    applyRules: (transaction, rules) => {
        const tags = [];
        rules.forEach(rule => {
            const { _id, keywords, tag } = rule;
            transaction.appliedRules = transaction.appliedRules || {};
            if (transaction.appliedRules[_id] == 0) return;
            const description = _.toLower(transaction.description);
            if (_.some(_.split(_.toLower(keywords), ","), (word) => description.includes(_.trim(word)))) {
                transaction.appliedRules[_id] = 1;
                tags.push(tag);
            }
        });
        transaction.tags = tags;
    },
}