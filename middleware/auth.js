module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.session.userId) {
            return next();
        }
        res.redirect('/login');
    },
    forwardAuthenticated: function (req, res, next) {
        if (!req.session.userId) {
            return next();
        }
        res.redirect('/dashboard');
    }
};
