var express = require('express');
var router = express.Router();
const asyncHandler =  require('express-async-handler');
const NguoiDungAdmin = require('../models/nguoi_dung_admin.model');
const Email = require('../models/email');
const bcrypt = require('bcrypt');
const Phim = require('../models/phim.model');
const CumRap = require('../models/cum_rap.model');
const Rap = require('../models/rap.model');
const SuatChieu = require('../models/suat_chieu.model');
const DatCho = require('../models/dat_cho.model');
const Ve = require('../models/ve.model');
const Imag = require('../models/image');
const multer = require('multer'); 
const path= require('path');
const moment = require('moment');

/* GET home page. */
router.get('/', asyncHandler( async function(req, res, next) {
  const found_Phim = await Phim.find_All();
  res.render('index', { title: 'Express' ,found_Phim});
}));

router.get('/te', asyncHandler( async function(req, res, next) {
    const foundCumRap = await CumRap.findCR_Rap();

      var curr = new Date(); // get current date
      // var first = curr.getDate() - curr.getDay();//to set first day on monday, not on sunday, first+1 :
      var first = curr.getDate() ;
      var array_listday = [];
      for (var i = 0; i < 7; i++) {
          var next = new Date(curr.getTime());
          next.setDate(first + i);
          console.log(   moment(next.toString("DD-M-yyyy")).format("DD-MM-YYYY")  );

          // console.log(moment(next.toString("d-MMM-yyyy")).format("DD") );
          // console.log(moment(next.toString("d-MMM-yyyy")).format("MMM") );
          // console.log(moment(next.toString("d-MMM-yyyy")).format("yyyy") );

          array_listday.push(moment(next.toString("DD-M-yyyy")).format("YYYY-MM-DD"));


      }



    //Tim CumRap 
    

    // const found_SC = await SuatChieu.dfg('2021-12-16');
    // console.log(found_SC);
    // console.log(found_R);

    // const found_Phim = await Phim.find_All();
    // for(const key in found_Phim){
    //     const found_R = await Rap.feq('CR1');
    //     for(const r in found_R){

    //     }
    // }
    // const found_CumRapByTencumrap = await CumRap.findCumRapByTencumrap('');




    const found_CumRap  = await CumRap.findCR_Rap();
    // const found_Phim    = await Phim.find_All();
    // const found_R       = await Rap.feq('CR1');
    
    
    // const found_SC      = await SuatChieu.dfg('2021-12-16');
    // console.log(found_SC);

    const found_Phim = await Phim.find_All();
    const found_R       = await Rap.findRap();
    const found_SC      =  await SuatChieu.findSuatChieu();
    const cumrap = '';
    const ngayxem = '';



    res.render('movies/lichchieu', { layout: './layouts/sidebar' ,foundCumRap,array_listday,cumrap, ngayxem,found_CumRap,found_R,found_Phim, found_SC});
}));


router.post('/te', asyncHandler(async function(req, res, next){
    var {cumrap, ngayxem} = req.body;
    console.log(cumrap);
    console.log(ngayxem);
    console.log(cumrap);
    console.log(ngayxem);
    console.log(cumrap);
    console.log(ngayxem);
    console.log(cumrap);
    console.log(ngayxem);
 
  var array_listday ='';

  const found_CumRap = await CumRap.findCR_Rap();

  const found_CumRapByTencumrap = await CumRap.findCumRapByTencumrap(cumrap);


  const found_Phim = await Phim.find_All();
  const found_R = await Rap.feq(found_CumRapByTencumrap[0].IDcumrap);
  
  
  const found_SC = await SuatChieu.dfg(ngayxem);
  // console.log(found_SC);

  
  ngayxem = moment(ngayxem).format("DD-MM-YYYY");


  res.render('te', { layout: './layouts/sidebar' ,array_listday,cumrap, ngayxem, found_CumRap,found_R,found_Phim, found_SC});

}));


module.exports = router;
