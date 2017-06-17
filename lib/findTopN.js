"use strict";

const _ = require('lodash');

const findTopN = (items, topN) => {
    let currentItems = items;
    let tops = [];

    for (let i = 0; i < topN; ++i) {
        if (currentItems.length) {
            let nTopItem = _.chain(currentItems).countBy().toPairs().maxBy(_.last).head().value();

            tops.push(nTopItem);

            currentItems = _.filter(currentItems, (item) => {
                return tops.indexOf(item) === -1;
            });
        }
    }

    return tops;
};

module.exports = findTopN;
