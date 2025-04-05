export default {
    applyRules: (transaction, rules) => {
        const tags = [];
        rules.forEach(rule => {
            const { _id, contains, tag } = rule;
            transaction.appliedRules = transaction.appliedRules || {};
            if (transaction.appliedRules[_id] == 0) return;
            const description = _.toLower(transaction.description);
            const keywords = _.split(_.toLower(contains), ",");
            if (_.some(keywords, (word) => description.includes(_.trim(word)))) {
                transaction.appliedRules[_id] = 1;
                tags.push(tag);
            }
        });
        transaction.tags = tags;
    },
}