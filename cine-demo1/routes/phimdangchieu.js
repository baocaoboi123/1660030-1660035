var express = require('express');
var router = express.Router();

const asyncHandler =  require('express-async-handler');
const Email = require('../models/email');
const Phim = require('../models/phim.model');



router.get('/',asyncHandler(async function(req, res)
    {
        var title = "PHIM ĐANG CHIẾU"
        const found =await Phim.find_All();
        var list_phimdangchieu = found;

        res.render('movies/phimdangchieu', { layout: './layouts/sidebar', list_phimdangchieu, title});
    }));

    router.post('/',asyncHandler(async function(req, res, next) {
        
        
        const {title_tenphim} = req.body;
        
        if (title_tenphim !== undefined){
            
                res.redirect(`/phim/${title_tenphim}`);
            }else{
                res.redirect('/phimdangchieu');
            }


    }));

module.exports = router;