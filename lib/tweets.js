"use strict";

const _ = require('lodash')
const processUrls = require('./processUrls'); // custom utility method to process urls in the tweet
const computeMetrics = require("./computeMetrics");
const EmojiData = require('emoji-data');
const Twit = require('twit');

let metrics = {
    seconds: 0,
    minutes: 0,
    hours: 0,
    total: 0,
    timestamps: [],
    hasEmojis: 0,
    hasHash: 0,
    hasUrl: 0,
    hasPic: 0,
    domains: [],
    emojis: [],
    hashes: []
};

const processTweet = (tweet) => {
    let urlMetrics = processUrls(tweet.entities.urls);

    if (urlMetrics.hasUrl) {
        ++metrics.hasUrl;

        metrics.domains = metrics.domains.concat(urlMetrics.domains);

        if (urlMetrics.hasPic) {
            ++metrics.hasPic;
        }
    }

    // find emojis
    let hasEmoji = false;
    EmojiData.scan(tweet.text).forEach((ec) => {
        hasEmoji = true;

        metrics.emojis.push(ec.short_name);
    });

    // find hashtags
    let hasHashtag = false;
    let hashTags = [];
    if (tweet.entities.hashtags.length > 0) {
        tweet.entities.hashtags.forEach((tag) => {
            if (tag.text !== null) {
                hasHashtag = true;
                hashTags.push(tag.text);
            }
        });
    }

    if (hasHashtag) {
        ++metrics.hasHash;
        metrics.hashes = metrics.hashes.concat(hashTags);
    }

    if (hasEmoji) {
        ++metrics.hasEmojis;
    }
};

const tweets = {};

let config = {
    consumerKey: null,
    consumerSecret: null,
    accessToken: null,
    accessTokenSecret: null,
    timeoutMs: 60 * 1000  // optional HTTP request timeout to apply to all requests.
};

tweets.setConfig = (options) => {
    config = _.defaults(options, config);
};

tweets.start = () => {
    if (!config.consumerKey || !config.consumerSecret || !config.accessToken || !config.accessTokenSecret) {
        throw new Error("Need to set API keys/tokens to stream tweets");
    }

    // setup the Twitter API
    const T = new Twit({
        consumer_key:         config.consumerKey,
        consumer_secret:      config.consumerSecret,
        access_token:         config.accessToken,
        access_token_secret:  config.accessTokenSecret,
        timeout_ms:           config.timeoutMs
    });

    //  stream a sample of public statuses
    const stream = T.stream('statuses/sample');

    console.log("Tweets streaming started...")

    stream.on('tweet', (tweet) => {
        ++metrics.total;
        metrics.timestamps.push(tweet.timestamp_ms); // not used right now

        processTweet(tweet);
    });

    setInterval(() => {
        // no this isn't ideal for gathering metrics of tweets per second/minute/hour
        // should really use timestamps from tweets but thats a larger effort and better suited to use a metric database
        ++metrics.seconds;

        if (metrics.seconds !== 0 && (metrics.seconds % 60) === 0) {
            ++metrics.minutes;
        }
        if (metrics.minutes !== 0 && (metrics.minutes % 60) === 0) {
            ++metrics.hours;
        }

        let results = computeMetrics(metrics);

        console.log(`
            --- Tweet Metrics ---
            Seconds: ${results.seconds}
            Minutes: ${results.minutes}
            Hours: ${results.hours}

            Total: ${results.total}
            Average per second: ${results.avgPerSecond}
            Average per minute: ${results.avgPerMinute}
            Average per hour: ${results.avgPerHour}

            Percent with HashTags: ${results.percentHash}%
            Top HashTags: ${results.topHashTags}

            Percent with Emojis: ${results.percentEmojis}%
            Top Emojis: ${results.topEmojis}

            Percent with URLs: ${results.percentUrls}%
            Top Domains: ${results.topDomains}

            Percent with Pics: ${results.percentPics}%
            ---------------------

        `);
    }, 1000);
};

tweets.getMetrics = () => {
    return computeMetrics(metrics);
};

module.exports = tweets;
