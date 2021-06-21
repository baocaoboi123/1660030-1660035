var express = require('express');
var router = express.Router();
const asyncHandler =  require('express-async-handler');
const Phim = require('../models/phim.model');

const SuatChieu = require('../models/suat_chieu.model');

const CumRap = require('../models/cum_rap.model');

const Rap = require('../models/rap.model');

const moment = require('moment');

var ejs = require('ejs');
    router.get('/:tenphim', asyncHandler(async function(req, res, next){
        const tenphim_temp = req.params.tenphim
        const foundPhim = await Phim.findOneMovie(tenphim_temp);

        const foundCumRap = await CumRap.findCR_Rap();
        const foundRap = await Rap.findRap();
        const found_suatchieu = '';
        var tenphim ="";
        var tencumrap = "";
        var tenrap = "";
        res.render('movies/phim', { layout: './layouts/sidebar',tenrap,tencumrap,tenphim, found_suatchieu,foundPhim,foundCumRap,foundRap});
      

    }));

    router.post('/:tenphim', asyncHandler(async function(req, res, next){
        const tenphim_temp = req.params.tenphim

        const { check_option} = req.body;
        if (check_option === '0'){
            

        }else if(check_option === '2'){
            const {ngayxem, tencumrap, tenrap, tenphim} = req.body;

            const found_TenPhim = await Phim.findPhimByID(tenphim);
            const found_IDRap = await Rap.findRapByTenrap(tenrap);
            
            const found_suatchieu = await SuatChieu.findAllSuatChieuBy_Tphim_Rap_ddmmyyy(found_TenPhim[0].Tenphim, found_IDRap[0].IDrap, ngayxem);
    
            const foundPhim = await Phim.findOneMovie(tenphim_temp);

            const foundCumRap = await CumRap.findCR_Rap();
            const foundRap = await Rap.findRap();

            res.render('movies/phim', { layout: './layouts/sidebar',tenrap,tencumrap,tenphim, found_suatchieu,foundPhim,foundCumRap,foundRap});
        }
       
        

    }));
   


    
module.exports = router;