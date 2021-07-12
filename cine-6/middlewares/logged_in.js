module.exports = function LoggedIn(req, res, next)
{
    if (!req.currentUser) {
        res.redirect('/auth/login');
    }
    else{
        next();
    }
};

