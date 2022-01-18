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
	// var whitelist = ['http://localhost:3000', 'http://localhost:4000'];
} else {
	// var whitelist = ['https://booklist-graphql.herokuapp.com'];
	// app.use(helmet());
	// let options = {
	// 	directives: {
	// 		scriptSrc: [
	// 			"'self'",
	// 			'unsafe-inline',
	// 			'unsafe-eval',
	// 			'http://gc.kis.v2.scr.kaspersky-labs.com',
	// 			'https://booklist-graphql.herokuapp.com',
	// 		],
	// 	},
	// };
	// app.use(helmet.contentSecurityPolicy(options));
}

app.use(morgan('combined'));

var corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
};

// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
// 	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

// app.use(limiter);

app.use(cors());

//mongoDB connect
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
app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }));

if (process.env.NODE_ENV === 'production') {
	//! only production cuz development u dont wanna constantly build you just run dev on client and setup a proxy
	//if in production and the routes arent in authroutes anb billingroutes check react
	const path = require('path');

	// serve production assets e.g. main.js if route exists
	//! checking reach folders
	app.use(express.static('client/build'));

	// serve index.html if route is not recognized
	//! if not found just send the index.html
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Listening port ${PORT}`);
});
