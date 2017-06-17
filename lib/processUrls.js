"use strict";

const processUrls = (urls) => {
    let urlMetrics = {
        hasUrl: false,
        hasPic: false,
        domains: []
    };

    if (urls.length > 0) {
        urls.forEach((url) => {
            if (url.expanded_url !== null) {
                let matches = url.expanded_url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
                let domain = matches && matches[1];

                if (domain !== null) {
                    urlMetrics.hasUrl = true;
                    urlMetrics.domains.push(domain);

                    if (domain.includes('pic.twitter.com') || domain.includes('instagram')) {
                        urlMetrics.hasPic = true;
                    }
                }
            }
        });
    }

    return urlMetrics;
};

module.exports = processUrls;
