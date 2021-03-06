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

//LOGIN
    router.get('/login', function(req, res)
    {
        res.render('auth/login', { layout: './layouts/sidebar', message:""});
    });


    router.post('/login',asyncHandler(async function(req, res, next) {
        const {email, password} = req.body;          
        const found_user =await NguoiDungAdmin.findUserByEmail(email);
    
        if (!email || !password){
            res.render('auth/login', { layout: './layouts/sidebar', message: 'Please provide an email and password'});

        }
    
       
        if (found_user  && (await bcrypt.compare(password, found_user.Matkhau)) ){              
                req.session.usersId = found_user.IDnguoidung;
               
                res.redirect('/');
            }
            else{
               
                res.render('auth/login', { layout: './layouts/sidebar', message: "error"});
            }
                       

        
    }));
//LOGOUT
    router.get('/logout', function(req, res){
        delete req.session.usersId;
        res.redirect('/');

    });
//REGISTER
    router.get('/register', function(req, res, next)
    {
        
        res.render('auth/register', { layout: './layouts/sidebar', message:''});
    });
    router.post('/register',asyncHandler( async function(req, res, next)
    {
        const {hoten,email, password,confirmpassword,  sodienthoai} = req.body;
   
        const found_user =await NguoiDungAdmin.findUserByEmail(email);
        if (found_user ){  
            res.render('auth/register', { layout: './layouts/sidebar', message: 'That email is already in use'});
        }else if(password !== confirmpassword){
            res.render('auth/register', { layout: './layouts/sidebar', message: 'Passwords do not match'});

        }
        else{
            const found_add_user = await NguoiDungAdmin.addUser(email, password, hoten, sodienthoai);
                    
            const subject = 'K??CH HO???T T??I KHO???N';
            const found_user_active = await NguoiDungAdmin.findUserByEmail(email);
           
            const output = `
                <h2 align='center'>X??C TH???C T??I KHO???N</h2>
                <br>
                <br>
                Ch??o b???n !
                <br>
                B???n v???a g???i y??u c???u x??c th???c t??i kho???n tr??n ...
                <br>
                Vui l??ng nh???n v??o li??n k???t b??n d?????i ????? ho??n t???t qu?? tr??nh ????ng k?? . N???u b???n kh??ng nh???n ???????c v??o link vui l??ng sao ch??p li??n k???t b??n d?????i v?? d??n v??o tr??nh duy???t
                <br>
                <a href=http://localhost:3000/auth/active/${found_user_active.Code_Active}>Confirm</a>
                <br>
                <label>${found_user_active.Code_Active}</label>
            `;
    
    
            const send_Contact = await Email.sendContact(email,subject, output);
    
            //
            res.redirect('/');
        }
    
    }));

//ACTIVE
    router.get('/active/:code',asyncHandler(async function(req, res) {//tham s??? id ????? bi???t record c???n ch???nh
        var test = req.params.code;
        const found =await NguoiDungAdmin.activeUser(test);
        console.log(found);
        res.render('auth/active', { layout: './layouts/sidebar', message: 'Active Successfull'});
     
    
    }));
   


module.exports = router;