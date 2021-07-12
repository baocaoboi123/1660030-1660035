var express = require('express');
var router = express.Router();

const asyncHandler =  require('express-async-handler');
const Email = require('../models/email');
const Phim = require('../models/phim.model');
const CumRap = require('../models/cum_rap.model');
const Rap = require('../models/rap.model');
const moment = require('moment');
const SuatChieu = require('../models/suat_chieu.model');

router.get('/',asyncHandler(async function(req, res, next)
{

       
    res.render('uudai', { layout: './layouts/sidebar'});
}));


module.exports = router;
