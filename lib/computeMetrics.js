"use strict";

const findTopN = require('./findTopN'); // custom utility method to find the top N items in an array of strings

const computeMetrics = (metrics) => {
    let avgPerSecond = (metrics.seconds > 0) ? (metrics.total / metrics.seconds) : 0;
    let avgPerMinute = (metrics.minutes > 0) ? (metrics.total / metrics.minutes) : 0;
    let avgPerHour = (metrics.hours > 0) ? (metrics.total / metrics.hours) : 0;
    let percentHash = ((metrics.hasHash / metrics.total) * 100).toFixed(2);
    let percentEmojis = ((metrics.hasEmojis / metrics.total) * 100).toFixed(2);
    let percentUrls = ((metrics.hasUrl / metrics.total) * 100).toFixed(2);
    let percentPics = ((metrics.hasPic / metrics.total) * 100).toFixed(2);
    let topTags = findTopN(metrics.hashes, 3).join(", ");
    let topDomains = findTopN(metrics.domains, 3).join(", ");
    let topEmojis = findTopN(metrics.emojis, 3).join(", ");

    return {
        seconds: metrics.seconds,
        minutes: metrics.minutes,
        hours: metrics.hours,
        total: metrics.total,
        avgPerSecond,
        avgPerMinute,
        avgPerHour,
        percentHash,
        percentEmojis,
        percentUrls,
        percentPics,
        topHashtags: topTags,
        topEmojis,
        topDomains
    };
};

module.exports = computeMetrics;
