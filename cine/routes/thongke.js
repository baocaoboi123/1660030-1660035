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
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const fs = require('fs');
const moment = require('moment');

var csvWriter = createCsvWriter({
    
    path: './public/csv/file.csv'
});
var csvWriterCumRap = createCsvWriter({
    
    path: './public/csv/file-cumrap.csv'
});


router.get('/', asyncHandler(async  function(req, res)
{
    
    res.render('auth/option/thongke', { layout: './layouts/sidebar'});
}));


router.post('/',asyncHandler(async function(req, res, next) {
    const {check_option}  = req.body;
    if (check_option === '1'){
        const {bddate, ktdate} = req.body;
        // Lay danh sach IDPhim 
        const found_Phim = await Phim.find_All();
        //Danh sach cac Phim
        const array_TongtienMoiPhim = [];
        // var array_sample = ['PHIM', 'TOTAL'];
        // array_TongtienMoiPhim.push(array_sample);
        for(const key in found_Phim){
    
            const found_SuatChieuByIdphimBDKT = await SuatChieu.findAllSuatChieuByIdphimBDKT(found_Phim[key].IDphim, bddate, ktdate);
            var tongtienmoisuatchieu = 0;
            for(const key in found_SuatChieuByIdphimBDKT){
                const found_DatChoByIDsuatchieu = await DatCho.findDatChoByIDsuatchieu(found_SuatChieuByIdphimBDKT[key].IDsuatchieu);
                var tongtienmosssidatcho = 0;
                for (const temp in found_DatChoByIDsuatchieu){
                    tongtienmosssidatcho = tongtienmosssidatcho + found_DatChoByIDsuatchieu[temp].Tongtien;
                    
    
    
                }
                console.log(tongtienmosssidatcho);
                tongtienmoisuatchieu = tongtienmoisuatchieu + tongtienmosssidatcho;
                console.log(tongtienmoisuatchieu);
    
            }
            var array_temp = [];
            array_temp.push(found_Phim[key].Tenphim, tongtienmoisuatchieu);
            array_TongtienMoiPhim.push(array_temp);
    
        }
        console.log(array_TongtienMoiPhim);
    
        const paths = './public/csv/file.csv'
        
        try {
          fs.unlinkSync(paths)
          //file removed
        } catch(err) {
          console.error(err)
        }
    
        csvWriter.writeRecords(array_TongtienMoiPhim);
        
        const tungay = moment(bddate).format("DD-MM-YYYY");
        const denngay = moment(ktdate).format("DD-MM-YYYY");
    
        res.render('auth/thongke/thongkephim', { layout: './layouts/sidebar', tungay, denngay});
    }
    else if(check_option === '0'){
        const {bddate1, ktdate1} = req.body;
        console.log(bddate1);
        console.log(ktdate1);

        // Danh sách cụm rạp
        const found_CumRap = await CumRap.findCR_Rap();
        const array_TongtienCumRap = [];
        

        // const found_SuatChieuByIdphimBDKT = await SuatChieu.findAllSuatChieuByIDrapBDKT('R1', '2021-01-01', '2021-12-28');
        // console.log(found_SuatChieuByIdphimBDKT);



        for (const key in found_CumRap){
            const found_RapByIDcumrap = await Rap.findRapByIDcumrap(found_CumRap[key].IDcumrap);
            var tongtienmoirap = 0;
            for(const temp in found_RapByIDcumrap){
                console.log(found_RapByIDcumrap[temp].IDrap);

                const found_SuatChieuByIdphimBDKT = await SuatChieu.findAllSuatChieuByIDrapBDKT(found_RapByIDcumrap[temp].IDrap, bddate1, ktdate1);
                console.log(found_SuatChieuByIdphimBDKT);

                var tongtienmoisuatchieu = 0;
                for(const elt in found_SuatChieuByIdphimBDKT){
                    const found_DatChoByIDsuatchieu = await DatCho.findDatChoByIDsuatchieu(found_SuatChieuByIdphimBDKT[elt].IDsuatchieu);
                    var tongtienmosssidatcho = 0;
                    for (const stp in found_DatChoByIDsuatchieu){
                        tongtienmosssidatcho = tongtienmosssidatcho + found_DatChoByIDsuatchieu[stp].Tongtien;
                        
        
        
                    }
                    tongtienmoisuatchieu = tongtienmoisuatchieu + tongtienmosssidatcho;
        
                }
                
                tongtienmoirap = tongtienmoirap + tongtienmoisuatchieu;

            }

            var array_temp = [];
            array_temp.push(found_CumRap[key].Tencumrap, tongtienmoirap);
            array_TongtienCumRap.push(array_temp);     
        }

        console.log(array_TongtienCumRap);


        const paths = './public/csv/file-cumrap.csv'
        
        try {
          fs.unlinkSync(paths)
          //file removed
        } catch(err) {
          console.error(err)
        }
    
        csvWriterCumRap.writeRecords(array_TongtienCumRap);
        
        const tungay = moment(bddate1).format("DD-MM-YYYY");
        const denngay = moment(ktdate1).format("DD-MM-YYYY");
    
        res.render('auth/thongke/thongkecumrap', { layout: './layouts/sidebar', tungay, denngay});




    }

}));
router.get('/map', asyncHandler(async  function(req, res)
{
    
    res.render('auth/thongke/map', { layout: './layouts/sidebar'});
}));
module.exports = router;