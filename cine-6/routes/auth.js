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


const storage = multer.diskStorage({
    destination: './public/images/movie',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname)); 
    }
});


const upload = multer({
    storage: storage,
    limits: {fileSize: 10000000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }

});

function checkFileType(file, cb){
    
    //Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    //Check ext
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    //Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }else{
        cb('Error: Image Only!');
    }

};
//LOGIN
    router.get('/login', function(req, res)
    {
        res.render('auth/login', { layout: './layouts/sidebar', message:""});
    });

    router.get('/active/:code',asyncHandler(async function(req, res) {//tham số id để biết record cần chỉnh
        var test = req.params.code;




        // const found =await NguoiDungAdmin.activeUser(test);
        // console.log(found);
        res.render('auth/autkey', { layout: './layouts/sidebar'});
     
    
    }));
    router.post('/active/:code',asyncHandler(async function(req, res, next) {
        var test = req.params.code;
        const {key_active} = req.body;
        const found_NguoiDung = await NguoiDungAdmin.findUserByID(test);

        if(key_active === found_NguoiDung.Code_Active){
            const found =await NguoiDungAdmin.activeUser(key_active);
            console.log(found);

            req.session.usersId = test;               
            res.redirect('/');


        }else{
            res.redirect(`/auth/active/${test}`);

        }


    }));  
    router.post('/login',asyncHandler(async function(req, res, next) {
        const {email, password} = req.body;          
        const found_user =await NguoiDungAdmin.findUserByEmail(email);
    
        if (!email || !password){
            res.render('auth/login', { layout: './layouts/sidebar', message: 'Please provide an email and password'});

        }
    
       
            if (found_user  && (await bcrypt.compare(password, found_user.Matkhau)) ){  

                if(found_user.Status === 0){
                    const key_code = found_user.IDnguoidung;
                    // res.render('auth/autkey', { layout: './layouts/sidebar', key_code});
                    res.redirect(`/auth/active/${key_code}`);
                }else{
                    req.session.usersId = found_user.IDnguoidung;               
                    res.redirect('/');
                }

                
                
            }
            else{
               
                res.render('auth/login', { layout: './layouts/sidebar', message: "Email or Password Error"});
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
                Mã kích hoạt của bạn !!
                <br>
                <br>
                <label>${found_user_active.Code_Active}</label>
            `;
    
    
            const send_Contact = await Email.sendContact(email,subject, output);
            res.redirect(`/auth/active/${found_user_active.IDnguoidung}`);

            //
            //res.redirect('/');
        }
    
    }));
    // <a href=http://localhost:5000/auth/active/${found_user_active.Code_Active}>Confirm</a>

//ACTIVE
    // router.get('/active/:code',asyncHandler(async function(req, res) {//tham số id để biết record cần chỉnh
    //     var test = req.params.code;
    //     const found =await NguoiDungAdmin.activeUser(test);
    //     console.log(found);
    //     res.render('auth/active', { layout: './layouts/sidebar', message: 'Active Successfull'});
     
    
    // }));
   
    router.get('/admin/config',asyncHandler(async function(req, res, next)
    {
        const found_AllMovie =await Phim.find_All();
        res.render('auth/config', { layout: './layouts/sidebar', found_AllMovie});
    }));
    router.post('/admin/config',upload.single('myImage'), asyncHandler( async   function(req, res, next)
    {
        const fileName = req.file != null ? req.file.filename : null;


        if (req.body.check_option === '0'){
           


            if(fileName === null || req.body.tenphim_add === null || req.body.start1_year === null || req.body.ngaycongchieu_add === null || req.body.thoiluong_add === null)
            {
                console.log('Gia tri khong duoc null');
                res.redirect('/auth/admin/config');
            }



            const found_checkTenPhim  = await Phim.findPhimByTenphim(req.body.tenphim_add);
            if(found_checkTenPhim ){
               console.log('tim thay ten phim');
               res.redirect('/auth/admin/config');

            }else{

                console.log('khong tim thay ten phim');
                console.log(req.body.tenphim_add);
                console.log(req.body.start1_year);
                console.log(`/images/movie/${fileName}`);
                console.log(req.body.thoiluong_add);
                var LowerCase = req.body.tenphim_add.toLowerCase();



                const found_createdPhim =  Phim.createdPhim(req.body.bio_add,req.body.trailer_add,LowerCase, req.body.start1_year, `/images/movie/${fileName}`, req.body.thoiluong_add);
                res.redirect('/auth/admin/config');


            }


        }else if(req.body.check_option === '3'){
            

            
            const found_SuatChieuByIDphim = await SuatChieu.findSuatChieuByIDphim(req.body.idphim2);
            for (const key in found_SuatChieuByIDphim){
                const found_DatChoByIDsuatchieu_before = await DatCho.findDatChoByIDsuatchieu(found_SuatChieuByIDphim[key].IDsuatchieu);
                for (const key in found_DatChoByIDsuatchieu_before){
                    const found_deleteVeByIDdatcho = await Ve.deleteVeByIDdatcho(found_DatChoByIDsuatchieu_before[key].IDdatcho);
                }
                const found_deleteDatChoByIDsuatchieu = await DatCho.deleteDatChoByIDsuatchieu(found_SuatChieuByIDphim[key].IDsuatchieu);
                const found_deleteSuatChieuByIDsuatchieu = await SuatChieu.deleteSuatChieuByIDsuatchieu(found_SuatChieuByIDphim[key].IDsuatchieu);

            }

            const found_deletePhimByIDphim = await Phim.deletePhimByIDphim(req.body.idphim2);



            
            res.redirect('/auth/admin/config');


           

        }
        else{       
            const found_checkIDPhim = await Phim.findPhimByID(req.body.idphim_edit);

      
            if(!found_checkIDPhim ){
            console.log('IP phim bi trung');
            res.redirect('../../auth/admin/config');

            }else{
            
                if(fileName === null)
                {
                    var LowerCase = req.body.tenphim_edit.toLowerCase();
                    console.log(LowerCase);
                    console.log(LowerCase);
                    console.log(LowerCase);
                    console.log(LowerCase);
                    console.log(LowerCase);
                    console.log(LowerCase);
                    console.log(LowerCase);
                    console.log(LowerCase);
                    console.log(LowerCase);
                    console.log(LowerCase);
                    console.log(LowerCase);
                    console.log(LowerCase);
                    console.log(LowerCase);
                    console.log(LowerCase);


                    console.log('upload khong hinh anh');
                    const found_updatePhim =  Phim.updatePhimByIDPhim(req.body.bio_edit,req.body.trailer_edit,req.body.idphim_edit, LowerCase, '', req.body.thoiluong_edit, '1', req.body.ngaycongchieu_edit);

                    res.redirect('/auth/admin/config');

        
                }else{

                    console.log(req.file.filename);

                    var LowerCase = req.body.tenphim_edit.toLowerCase();

                            
        
                    console.log('file khong nulllllll');
        
                    console.log('Thanh cong upload hinh anh');
                    const found_updatePhim =  Phim.updatePhimByIDPhim(req.body.bio_edit,req.body.trailer_edit,req.body.idphim_edit, LowerCase, `/images/movie/${fileName}`, req.body.thoiluong_edit, '0', req.body.ngaycongchieu_edit);
                    const found_AllMovie =await Phim.find_All();

                    // res.render('auth/config', { layout: './layouts/sidebar', found_AllMovie});
                    res.redirect('/auth/admin/config');
                    // res.render('auth/config', { layout: './layouts/sidebar', found_AllMovie});
                }
            }
        } 



    }));

    router.get('/admin/config/rap',asyncHandler(async function(req, res, next)
    {
        const foundCumRap = await CumRap.findCR_Rap();
        const foundRap = await Rap.findRap();


        res.render('auth/option/rap', { layout: './layouts/sidebar', foundCumRap, foundRap});

    }));

    router.post('/admin/config/rap',asyncHandler(async function(req, res, next) {
      
        const { check_option} = req.body;

        
        if (check_option === '0'){
            const {idrap,idcumrap,rrap,edit_loairap,  ktdoc, ktngang } = req.body;
            
            const foundRapByID = await Rap.findRapByID(req.body.idrap);

           
            if(!foundRapByID){
                console.log('khong tim thay');
                const foundCumRap = await CumRap.findCR_Rap();
                const foundRap = await Rap.findRap();
                
                // res.render('auth/option/rap', { layout: './layouts/sidebar', foundCumRap, foundRap});
                res.redirect('/auth/admin/config/rap');

            }else
            {
                console.log('tim thay');
                const found_updateRap = await Rap.updateRapByIDrap(idrap, rrap, idcumrap, edit_loairap, ktngang,ktdoc );

                const foundCumRap = await CumRap.findCR_Rap();
                const foundRap = await Rap.findRap();
        
        
                // res.render('auth/option/rap', { layout: './layouts/sidebar', foundCumRap, foundRap});
                res.redirect('/auth/admin/config/rap');

            }



        }
        else if(check_option === '3'){
            

            const {idrap2 } = req.body;
           
            // Xóa tát cả Vé Có IDrap sau đó lưu ds IDdatcho vào 1 mảng
            const found_VeByIDrap_before = await Ve.findVeByIDrap(idrap2);
            console.log('Có danh sách IDdatcho');    
            console.log('Có danh sách IDdatcho');    
            console.log('Có danh sách IDdatcho');    
            console.log('Có danh sách IDdatcho');    
            console.log('Có danh sách IDdatcho');    
            console.log('Có danh sách IDdatcho');    
            console.log('Có danh sách IDdatcho');    

            const found_deleteVeByIDrap = await Ve.deleteVeByIDrap(idrap2);
            console.log('Xóa tát cả vé thành công');
            console.log('Xóa tát cả vé thành công');
            console.log('Xóa tát cả vé thành công');
            console.log('Xóa tát cả vé thành công');
            console.log('Xóa tát cả vé thành công');
            console.log('Xóa tát cả vé thành công');
            console.log('Xóa tát cả vé thành công');
            console.log('Xóa tát cả vé thành công');
            console.log('Xóa tát cả vé thành công');

            // Xóa tát cả Đặt Chổ có IDdatcho
            for(const key in found_VeByIDrap_before){
                const found_deleteDatChoByIDdatcho = await DatCho.deleteDatChoByIDdatcho(found_VeByIDrap_before[key].DatChoIDdatcho);
                console.log('Xóa tát vả đặt chổ  thành công');
            }

            // Xóa tát cả Suất Chiếu có IDrap
            const found_deleteSuatChieuByIDrap = await SuatChieu.deleteSuatChieuByIDrap(idrap2);
            console.log('Xóa tát cả suất chiếu thành công');
            console.log('Xóa tát cả suất chiếu thành công');
            console.log('Xóa tát cả suất chiếu thành công');
            console.log('Xóa tát cả suất chiếu thành công');
            console.log('Xóa tát cả suất chiếu thành công');
            console.log('Xóa tát cả suất chiếu thành công');
            console.log('Xóa tát cả suất chiếu thành công');

            // Xóa tất cả Rạp có IDrap
            const found_deleteRapByIDrap = await Rap.deleteRapByIDrap(idrap2);
            console.log('Xóa tát cả rạp thành công');
            console.log('Xóa tát cả rạp thành công');
            console.log('Xóa tát cả rạp thành công');
            console.log('Xóa tát cả rạp thành công');
            console.log('Xóa tát cả rạp thành công');
            console.log('Xóa tát cả rạp thành công');
            console.log('Xóa tát cả rạp thành công');
            console.log('Xóa tát cả rạp thành công');






            const foundCumRap = await CumRap.findCR_Rap();
            const foundRap = await Rap.findRap();
            // res.render('auth/option/rap', { layout: './layouts/sidebar', foundCumRap, foundRap});
            res.redirect('/auth/admin/config/rap');

        }
        else{
            const {temp_tencumrap1,rrap,add_loairap,  ktdoc, ktngang } = req.body;
           

            const foundRapByTenRap = await Rap.findRapByTenrap(rrap);
            console.log(foundRapByTenRap[0]);
            
            if (foundRapByTenRap[0] !== undefined){
                const foundCumRap = await CumRap.findCR_Rap();
                const foundRap = await Rap.findRap();
        
                    console.log('Ten bi trung, khong the them rap');
                // res.render('auth/option/rap', { layout: './layouts/sidebar', foundCumRap, foundRap});
                res.redirect('/auth/admin/config/rap');

            }else{

                console.log('them thanh cong');
                const foundcreatedRap = await Rap.createdPhim(rrap, temp_tencumrap1, add_loairap, ktngang,ktdoc);

                const foundCumRap = await CumRap.findCR_Rap();
                const foundRap = await Rap.findRap();
        
        
                // res.render('auth/option/rap', { layout: './layouts/sidebar', foundCumRap, foundRap});
                res.redirect('/auth/admin/config/rap');


            }



            const foundCumRap = await CumRap.findCR_Rap();
            const foundRap = await Rap.findRap();
    
    
            // res.render('auth/option/rap', { layout: './layouts/sidebar', foundCumRap, foundRap});
            res.redirect('/auth/admin/config/rap');


        }






        
    }));




    router.get('/admin/config/cumrap',asyncHandler(async function(req, res, next)
    {
        const foundCumRap = await CumRap.findCR_Rap();

        res.render('auth/option/cumrap', { layout: './layouts/sidebar', foundCumRap});
    }));


    router.post('/admin/config/cumrap',asyncHandler(async function(req, res, next) {
        const { check_option} = req.body;
        if (check_option === '0'){
            const {edit_idcumrap, edit_tencumrap, edit_diachi, edit_mapdiachi} = req.body;

           
            const foundCumRapByID = await CumRap.findCumRapByID(edit_idcumrap);

            
            if(!foundCumRapByID){
                console.log('khong tim thay');
                const foundCumRap = await CumRap.findCR_Rap();
                // res.render('/auth/option/cumrap', { layout: './layouts/sidebar', foundCumRap});
                res.redirect('/auth/admin/config/cumrap');

            }else{
                console.log('tim thay');
                const found_updatedCumRap = await CumRap.updateCumRapByIDcumrap( edit_idcumrap,edit_tencumrap, edit_diachi, edit_mapdiachi );


                const foundCumRap = await CumRap.findCR_Rap();
                // res.render('auth/option/cumrap', { layout: './layouts/sidebar', foundCumRap});
                res.redirect('/auth/admin/config/cumrap');
            }



        }else if(check_option === '3'){
            

            const {idcumrap2 } = req.body;
            // Tìm tất cả rạp có IDcumrap
            const found_RapByCumRapIDcumrap_before = await Rap.findRapByIDcumrap(idcumrap2);
            for (const key in found_RapByCumRapIDcumrap_before){
                const found_VeByIDrap_before = await Ve.findVeByIDrap(found_RapByCumRapIDcumrap_before[key].IDrap);
                const found_deleteVeByIDrap = await Ve.deleteVeByIDrap(found_RapByCumRapIDcumrap_before[key].IDrap);
                for(const key in found_VeByIDrap_before){
                    const found_deleteDatChoByIDdatcho = await DatCho.deleteDatChoByIDdatcho(found_VeByIDrap_before[key].DatChoIDdatcho);
                    console.log('Xóa tát vả đặt chổ  thành công');
                }
                const found_deleteSuatChieuByIDrap = await SuatChieu.deleteSuatChieuByIDrap(found_RapByCumRapIDcumrap_before[key].IDrap);
                const found_deleteRapByIDrap = await Rap.deleteRapByIDrap(found_RapByCumRapIDcumrap_before[key].IDrap);

            }
            //Xóa tất cả Cụm Rạp có IDcumrap
            const found_deleteCumRapByIDcumrap = await CumRap.deleteCumRapByIDcumrap(idcumrap2);

            const foundCumRap = await CumRap.findCR_Rap();
            // res.render('auth/option/cumrap', { layout: './layouts/sidebar', foundCumRap});
            res.redirect('/auth/admin/config/cumrap');

           

        }
        else{
            const {add_tencumrap, add_diachi, add_mapdiachi} = req.body;

            const foundCumRapByTencumRap = await CumRap.findCumRapByTencumrap(add_tencumrap);
            if (foundCumRapByTencumRap[0] !== undefined){
                const foundCumRap = await CumRap.findCR_Rap();
                console.log('Ten bi trung, khong the them cum rap');
                // res.render('auth/option/cumrap', { layout: './layouts/sidebar', foundCumRap});
                res.redirect('/auth/admin/config/cumrap');


            }else{

                console.log('them thanh cong');
                const found_createdCumRap = await CumRap.createdCumRap(add_tencumrap, add_diachi, add_mapdiachi);

                const foundCumRap = await CumRap.findCR_Rap();
                // res.render('auth/option/cumrap', { layout: './layouts/sidebar', foundCumRap});
                res.redirect('/auth/admin/config/cumrap');

            }
        }


    }));



    router.get('/admin/config/suatchieu',asyncHandler(async function(req, res, next)
    {
        const found_AllMovie =await Phim.find_All();
        const foundCumRap = await CumRap.findCR_Rap();
        const foundRap = await Rap.findRap();
        const foundPhim = await Phim.find_All();
        const found_suatchieu = '';
        var tenphim ="";
        var tencumrap = "";
        var tenrap = "";
        res.render('auth/option/suatchieu', { layout: './layouts/sidebar',tenrap,tencumrap,tenphim, found_suatchieu,foundPhim,foundCumRap,foundRap,  found_AllMovie});
    }));


    router.post('/admin/config/suatchieu',asyncHandler(async function(req, res, next) {
        

        const { check_option} = req.body;
        if (check_option === '0'){
            const {idsuatchieu, giave, giobatdau, gioketthuc, ngaybatdau} =req.body;
            const found_updatesuatchieu = await SuatChieu.updateSuatChieuIDsuatchieu(idsuatchieu, giave, giobatdau, gioketthuc, ngaybatdau);
            console.log(found_updatesuatchieu);


            const found_SuatChieuByIDsuatchieu = await SuatChieu.findSuatChieuByID(idsuatchieu);

            var tenphim = found_SuatChieuByIDsuatchieu[0].PhimIDphim;

            // const found_RapByIDrap =  await Rap.findRapByIDrap(found_SuatChieuByIDsuatchieu[0].RapIDrap);
            // var tencumrap = found_RapByIDrap[0].CumRapIDcumrap;
            // var tenrap = found_RapByIDrap[0].Tenrap;


            var tencumrap = ngaybatdau;
            var tenrap = '';
            
            const found_PhimByIDPhim = await Phim.findPhimByID(tenphim);

            const found_suatchieu = await SuatChieu.findAllSuatChieuBy_Tphim_ddmmyyy(found_PhimByIDPhim[0].Tenphim, ngaybatdau);

            const found_AllMovie =await Phim.find_All();
            const foundCumRap = await CumRap.findCR_Rap();
            const foundRap = await Rap.findRap();
            const foundPhim = await Phim.find_All();



            res.render('auth/option/suatchieu', { layout: './layouts/sidebar',tenrap,tencumrap,tenphim,found_suatchieu,foundPhim,foundCumRap,foundRap,  found_AllMovie});


        }else if(check_option === '2'){
            const {ngayxem, tenphim} = req.body;
            var tenrap = '';
            var tencumrap =ngayxem;
            const found_TenPhim = await Phim.findPhimByID(tenphim);
            // const found_IDRap = await Rap.findRapByIDrap(tenrap);
            
            // const found_suatchieu = await SuatChieu.findAllSuatChieuBy_Tphim_Rap_ddmmyyy(found_TenPhim[0].Tenphim, found_IDRap[0].IDrap, ngayxem);
                                            
            const found_suatchieu = await SuatChieu.findAllSuatChieuBy_Tphim_ddmmyyy(found_TenPhim[0].Tenphim, ngayxem);

            const found_AllMovie =await Phim.find_All();
            const foundCumRap = await CumRap.findCR_Rap();
            const foundRap = await Rap.findRap();
            const foundPhim = await Phim.find_All();

            res.render('auth/option/suatchieu', { layout: './layouts/sidebar',tenrap,tencumrap,tenphim, found_suatchieu,foundPhim,foundCumRap,foundRap,  found_AllMovie});
        }else if(check_option === '3'){
            
            const {idsuatchieu2 , batdau2} = req.body;

            // Tìm ds Dặt Chổ có IDsuatchieu
            const found_DatChoByIDsuatchieu_before = await DatCho.findDatChoByIDsuatchieu(idsuatchieu2);
            // Xoa Ve có IDdatcho
            for (const key in found_DatChoByIDsuatchieu_before){
                const found_deleteVeByIDdatcho = await Ve.deleteVeByIDdatcho(found_DatChoByIDsuatchieu_before[key].IDdatcho);
            }

            // Xoa DatCho có IDsuatchieu
            const found_deleteDatChoByIDsuatchieu = await DatCho.deleteDatChoByIDsuatchieu(idsuatchieu2);
            // Xoa SuatChieu có IDsuatchieu
           
            const found_SuatChieuByIDsuatchieu = await SuatChieu.findSuatChieuByID(idsuatchieu2);

            var tenphim = found_SuatChieuByIDsuatchieu[0].PhimIDphim;

            // const found_RapByIDrap =  await Rap.findRapByIDrap(found_SuatChieuByIDsuatchieu[0].RapIDrap);
            // var tencumrap = found_RapByIDrap[0].CumRapIDcumrap;
            // var tenrap = found_RapByIDrap[0].Tenrap;

            const found_deleteSuatChieuByIDsuatchieu = await SuatChieu.deleteSuatChieuByIDsuatchieu(idsuatchieu2);

            const found_PhimByIDPhim = await Phim.findPhimByID(tenphim);


            var tencumrap = batdau2;
            var tenrap = '';
            

            const found_suatchieu = await SuatChieu.findAllSuatChieuBy_Tphim_ddmmyyy(found_PhimByIDPhim[0].Tenphim, batdau2);

            const found_AllMovie =await Phim.find_All();
            const foundCumRap = await CumRap.findCR_Rap();
            const foundRap = await Rap.findRap();
            const foundPhim = await Phim.find_All();






            res.render('auth/option/suatchieu', { layout: './layouts/sidebar',tenrap,tencumrap,tenphim,found_suatchieu,foundPhim,foundCumRap,foundRap,  found_AllMovie});

        }
        else{
            const {idphim1, idrap1, giave1, ngaybatdau1, ngayketthuc1, giobatdau1, gioketthuc1} = req.body;
            const found_TenPhim = await Phim.findPhimByID(idphim1);
            const found_IDRap = await Rap.findRapByIDrap(idrap1);
            // const found_suatchieu = await SuatChieu.findAllSuatChieuBy_Tphim_Rap_ddmmyyy(found_TenPhim[0].Tenphim, found_IDRap[0].IDrap, ngaybatdau1);

            const foundCreatedSuatChieu = await SuatChieu.createdSuatChieu(ngaybatdau1, giobatdau1, ngayketthuc1, gioketthuc1, giave1, idphim1, found_IDRap[0].IDrap);


            var tenphim = found_TenPhim[0].IDphim;
            // var tencumrap = found_IDRap[0].CumRapIDcumrap;
            // var tenrap = found_IDRap[0].Tenrap;
            var tencumrap = ngaybatdau1;
            var tenrap = '';
            
            

            const found_suatchieu = await SuatChieu.findAllSuatChieuBy_Tphim_ddmmyyy(found_TenPhim[0].Tenphim, ngaybatdau1);

            const found_AllMovie =await Phim.find_All();
            const foundCumRap = await CumRap.findCR_Rap();
            const foundRap = await Rap.findRap();
            const foundPhim = await Phim.find_All();







            res.render('auth/option/suatchieu', { layout: './layouts/sidebar',tenrap,tencumrap,tenphim,found_suatchieu,foundPhim,foundCumRap,foundRap,  found_AllMovie});


        }



        
    }));


    router.get('/admin/profile',asyncHandler(async function(req, res, next)
    {
        const found_Ve = await Ve.findAllVeByIDnguoidung(req.currentUser.IDnguoidung);
        console.log(found_Ve);

        if (found_Ve.length === 0 ){
            const found_Ve ='';
            const array_phim_into_ve='';
            const found_AllUSer = '';
            res.render('auth/option/profileAdmin', { layout: './layouts/sidebar', found_Ve, array_phim_into_ve, found_AllUSer });

        }else{

            const found_PhimByIDsuatchieu = await SuatChieu.findTenPhimChieuByIDsuatchieu(found_Ve[0].DatCho.SuatChieuIDsuatchieu);
            
            console.log(found_PhimByIDsuatchieu[0].Phim.Tenphim);

            const array_phim_into_ve = []
            for (const key in found_Ve){
                const found_PhimByIDsuatchieu = await SuatChieu.findTenPhimChieuByIDsuatchieu(found_Ve[key].DatCho.SuatChieuIDsuatchieu);
                array_phim_into_ve.push(found_PhimByIDsuatchieu[0].Phim.Tenphim);
            }
            console.log(array_phim_into_ve[0]);

            const found_AllUSer = await NguoiDungAdmin.findUser();


            res.render('auth/option/profileAdmin', { layout: './layouts/sidebar', found_Ve, array_phim_into_ve, found_AllUSer });
        }
    }));

    router.post('/admin/profile',asyncHandler( async function(req, res, next)
    {

        const {check_option} = req.body;
        if(check_option === '0'){
            const {username,email, sodienthoai } = req.body;
            // req.currentUser.IDnguoidung

            const found_checkUsername = await NguoiDungAdmin.findUserByHoten(username);
            if(found_checkUsername  && found_checkUsername.Hoten !== req.currentUser.Hoten){

                res.redirect('/auth/admin/profile');


            }else{
                const found_ThongTinUser = await NguoiDungAdmin.updateThongTinUser(req.currentUser.IDnguoidung,username,email,sodienthoai );
                
                res.redirect('/auth/admin/profile');


            }



            


        }else{
            const {matkhauold,matkhaunew, comfirmmatkhau } = req.body;

            const found_user =await NguoiDungAdmin.findUserByID(req.currentUser.IDnguoidung);


            if (found_user  && (await bcrypt.compare(matkhauold, found_user.Matkhau)) ){  
                const found_ThongTinPassUSer = await NguoiDungAdmin.updateThongTinUserPass(req.currentUser.IDnguoidung,comfirmmatkhau);
                res.redirect('/auth/admin/profile');

            }else{
                res.redirect('/');

            }



            





        }
        res.redirect('/auth/admin/profile');
    }));


    router.get('/profile',asyncHandler(async function(req, res, next)
    {
        const found_Ve = await Ve.findAllVeByIDnguoidung(req.currentUser.IDnguoidung);
        
        console.log(found_Ve);

        if (found_Ve.length === 0 ){
            const found_Ve ='';
            const array_phim_into_ve='';
            res.render('auth/profile', { layout: './layouts/sidebar', found_Ve, array_phim_into_ve});

        }else{
            const found_PhimByIDsuatchieu = await SuatChieu.findTenPhimChieuByIDsuatchieu(found_Ve[0].DatCho.SuatChieuIDsuatchieu);
        
            console.log(found_PhimByIDsuatchieu[0].Phim.Tenphim);
    
            const array_phim_into_ve = []
            for (const key in found_Ve){
                const found_PhimByIDsuatchieu = await SuatChieu.findTenPhimChieuByIDsuatchieu(found_Ve[key].DatCho.SuatChieuIDsuatchieu);
                array_phim_into_ve.push(found_PhimByIDsuatchieu[0].Phim.Tenphim);
            }
            console.log(array_phim_into_ve[0]);
    
    
    
            res.render('auth/profile', { layout: './layouts/sidebar', found_Ve, array_phim_into_ve});
        }


       
    }));

    router.post('/profile',asyncHandler( async function(req, res, next)
    {

        const {check_option} = req.body;
        if(check_option === '0'){
            const {username,email, sodienthoai } = req.body;
            // req.currentUser.IDnguoidung
            const found_ThongTinUser = await NguoiDungAdmin.updateThongTinUser(req.currentUser.IDnguoidung,username,email,sodienthoai );
        }else{
            const {matkhauold,password, comfirmmatkhau } = req.body;
            const found_ThongTinPassUSer = await NguoiDungAdmin.updateThongTinUserPass(req.currentUser.IDnguoidung,comfirmmatkhau);

        }
        res.redirect('/');
    }));

module.exports = router;

