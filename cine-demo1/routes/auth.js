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
                    
            const subject = 'KÍCH HOẠT TÀI KHOẢN';
            const found_user_active = await NguoiDungAdmin.findUserByEmail(email);
           
            const output = `
                <h2 align='center'>XÁC THỰC TÀI KHOẢN</h2>
                <br>
                <br>
                Chào bạn !
                <br>
                Bạn vừa gửi yêu cầu xác thực tài khoản trên ...
                <br>
                Vui lòng nhấn vào liên kết bên dưới để hoàn tất quá trình đăng ký . Nếu bạn không nhấn được vào link vui lòng sao chép liên kết bên dưới và dán vào trình duyệt
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
    router.get('/active/:code',asyncHandler(async function(req, res) {//tham số id để biết record cần chỉnh
        var test = req.params.code;
        const found =await NguoiDungAdmin.activeUser(test);
        console.log(found);
        res.render('auth/active', { layout: './layouts/sidebar', message: 'Active Successfull'});
     
    
    }));
   


module.exports = router;