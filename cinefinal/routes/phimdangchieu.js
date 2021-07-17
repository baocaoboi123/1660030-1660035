var express = require('express');
var router = express.Router();

const asyncHandler =  require('express-async-handler');
const Email = require('../models/email');
const Phim = require('../models/phim.model');
const CumRap = require('../models/cum_rap.model');
const Rap = require('../models/rap.model');
const moment = require('moment');
const SuatChieu = require('../models/suat_chieu.model');

router.get('/',asyncHandler(async function(req, res)
    {
        var title = "PHIM ĐANG CHIẾU"
        const found =await Phim.find_All();
        var list_phimdangchieu = found;

        res.render('movies/phimdangchieu', { layout: './layouts/sidebar', list_phimdangchieu, title});
    }));

    router.post('/',asyncHandler(async function(req, res, next) {
        
        
        const {title_tenphim} = req.body;
        
        if (title_tenphim !== undefined){
            
                res.redirect(`/phim/${title_tenphim}`);
            }else{
                res.redirect('/phimdangchieu');
            }


    }));

    router.get('/chitietphim/:tenphim',asyncHandler(async function(req, res, next)
    {
        const tenphim_temp = req.params.tenphim;
        const found_PhimByTenPhim = await Phim.findPhimByTenphim1(tenphim_temp);

        const found_Phim = await Phim.find_All();

        console.log(found_Phim.length);
       


        var array_PhimNgauNhien = [];

        const random_length = 5 ;
        var i = 0;
        for( i; i < random_length; i++){
            
            var check_random = Math.floor(Math.random() * found_Phim.length);
            var check = 0;
            for(const key in array_PhimNgauNhien){
                if(check_random === array_PhimNgauNhien[key]){
                    check = 1;
                }
            }
            if(check !== 1){
                array_PhimNgauNhien.push(check_random);
            }else{
                if(i === 0){
                    i = 0;
                }else{
                    i--;
                }

            }
        }

        console.log(array_PhimNgauNhien);

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

        const found_CumRap = await CumRap.findCR_Rap();

        const found_Rap = await Rap.findRap();
        
        console.log(tenphim_temp);
        const found_SuatChieu = await SuatChieu.findAllSuatChieuByTenphim(tenphim_temp);

        console.log(found_SuatChieu);






        res.render('movies/chitietphim', { layout: './layouts/sidebar',found_SuatChieu,found_Rap,found_CumRap,array_listday,found_Phim,array_PhimNgauNhien, found_PhimByTenPhim});
    }));





module.exports = router;


{/* <section  id="movie" class="movie py-5">
    <div    class="row align-items-center container my-5 mx-auto">
           
        <ul   class="row  nav nav-pills mx-auto ">    
            <li     class="text col-lg-6 col-md-6 col-12 active "><a data-toggle="" href="/phimdangchieu"><%- title %></a></li>
            <li     class="text col-lg-6 col-md-6 col-12  ">
                <a  href="/phimsapchieu" data-toggle="">PHIM SẮP CHIẾU</a>
            </li>                
        </ul>
           

        <div style="background-color: #000;"  class="tab-content row align-items-center container pt-3 mx-auto">
                
                        <div id="home" class="tab-pane fade in active show">                                   
                                    <div class="card-deck mx-auto">
                                        <% for (const key in list_phimdangchieu)
                                        {%>
                                            
                         
                                            
                                            <div class="card mb-3" style="min-width: 15rem; max-width: 15rem; border: none;">
                                                <form  method="POST">

                                                    <input type="hidden" name="title_tenphim" id="title_tenphim"  value="<%- list_phimdangchieu[key].Tenphim%>">
                                                    <input type="image" class="card-img-top" style="max-height: 20rem;" src="<%- list_phimdangchieu[key].Posterphim %>"  alt="Card image cap" />

                                                    <!-- <img type="submit"  class="card-img-top" style="max-height: 20rem;"  src="<%- list_phimdangchieu[key].Posterphim %>" alt="Card image cap"> -->
                                                    
                                                    
                                                    <div class="card-body">
                                                    <h5  class="text-center card-title"><%- list_phimdangchieu[key].Tenphim%></h5>
                                                    
                                                    </div>
                                                    <div class="card-footer">
                                                    <small class="text-muted">Time:  <%- list_phimdangchieu[key].Thoiluong %></small>
                                                    <small class="text-muted">Date:  <%- list_phimdangchieu[key].Ngaycongchieu %></small>
                                                    </div>
                                                </form>

                                            </div>



                                        <%}
                                        %>
                                    </div> 

                               
                        </div>
                        
                
        </div>
    
    </div>
</section> */}