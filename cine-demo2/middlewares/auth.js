
const NguoiDungAdmin = require('../models/nguoi_dung_admin.model');
const asyncHandler =  require('express-async-handler');
module.exports = asyncHandler (async function auth(req, res, next){
    const { usersId } = req.session;

    res.locals.currentUser = null;
    if (usersId){
         const user = await NguoiDungAdmin.findById(usersId);
        // User.findById(usersId).then(function(user){
            if(user){
                req.currentUser = user;
                res.locals.currentUser = user;
            }
        //     next();
        // }).catch(next);
        next();
    }
    else{
        next();
    }


    
});




