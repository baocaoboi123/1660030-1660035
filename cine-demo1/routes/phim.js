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
        const found = await Phim.findOneMovie(tenphim_temp);
        const result = found;

        const found_AllSCByTenphim = await SuatChieu.findAllSuatChieuByTenphim(tenphim_temp);
        for (const key in found_AllSCByTenphim){
            found_AllSCByTenphim[key].Batdau =  moment(found_AllSCByTenphim[key].Batdau).format("DD-MM-YYYY HH:mm");
            found_AllSCByTenphim[key].Ketthuc =  moment(found_AllSCByTenphim[key].Ketthuc).format("DD-MM-YYYY HH:mm");
        }
        console.log(found_AllSCByTenphim);
        var array_check = [];


        // const found_CumRap_Rap = await Rap.findCR_Rap();

        
        // const unique = [...new Set(found_CumRap_Rap.map(item => item.Tencumrap))];
        const found_CumRap_Rap = await CumRap.findCR_Rap();
        
        

        
        var array =[];
    
        var start1_Tencumrap = "";
        var start1_Tenrap = "";
      
        res.render('movies/phim', { layout: './layouts/sidebar',result,start1_Tenrap,start1_Tencumrap, array, array_check,  found_CumRap_Rap});
 

    }));


    router.post('/:tenphim', asyncHandler(async function(req, res, next){

        const { start1_Tencumrap, start1_date, start1_month, start1_year, start1_Tenrap, start1_Tenphim} = req.body;

        const tenphim_temp = req.params.tenphim
        const found = await Phim.findOneMovie(tenphim_temp);
        const result = found;


        console.log(start1_Tenrap);
        console.log(start1_Tenrap);
        console.log(start1_Tenrap);
        console.log(start1_Tenrap);
        console.log(start1_Tenrap);

        console.log(start1_Tenrap);

        const found_rap  = await Rap.findRapByTenrap(start1_Tenrap);
        console.log(found_rap[0].IDrap);
        console.log(found_rap[0].IDrap);
        console.log(found_rap[0].IDrap);
        console.log(found_rap[0].IDrap);



        const found_suatchieu = await SuatChieu.findAllSuatChieuBy_Tphim_Rap_ddmmyyy(start1_Tenphim, found_rap[0].IDrap, start1_year);



        // for (const key in found_suatchieu){
            
        //     found_suatchieu[key].Batdau =  moment(found_suatchieu[key].Batdau).format("HH:mm");
        //     found_suatchieu[key].Ketthuc =  moment(found_suatchieu[key].Ketthuc).format("DD-MM-YYYY HH:mm");
        // }
        
        var array_check = [];
        array_check = found_suatchieu;


        const found_CumRap_Rap = await CumRap.findCR_Rap();



            res.render('movies/phim', { layout: './layouts/sidebar',found_CumRap_Rap, result, array_check, start1_Tencumrap, start1_Tenrap});
    




    }));


       



    
module.exports = router;