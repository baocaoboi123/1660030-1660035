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
        const foundPhim = await Phim.findPhimByTenphim1(tenphim_temp);

        const foundCumRap = await CumRap.findCR_Rap();
        // const foundRap = await Rap.findRap();
        // const found_suatchieu = '';
        var tenphim ="";
        var tencumrap = "";
        const found_R       = '';
        const found_SC      = '';
        const ngayxem = '';
        res.render('movies/phim', { layout: './layouts/sidebar',ngayxem, tencumrap,tenphim,foundPhim,foundCumRap, found_R, found_SC});
      

    }));

    router.post('/:tenphim', asyncHandler(async function(req, res, next){
        const tenphim_temp = req.params.tenphim

        const { check_option} = req.body;
        if (check_option === '0'){
            

        }else if(check_option === '2'){
            var {ngayxem, tencumrap, tenphim} = req.body;
            const foundCumRap = await CumRap.findCR_Rap();
            const foundPhim = await Phim.findPhimByID(tenphim);
            const found_R = await Rap.feq(tencumrap);
            const found_SC = await SuatChieu.dfg(ngayxem);


            console.log(foundPhim);
            console.log(found_R);
            console.log(found_SC);



            // const found_TenPhim = await Phim.findPhimByID(tenphim);

            // const found_IDRap = await Rap.findRapByTenrap(tenrap);
            
            // const found_suatchieu = await SuatChieu.findAllSuatChieuBy_Tphim_Rap_ddmmyyy(found_TenPhim[0].Tenphim, found_IDRap[0].IDrap, ngayxem);
    


            // const foundRap = await Rap.findRap();

            ngayxem = moment(ngayxem).format("DD-MM-YYYY");
            console.log(ngayxem);
            console.log(ngayxem);
            console.log(ngayxem);
            console.log(ngayxem);
            console.log(ngayxem);

            res.render('movies/phim', { layout: './layouts/sidebar',ngayxem, tencumrap,tenphim,foundPhim,foundCumRap, found_R, found_SC});
        }
       
        

    }));
   


    
module.exports = router;