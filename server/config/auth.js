module.exports = {
	API_PATH: "/api",
	isLoggedIn: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.status(401).end();
	},
	isAdmin: function (req, res, next) {
		if (req.isAuthenticated() && req.user.admin) {
			return next();
		}
		res.status(401).end();
	}
};