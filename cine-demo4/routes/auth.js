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
                res.redirect('../../auth/admin/config');
            }



            const found_checkTenPhim  = await Phim.findPhimByTenphim(req.body.tenphim_add);
            if(found_checkTenPhim ){
               console.log('tim thay ten phim');
               res.redirect('../../auth/admin/config');

            }else{

                console.log('khong tim thay ten phim');
                console.log(req.body.tenphim_add);
                console.log(req.body.start1_year);
                console.log(`/images/movie/${fileName}`);
                console.log(req.body.thoiluong_add);
                const found_createdPhim =  Phim.createdPhim(req.body.tenphim_add, req.body.start1_year, `/images/movie/${fileName}`, req.body.thoiluong_add);
                res.redirect('../../auth/admin/config');


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



            
            res.redirect('../../auth/admin/config');


           

        }
        else{
            

        


        const found_checkIDPhim = await Phim.findPhimByID(req.body.idphim_edit);

      
        if(!found_checkIDPhim ){
           console.log('IP phim bi trung');
           res.redirect('../../auth/admin/config');

        }else{
            
            if(fileName === null)
            {
                

                console.log('upload khong hinh anh');
                const found_updatePhim =  Phim.updatePhimByIDPhim(req.body.idphim_edit, req.body.tenphim_edit, '', req.body.thoiluong_edit, '1');
                const found_AllMovie =await Phim.find_All();

                res.redirect('../../../auth/admin/config');
    
            }else{

                console.log(req.file.filename);


                
    
                console.log('file khong nulllllll');
    
                console.log('Thanh cong upload hinh anh');
                const found_updatePhim =  Phim.updatePhimByIDPhim(req.body.idphim_edit, req.body.tenphim_edit, `/images/movie/${fileName}`, req.body.thoiluong_edit, '0');
                const found_AllMovie =await Phim.find_All();

                // res.render('auth/config', { layout: './layouts/sidebar', found_AllMovie});
                res.redirect('../../../auth/admin/config');
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
            const {idrap,idcumrap,rrap,loairap,  ktdoc, ktngang } = req.body;
            
            const foundRapByID = await Rap.findRapByID(req.body.idrap);

           
            if(!foundRapByID){
                console.log('khong tim thay');
                const foundCumRap = await CumRap.findCR_Rap();
                const foundRap = await Rap.findRap();


                res.render('auth/option/rap', { layout: './layouts/sidebar', foundCumRap, foundRap});
            }else
            {
                console.log('tim thay');
                const found_updateRap = await Rap.updateRapByIDrap(idrap, rrap, idcumrap, loairap, ktngang,ktdoc );

                const foundCumRap = await CumRap.findCR_Rap();
                const foundRap = await Rap.findRap();
        
        
                res.render('auth/option/rap', { layout: './layouts/sidebar', foundCumRap, foundRap});

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
            res.render('auth/option/rap', { layout: './layouts/sidebar', foundCumRap, foundRap});

        }
        else{
            const {temp_tencumrap1,rrap,loairap,  ktdoc, ktngang } = req.body;
           

            const foundRapByTenRap = await Rap.findRapByTenrap(rrap);
            console.log(foundRapByTenRap[0]);
            
            if (foundRapByTenRap[0] !== undefined){
                const foundCumRap = await CumRap.findCR_Rap();
                const foundRap = await Rap.findRap();
        
                    console.log('Ten bi trung, khong the them rap');
                res.render('auth/option/rap', { layout: './layouts/sidebar', foundCumRap, foundRap});

            }else{

                console.log('them thanh cong');
                const foundcreatedRap = await Rap.createdPhim(rrap, temp_tencumrap1, loairap, ktngang,ktdoc);

                const foundCumRap = await CumRap.findCR_Rap();
                const foundRap = await Rap.findRap();
        
        
                res.render('auth/option/rap', { layout: './layouts/sidebar', foundCumRap, foundRap});
    

            }



            const foundCumRap = await CumRap.findCR_Rap();
            const foundRap = await Rap.findRap();
    
    
            res.render('auth/option/rap', { layout: './layouts/sidebar', foundCumRap, foundRap});


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
            const {idcumrap, tencumrap, diachi} = req.body;

           
            const foundCumRapByID = await CumRap.findCumRapByID(idcumrap);

            
            if(!foundCumRapByID){
                console.log('khong tim thay');
                const foundCumRap = await CumRap.findCR_Rap();
                res.render('auth/option/cumrap', { layout: './layouts/sidebar', foundCumRap});
            }else{
                console.log('tim thay');
                const found_updatedCumRap = await CumRap.updateCumRapByIDcumrap( idcumrap,tencumrap, diachi );


                const foundCumRap = await CumRap.findCR_Rap();
                res.render('auth/option/cumrap', { layout: './layouts/sidebar', foundCumRap});

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
            res.render('auth/option/cumrap', { layout: './layouts/sidebar', foundCumRap});

           

        }
        else{
            const {tencumrap, diachi} = req.body;

            const foundCumRapByTencumRap = await CumRap.findCumRapByTencumrap(tencumrap);
            if (foundCumRapByTencumRap[0] !== undefined){
                const foundCumRap = await CumRap.findCR_Rap();
                console.log('Ten bi trung, khong the them cum rap');
                res.render('auth/option/cumrap', { layout: './layouts/sidebar', foundCumRap});

            }else{

                console.log('them thanh cong');
                const found_createdCumRap = await CumRap.createdCumRap(tencumrap, diachi);

                const foundCumRap = await CumRap.findCR_Rap();
                res.render('auth/option/cumrap', { layout: './layouts/sidebar', foundCumRap});
    
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
            const {idsuatchieu, giave, giobatdau, gioketthuc} =req.body;
            const found_updatesuatchieu = await SuatChieu.updateSuatChieuIDsuatchieu(idsuatchieu, giave, giobatdau, gioketthuc);
            console.log(found_updatesuatchieu);


            const found_SuatChieuByIDsuatchieu = await SuatChieu.findSuatChieuByID(idsuatchieu);

            var tenphim = found_SuatChieuByIDsuatchieu[0].PhimIDphim;

            const found_RapByIDrap =  await Rap.findRapByIDrap(found_SuatChieuByIDsuatchieu[0].RapIDrap);
            var tencumrap = found_RapByIDrap[0].CumRapIDcumrap;
            var tenrap = found_RapByIDrap[0].Tenrap;


            const found_AllMovie =await Phim.find_All();
            const foundCumRap = await CumRap.findCR_Rap();
            const foundRap = await Rap.findRap();
            const foundPhim = await Phim.find_All();
            res.render('auth/option/suatchieu', { layout: './layouts/sidebar',tenrap,tencumrap,tenphim,found_suatchieu,foundPhim,foundCumRap,foundRap,  found_AllMovie});


        }else if(check_option === '2'){
            const {ngayxem, tencumrap, tenrap, tenphim} = req.body;

            const found_TenPhim = await Phim.findPhimByID(tenphim);
            const found_IDRap = await Rap.findRapByTenrap(tenrap);
            
            const found_suatchieu = await SuatChieu.findAllSuatChieuBy_Tphim_Rap_ddmmyyy(found_TenPhim[0].Tenphim, found_IDRap[0].IDrap, ngayxem);
    
    
            const found_AllMovie =await Phim.find_All();
            const foundCumRap = await CumRap.findCR_Rap();
            const foundRap = await Rap.findRap();
            const foundPhim = await Phim.find_All();

            res.render('auth/option/suatchieu', { layout: './layouts/sidebar',tenrap,tencumrap,tenphim, found_suatchieu,foundPhim,foundCumRap,foundRap,  found_AllMovie});
        }else if(check_option === '3'){
            
            const {idsuatchieu2 } = req.body;

            // Tìm ds Dặt Chổ có IDsuatchieu
            const found_DatChoByIDsuatchieu_before = await DatCho.findDatChoByIDsuatchieu(idsuatchieu2);
            // Xoa Ve có IDdatcho
            for (const key in found_DatChoByIDsuatchieu_before){
                const found_deleteVeByIDdatcho = await Ve.deleteVeByIDdatcho(found_DatChoByIDsuatchieu_before[key].IDdatcho);
            }

            // Xoa DatCho có IDsuatchieu
            const found_deleteDatChoByIDsuatchieu = await DatCho.deleteDatChoByIDsuatchieu(idsuatchieu2);
            // Xoa SuatChieu có IDsuatchieu
            const found_deleteSuatChieuByIDsuatchieu = await SuatChieu.deleteSuatChieuByIDsuatchieu(idsuatchieu2);
           
            const found_SuatChieuByIDsuatchieu = await SuatChieu.findSuatChieuByID(idsuatchieu2);

            var tenphim = found_SuatChieuByIDsuatchieu[0].PhimIDphim;

            const found_RapByIDrap =  await Rap.findRapByIDrap(found_SuatChieuByIDsuatchieu[0].RapIDrap);
            var tencumrap = found_RapByIDrap[0].CumRapIDcumrap;
            var tenrap = found_RapByIDrap[0].Tenrap;


            const found_AllMovie =await Phim.find_All();
            const foundCumRap = await CumRap.findCR_Rap();
            const foundRap = await Rap.findRap();
            const foundPhim = await Phim.find_All();
            res.render('auth/option/suatchieu', { layout: './layouts/sidebar',tenrap,tencumrap,tenphim,found_suatchieu,foundPhim,foundCumRap,foundRap,  found_AllMovie});

        }
        else{
            const {idphim1, idrap1, giave1, ngaybatdau1, ngayketthuc1, giobatdau1, gioketthuc1} = req.body;
            const found_TenPhim = await Phim.findPhimByID(idphim1);
            const found_IDRap = await Rap.findRapByTenrap(idrap1);
            const found_suatchieu = await SuatChieu.findAllSuatChieuBy_Tphim_Rap_ddmmyyy(found_TenPhim[0].Tenphim, found_IDRap[0].IDrap, ngaybatdau1);

            const foundCreatedSuatChieu = await SuatChieu.createdSuatChieu(ngaybatdau1, giobatdau1, ngayketthuc1, gioketthuc1, giave1, idphim1, found_IDRap[0].IDrap);


            var tenphim = found_TenPhim[0].IDphim;
            var tencumrap = found_IDRap[0].CumRapIDcumrap;
            var tenrap = found_IDRap[0].Tenrap;

            
            const found_AllMovie =await Phim.find_All();
            const foundCumRap = await CumRap.findCR_Rap();
            const foundRap = await Rap.findRap();
            const foundPhim = await Phim.find_All();
            res.render('auth/option/suatchieu', { layout: './layouts/sidebar',tenrap,tencumrap,tenphim,found_suatchieu,foundPhim,foundCumRap,foundRap,  found_AllMovie});


        }



        
    }));
module.exports = router;

