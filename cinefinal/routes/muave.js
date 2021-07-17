var express = require('express');
var router = express.Router();
const asyncHandler =  require('express-async-handler');
const SuatChieu = require('../models/suat_chieu.model');
const moment = require('moment');
const Ve = require('../models/ve.model');
var LoggedIn = require('../middlewares/logged_in');
const split = require('split-string');
const randomstring = require('randomstring');
const Phim = require('../models/phim.model');
const Rap = require('../models/rap.model');

const DatCho = require('../models/dat_cho.model');

router.use(LoggedIn);

function to_a(c1 = 'a', c2 = 'z') {
    a = 'abcdefghijklmnopqrstuvwxyz'.split('');
    return (a.slice(a.indexOf(c1), a.indexOf(c2) + 1)); 
}

// console.log(to_a('b', 'h'));


router.get('/:suatchieu', asyncHandler(async function(req, res, next){

    const suatchieu_temp = req.params.suatchieu;

    var found_sc = await SuatChieu.findSuatChieuByID(suatchieu_temp);
    console.log(found_sc[0].IDsuatchieu);
    console.log(found_sc[0].IDsuatchieu);
    console.log(found_sc[0].PhimIDphim);
    console.log(found_sc[0].RapIDrap);

    var found_r = await Rap.findRapByID(found_sc[0].RapIDrap);

    console.log(found_r);
    console.log(found_r);
    console.log(found_r);
    console.log(found_r);



    const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    console.log(alphabet);
    var MaGheHangDoc = [];
    var kichthuocngang = parseInt(found_r.Kichthuocdoc); //8
    var kichthuocdoc =parseInt(found_r.Kichthuocngang) ; //5

    // console.log(found_r.Kichthuocngang);
    // console.log(found_r.Kichthuocngang);
    // console.log(found_r.Kichthuocngang);
    // console.log(found_r.Kichthuocngang);
    // console.log(parseInt(found_r.Kichthuocngang));
    // console.log(parseInt(found_r.Kichthuocngang));
    // console.log(parseInt(found_r.Kichthuocngang));
    // console.log(parseInt(found_r.Kichthuocngang));
    // console.log(parseInt(found_r.Kichthuocngang));
    // console.log(parseInt(found_r.Kichthuocngang));
   


    








    var array_sodoghe = [];
    for(i = 0; i < kichthuocdoc; i++){

        MaGheHangDoc.push(alphabet[i]);
    }

    for(i = 0; i < kichthuocdoc; i++){
        var array_hangngang = [];

        for(j = 1; j <= kichthuocngang ; j++){

            var GHE = MaGheHangDoc[i] + String(j);
            array_hangngang.push(GHE);

        }
        array_sodoghe.push(array_hangngang);
    }







   



    var array  = [
        ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'],
        ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'],
        ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'],
        ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'],
        ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8']
        
    ];
    
    


    var found_v_dc = await Ve.findAllve_datcho(found_sc[0].IDsuatchieu);

    console.log(found_v_dc);

    var found_phim = await Phim.findPhimByID(found_sc[0].PhimIDphim);

    console.log(found_phim[0].Tenphim);
    console.log(found_phim[0].Tenphim);
    console.log(found_phim[0].Tenphim);
    console.log(found_phim[0].Tenphim);
    console.log(found_phim[0].Tenphim);

    var found_posterphim = await SuatChieu.findPosterPhimByIDSuatChieu(found_sc[0].IDsuatchieu,found_phim[0].Tenphim);

    

    

    console.log(found_posterphim[0].Phim.Posterphim);
    console.log(found_posterphim[0].Phim.Posterphim);

    console.log(found_posterphim[0].Phim.Tenphim);

    console.log(found_posterphim[0].Phim.Tenphim);


    console.log(found_posterphim);

    console.log(found_posterphim);



    res.render('auth/muave', { layout: './layouts/sidebar',kichthuocngang,kichthuocdoc, found_posterphim,found_sc,  array_sodoghe, found_v_dc});
    
    
}));

router.post('/:suatchieu', asyncHandler(async function(req, res, next){
    const suatchieu_param = req.params.suatchieu;
    const {vedadat,tongtien} = req.body;


    const splits = vedadat.split(/(\d)/);
    const array_vedadat = [];
    for(i = 0; i< splits.length; i++){ // 0 1 2 3 4 5 
        if(i % 2 != 0 && i != 0  ){
            array_sam = [];
            array_sam.push(splits[i-1], splits[i]);
            array_vedadat.push(array_sam);
        }
    }
   
    const found_SuatChieuByID = await SuatChieu.findSuatChieuByID(suatchieu_param);

    const check_IDdatcho = randomstring.generate();

    const found_CreateDatCho  = await DatCho.createdDatCho(check_IDdatcho,req.currentUser.IDnguoidung, found_SuatChieuByID[0].IDsuatchieu , 0);

    const found_DatCho = await DatCho.findByIDdatcho(check_IDdatcho);


    
    for (const key in array_vedadat){
        var MaGhe = array_vedadat[key][0] + array_vedadat[key][1];
       


        const found_CreateVe = await Ve.createdVe(randomstring.generate(), found_DatCho.IDdatcho, found_SuatChieuByID[0].RapIDrap, MaGhe, found_SuatChieuByID[0].Giave);

    }


    // var found_AllVeFromDatCho = await Ve.findAllve_datcho(suatchieu_param);

    const found_updateDatCho = await DatCho.updateDatChoByIDDatCho(found_DatCho.IDdatcho, tongtien);
    





    console.log(array_vedadat);
    res.redirect('/');

})); 
module.exports = router;
