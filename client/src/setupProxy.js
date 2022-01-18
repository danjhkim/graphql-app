const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
	app.use(
		['/graphql'],
		createProxyMiddleware({
			target: 'http://localhost:5000',
		}),
	);
};

// THIS proxies all client requests to the backend address
// REMMBER THIS FORWARDS THE REQUEST TO THE SPECIFIED ADDRESS

// IT DOESNT ACTUALLY DEAL WTH CORS IF THE BACKEND WONT ACCEPT IT

//react looks for a file of this name and uses it.

//only works for dev not production
