module.exports = function LoggedIn(req, res, next)
{
    if (!req.currentUser) {
        res.redirect('/');
    }
    else{
        next();
    }
};

