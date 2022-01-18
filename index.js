const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
let options = {
	directives: {
		scriptSrc: [
			"'self'",
			'unsafe-inline',
			'unsafe-eval',
			'http://gc.kis.v2.scr.kaspersky-labs.com',
			'https://booklist-graphql.herokuapp.com',
		],
	},
};
app.use(morgan('combined'));

app.use(helmet.contentSecurityPolicy(options));

app.use(helmet());

var whitelist = [
	'http://localhost:3000',
	'http://localhost:4000',
	'https://booklist-graphql.herokuapp.com',
];

var corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
};

//disabled for heroku
// app.use(cors(corsOptions));

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(result => console.log('connected to db'))
	.catch(err => console.log(err));

// graphqlHTTP we use it as middle as a single route and that route will be an endpoint API to the database
// u can use something liker app.get('/graphql', graphqlHTTP) but this will only allow for get
// use app.use to ensure middleware is used for specific end point but all commands
//! graphiql is specially used for graphiql dev tool
app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: false }));

if (process.env.NODE_ENV === 'production') {
	// Express will serve up production assets
	// like our main.js file, or main.css file!
	app.use(express.static('client/build'));

	// Express will serve up the index.html file
	// if it doesn't recognize the route
	const path = require('path');
	app.get('/*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Listening port ${PORT}`);
});
