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
router.get('/', asyncHandler(async function(req, res)
{   
    const found_CumRap = await CumRap.findCR_Rap();

    res.render('rap-gia1', { layout: './layouts/sidebar', found_CumRap});
}));

router.get('/chiduong/:cumrap', asyncHandler(async function(req, res)
{   

    res.render('chiduong', { layout: './layouts/sidebar'});
}));

module.exports = router;