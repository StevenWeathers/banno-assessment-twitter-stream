"use strict";
const Hapi = require('hapi');
const server = new Hapi.Server();
const tweets = require('./lib/tweets');

tweets.setConfig({
    consumerKey: process.env.consumer_key || null,
    consumerSecret: process.env.consumer_secret || null,
    accessToken: process.env.access_token || null,
    accessTokenSecret: process.env.access_token_secret || null
});

server.connection({
    port: 3000
});

server.route({
    method: 'GET',
    path:'/metrics',
    handler: function (request, reply) {
        return reply(tweets.getMetrics());
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }

    console.log(`Server running at: ${server.info.uri}`);
    tweets.start();
});
