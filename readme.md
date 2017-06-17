## Banno Assessment Twitter Stream

This is an example RESTful API in [Node]()
and running on [Docker](https://www.docker.com/)
that returns metrics on twitter stream.

Ideally this would have Unit Tests/ESLinting for code quality coverage, as well as utilize a database ([Influx](https://www.influxdata.com/) or [Prometheus](https://prometheus.io/) for instance) rather than storing data in memory which would not scale over time.

## Installation

This API is best served with [Docker](https://www.docker.com/)

You'll need to pass the enviornment variables like below (be sure to fill out the actual values) for the API keys/tokens.
```bash
docker build -t banno-twitter .
docker run -d -p 8080:8080 --name=banno-twitter banno-twitter --env consumer_key="" --env consumer_secret="" --env access_token="" --env access_token_secret=""
```

What about [Docker Compose](https://docs.docker.com/compose/)?

First create the apikeys.env file (filling out the key/token values ;)) to provide the API keys/tokens to the application
```bash
consumer_key=""
consumer_secret=""
access_token=""
access_token_secret=""
```

```bash
docker-compose up --build
```

## Open Source Projects
Project | License
--- | ---
[Docker](https://github.com/docker/docker) | [Apache-2.0](https://github.com/docker/docker/blob/master/LICENSE)
[Node]() | [BSD-3-Clause]()


### ENDPOINT: /metrics

#### Response
```json
{
	seconds: 24,
	minutes: 0,
	hours: 0,
	total: 1148,
	avgPerSecond: 47.833333333333336,
	avgPerMinute: 0,
	avgPerHour: 0,
	percentHash: "14.90",
	percentEmojis: "15.68",
	percentUrls: "22.39",
	percentPics: "0.35",
	topHashtags: "PRODUCE101FINAL, YouTwo4MMVA, 강다니엘",
	topEmojis: "sob, joy, heart",
	topDomains: "twitter.com, du3a.org, bit.ly"
}
```