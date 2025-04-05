export default {
    applyRules: (transaction, rules) => {
        const tags = [];
        rules.forEach(rule => {
            const { _id, contains, tag } = rule;
            transaction.appliedRules = transaction.appliedRules || {};
            if (transaction.appliedRules[_id]) return;
            const description = _.lowerCase(transaction.description);
            const keywords = _.split(_.lowerCase(contains), ",");
            if (_.some(keywords, (word) => description.includes(word))) {
                transaction.appliedRules[_id] = 1;
                tags.push(tag);
            }
        });
        transaction.tags = tags;
    },
}