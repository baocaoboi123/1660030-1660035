var express = require('express');
var router = express.Router();

const asyncHandler =  require('express-async-handler');
const Email = require('../models/email');
const Phim = require('../models/phim.model');



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