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

const DatCho = require('../models/dat_cho.model');

router.use(LoggedIn);
router.get('/:suatchieu', asyncHandler(async function(req, res, next){

    const suatchieu_temp = req.params.suatchieu;

    var array  = [
        ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'],
        ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'],
        ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'],
        ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'],
        ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8']
        
    ];
    
    var found_sc = await SuatChieu.findSuatChieuByID(suatchieu_temp);
    console.log(found_sc[0].IDsuatchieu);
    console.log(found_sc[0].IDsuatchieu);
    console.log(found_sc[0].IDsuatchieu);
    console.log(found_sc[0].IDsuatchieu);


    var found_v_dc = await Ve.findAllve_datcho(found_sc[0].IDsuatchieu);

    console.log(found_v_dc);

    var found_posterphim = await SuatChieu.findPosterPhimByIDSuatChieu(suatchieu_temp);

    

    console.log(found_posterphim[0].Posterphim);
    console.log(found_posterphim[0].Posterphim);

    console.log(found_posterphim[0].Posterphim);

    console.log(found_posterphim[0].Posterphim);

    console.log(found_posterphim[0].Posterphim);



    res.render('auth/muave', { layout: './layouts/sidebar',found_posterphim,found_sc,  array, found_v_dc});
    
    
}));

router.post('/:suatchieu', asyncHandler(async function(req, res, next){
    const suatchieu_param = req.params.suatchieu;
    const {vedadat,tongtien} = req.body;
console.log(vedadat);
console.log(vedadat);

console.log(vedadat);


console.log(tongtien);
console.log(tongtien);
console.log(tongtien);
console.log(tongtien);


    const splits = vedadat.split(/(\d)/);
    const array_vedadat = [];
    for(i = 0; i< splits.length; i++){ // 0 1 2 3 4 5 
        if(i % 2 != 0 && i != 0  ){
            array_sam = [];
            array_sam.push(splits[i-1], splits[i]);
            array_vedadat.push(array_sam);
        }
    }
    console.log(array_vedadat);
    console.log(array_vedadat);

    console.log(array_vedadat);

    console.log(array_vedadat);



    const found_SuatChieuByID = await SuatChieu.findSuatChieuByID(suatchieu_param);

    const check_IDdatcho = randomstring.generate();

    const found_CreateDatCho  = await DatCho.createdDatCho(check_IDdatcho,req.currentUser.IDnguoidung, found_SuatChieuByID[0].IDsuatchieu , 0);

    const found_DatCho = await DatCho.findByIDdatcho(check_IDdatcho);


    
    for (const key in array_vedadat){
        var MaGhe = array_vedadat[key][0] + array_vedadat[key][1];
        console.log(MaGhe);
        console.log(MaGhe);

        console.log(MaGhe);

        console.log(MaGhe);

        console.log(MaGhe);


        const found_CreateVe = await Ve.createdVe(randomstring.generate(), found_DatCho.IDdatcho, found_SuatChieuByID[0].RapIDrap, MaGhe, found_SuatChieuByID[0].Giave);

    }



    // var found_AllVeFromDatCho = await Ve.findAllve_datcho(suatchieu_param);

    const found_updateDatCho = await DatCho.updateDatChoByIDDatCho(found_DatCho.IDdatcho, tongtien);
    





    console.log(array_vedadat);
    res.redirect('/');

})); 
module.exports = router;
