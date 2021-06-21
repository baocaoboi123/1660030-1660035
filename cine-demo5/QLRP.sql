router.get('/:tenphim', asyncHandler(async function(req, res, next){
       
        
        const tenphim_temp = req.params.tenphim
        const found = await Phim.findOneMovie(tenphim_temp);
        const result = found;

        const found_AllSCByTenphim = await SuatChieu.findAllSuatChieuByTenphim(tenphim_temp);
        for (const key in found_AllSCByTenphim){
            found_AllSCByTenphim[key].Batdau =  moment(found_AllSCByTenphim[key].Batdau).format("DD-MM-YYYY HH:mm");
            found_AllSCByTenphim[key].Ketthuc =  moment(found_AllSCByTenphim[key].Ketthuc).format("DD-MM-YYYY HH:mm");
        }
        console.log(found_AllSCByTenphim);
        var array_check = [];


        // const found_CumRap_Rap = await Rap.findCR_Rap();

        
        // const unique = [...new Set(found_CumRap_Rap.map(item => item.Tencumrap))];
        const found_CumRap_Rap = await CumRap.findCR_Rap();
        
        

        
        var array =[];
    
        var start1_Tencumrap = "";
        var start1_Tenrap = "";
      
        res.render('movies/phim', { layout: './layouts/sidebar',result,start1_Tenrap,start1_Tencumrap, array, array_check,  found_CumRap_Rap});
 

    }));


    router.post('/:tenphim', asyncHandler(async function(req, res, next){

        const { start1_Tencumrap, start1_date, start1_month, start1_year, start1_Tenrap, start1_Tenphim} = req.body;

        const tenphim_temp = req.params.tenphim
        const found = await Phim.findOneMovie(tenphim_temp);
        const result = found;


        console.log(start1_Tenrap);
        console.log(start1_Tenrap);
        console.log(start1_Tenrap);
        console.log(start1_Tenrap);
        console.log(start1_Tenrap);

        console.log(start1_Tenrap);

        const found_rap  = await Rap.findRapByTenrap(start1_Tenrap);
        console.log(found_rap[0].IDrap);
        console.log(found_rap[0].IDrap);
        console.log(found_rap[0].IDrap);
        console.log(found_rap[0].IDrap);



        const found_suatchieu = await SuatChieu.findAllSuatChieuBy_Tphim_Rap_ddmmyyy(start1_Tenphim, found_rap[0].IDrap, start1_year);



        // for (const key in found_suatchieu){
            
        //     found_suatchieu[key].Batdau =  moment(found_suatchieu[key].Batdau).format("HH:mm");
        //     found_suatchieu[key].Ketthuc =  moment(found_suatchieu[key].Ketthuc).format("DD-MM-YYYY HH:mm");
        // }
        
        var array_check = [];
        array_check = found_suatchieu;


        const found_CumRap_Rap = await CumRap.findCR_Rap();



            res.render('movies/phim', { layout: './layouts/sidebar',found_CumRap_Rap, result, array_check, start1_Tencumrap, start1_Tenrap});
    




    }));
============================================================================================
<section style="background-color:#000; color: #fff"   class="about10 py-4">
 
  <div class="tab-content row my-1 mx-auto">
    
  
    <div id="p" class="tab-pane fade in active show col-lg-12 col-md-12 col-12 w-50 pt-5 pb-5">                                   
      <div class="card-deck mx-auto">
        <div    class="img col-lg-3 col-md-3 col-12 w-50 pt-5 pb-5">
                                           
          <!-- <h2 style="padding: 0.4rem 0rem;"  class="text-center align-items-center"><%- result.Tenphim %></h2>       -->
          <div hidden class="container">
            
          
          </div>
          <img class="img-fluid container" src="<%- result.Posterphim %>" alt="">      
          
          

        </div> 
        <div  class="text col-lg-9 col-md-9 col-12 w-50 pt-5 pb-5">   
          <div class="row">
              <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Cum Rap va Rap</span>
                  </div>
                  <select onchange="populate(this.id, 'inputGroupSelect05')"   class="custom-select" name="inputGroupSelect03" id="inputGroupSelect03" aria-label="Example select with button addon">
                      <option value="">----Chon Cum Rap----</option>
                   
      
                      <% for (const key in found_CumRap_Rap){%>
                        <option selected><%- found_CumRap_Rap[key].Tencumrap %></option>

                      <%}%>


                     
                  </select>
                  
                                  
                  <script>
                    function populate(s1, s2){
                      var s1 = document.getElementById('inputGroupSelect03');
                      var s2 = document.getElementById('inputGroupSelect05');
                      s2.innerHTML = "";
                      
                      if (s1.value == "Quốc Thanh"){
                        var optionArray = ['Cine Quốc Thanh|Cine Quốc Thanh', 'Cine temp|Cine temp'];
                      }
                      if (s1.value == "Hai Bà Trưng"){
                        var optionArray = ['Cine Hai Bà Trưng|Cine Hai Bà Trưng','Cine sample|Cine sample'];
                      }
                      if (s1.value == "Bình Dương"){
                        var optionArray = ['Cine Bình Dương|Cine Bình Dương','Cine index|Cine index'];
                      }

                      for (var option in optionArray){
                        var pair = optionArray[option].split("|");
                        var newoption = document.createElement("option");
                        newoption.value = pair[0];
                        newoption.innerHTML = pair[1];
                        s2.options.add(newoption);
                      }
                     








                      }
                      
                     
                  </script>
                        
                 

                  <select  class="custom-select" name="inputGroupSelect05" id="inputGroupSelect05" aria-label="Example select with button addon">
                      <% if (start1_Tenrap === ""){%>
                        <option value="">----Chon Rap----</option>
                      <%}else{%>
                        <option value=""><%- start1_Tenrap%></option>
                      <%}%>
                     

                  </select>
                  


                  
              </div>
          </div>    
          <div class="row container d-flex">

             
                <div class="nav nav-pills ml-auto p-1">       


                <form method="POST" >                                     
                  <input placeholder="chon ngay" type="date" id="start1" onchange="getEventTime1()" >                                                        
                  <input hidden type="text" name="en" id="en">    
                  <input hidden type="text" name="start1_date" id="start1_date">
                  <input hidden type="text" name="start1_month" id="start1_month">
                  <input hidden type="text" name="start1_year" id="start1_year">   
                  <input hidden type="text" name="start1_Tenrap" id="start1_Tenrap">                              
                  <input hidden type="text" name="start1_Tenphim" id="start1_Tenphim"> 

                  <input hidden type="text" name="start1_Tencumrap" id="start1_Tencumrap">  
                  
                  

                  <button type="submit">Xem suat chieu</button> 
                </form>
                </div>
                <script>

                        

                  var getEventTime1 = function(){
                    var temp_date = moment(document.getElementById("start1").value).format("DD");
                    var temp_month = moment(document.getElementById("start1").value).format("MM");
                    var temp_year = moment(document.getElementById("start1").value).format("YYYY-MM-DD");
                    var temp_tenphim = document.getElementById('tenphim').innerText;                  
                    var temp_tenrap = document.getElementsByName('inputGroupSelect05')[0].value;


                    var temp_tencumrap = document.getElementsByName('inputGroupSelect03')[0].value;






                    document.getElementById('start1_date').value = temp_date;
                    document.getElementById('start1_month').value = temp_month;
                    document.getElementById('start1_year').value = temp_year;            
                    document.getElementById('start1_Tenrap').value = temp_tenrap;
                    document.getElementById('start1_Tencumrap').value = temp_tencumrap;
                    document.getElementById('start1_Tenphim').value = temp_tenphim;
                               
                  }
                
                </script>






          </div>
         
          <div class="row">
             <div>
                <h1 type="text" id="tenphim"><%- result.Tenphim %></h1>
                <h5 hidden id="ngaycongchieu_temp">  <%- (result.Ngaycongchieu) %></h5>

                <h5 id="ngaycongchieu" >Ngay cong chieu:  </h5>

                <div class="card-deck">
                
                    <% for (const key in array_check){%>
                      <form action="/cine/routes/muave.js"   method="GET">
                        <div class="card mb-3" style="max-width: auto; color: black;">
                            <div class="card-body">
                                
                              <h5   id="tempHHSS" class="card-title"><%-array_check[key].GioBatDau %></h5>
                            
                              <input  hidden id="sc" name="sc" class="card-title" value="<%-array_check[key].IDsuatchieu %>">
                              <input hidden id="tp" name="tp" class="card-title" value="<%-array_check[key].Tenphim %>">
                              <!-- <p class="card-text"><%- array_check[key].Batdau %></p> -->
                              <a href="/muave/<%-array_check[key].IDsuatchieu%>">Mua ve</a>
                            
                            </div>
                            <button type="submit" class="btn btn-primary">
                              <a href="/muave/<%-array_check[key].IDsuatchieu%>">Mua ve</a>
                            </button>
                          </div>

                      </form>
                    <%}%>
                    

                  
                  
                    

                </div>
 

             </div>
      
          </div>
      

        </div>
       
      </div>
      
    </div>

  </div>
</section>

      
<script>
    var temp1 = moment(document.getElementById("ngaycongchieu_temp").innerHTML).format("DD-MM-YYYY");
                                
                                document.getElementById('ngaycongchieu').innerHTML =temp1;
   </script>
               











================================
create table NGUOI_DUNG_ADMIN
(
IDnguoidung varchar(100) primary key not null,
Email nvarchar(50),
Matkhau nvarchar(20),
Hoten nvarchar(50),
Sodienthoai nvarchar(10),
Vaitro int
)

go
create table CUM_RAP
(
IDcumrap varchar(10) primary key not null,
Tencumrap nvarchar(50),
Diachi nvarchar(50)
)
go

create table RAP
(
    IDrap varchar(10) primary key not null,
    Tenrap nvarchar(50),
    IDcumrap varchar(10),
    Loairap nvarchar(10),
    Kichthuocngang nvarchar(10),
    Kichthuocdoc nvarchar(10),
    constraint fk_RAP_CUM_RAP
    foreign key (IDcumrap)
    references CUM_RAP (IDcumrap)
    )
go

create table PHIM
(
IDphim varchar(10) primary key not null,
Tenphim nvarchar(50),
Ngaycongchieu date,
Posterphim nvarchar(50),
Thoiluong nvarchar(10)
)
go

create table SUAT_CHIEU
(
IDsuatchieu varchar(10) primary key not null,
IDphim varchar(10),
IDrap varchar(10),
Batdau datetime,
Ketthuc datetime,
Giave nvarchar(10),
constraint fk_SUAT_CHIEU_PHIM
foreign key (IDphim)
references PHIM (IDphim),
constraint fk_SUAT_CHIEU_RAP
foreign key (IDrap)
references RAP (IDrap)
)
go
create table DAT_CHO
(
IDdatcho varchar(10) primary key not null,
IDnguoidung varchar(100),
IDsuatchieu varchar(10),
Thoigiandatve datetime,
Tongtien nvarchar(100),
constraint fk_DAT_CHO_SUAT_CHIEU
foreign key (IDsuatchieu)
references SUAT_CHIEU (IDsuatchieu),
constraint fk_DAT_CHO_NGUOI_DUNG_ADMIN
foreign key (IDnguoidung)
references NGUOI_DUNG_ADMIN (IDnguoidung)
)

go
create table VE
(
IDve varchar(10) primary key not null,
IDdatcho varchar(10),
IDrap varchar(10),
Maghe nvarchar(10),
Giatien nvarchar(10),
constraint fk_VE_RAP
foreign key (IDrap)
references RAP (IDrap)
)



const randomstring = require('randomstring');
 
randomstring.generate();

const { DataTypes} = require('sequelize');
const db = require('./db');

const User = db.define('User', {
    // Model attributes are defined here
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    displayname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }

  });


// const users = [{
//     id: 1,
//     username: '1660035',
//     displayname: '1660035',
//     email: 'tempsample@gmail.com',
//     password: 'kocopass',
// },
// {
//     id: 2,
//     username: '123',
//     displayname: '123',
//     email: 'sampleindex@gmail.com',
//     password: 'kocopass',
// }

// ];

User.findByUserName = async function(username)
{
    // return users.find(u => u.username === username);
    return User.findOne({
        
        where: {
            username,
            status: 1,
            code: '',
        },
    });

};
User.findByUserNameActive = async function(username)
{
    // return users.find(u => u.email === email);
    return User.findOne({
        where :{
            username,
        },
    });
};
User.findByEmail = async function(email)
{
    // return users.find(u => u.email === email);
    return User.findOne({
        where :{
            email,
        },
    });
};

User.findById = async function(id)
{
    // return users.find(u => u.id === id);
    return User.findByPk(id);
};



User.addUser = async function(username, displayname, email, password)
{
    const todo = await User.create({
        username: username,
        displayname: displayname,
        email: email,
        password: password,
        code: randomstring.generate(),
        status: 0

        
    });

};

User.activeUser = async function(code)
{
    const idByCode = await User.findOne({
        where :{
            code,
            status: 0,
        },
    });
    

    


    return User.update({ code: "", status: 1 }, {
        where: {
            id: idByCode.id ,
        },
      });
};


User.notActivedUser = async function(email)
{
    return User.update({ code: randomstring.generate(), status:0 }, {
        where: {
            email: email ,
        },
      });
};

User.changePass = async function(code, newpass)
{
    const idByCode = await User.findOne({
        where :{
            code,
            status: 0,
        },
    });
    
    return User.update({ password: newpass }, {
        where: {
            id: idByCode.id ,
        },
      });
};


User.find_All = async function()
{
    return User.findAll();

};





// exports.add = function(id, email, displayname, password){
//     users.push(
//         {
//             id, 
//             email,
//             displayname,
//             username: 'sdasd',
//            password
//     });
// }

module.exports = User;


//=====================================================================================================
<section id="about" class="about py-5">
    <div class="row align-items-center container my-5 mx-auto">
        <div style="background-color: darkgreen;"  class="text col-lg-6 col-md-6 col-12 w-50 pt-5 pb-5">
                <select  name="selectedname" id="selectedname">
                        <% for(const key in foundCumRap){%>
                            <option value="<%- foundCumRap[key].IDcumrap%>"><%- foundCumRap[key].Tencumrap%></option>
            
                        <%}%>
                       
                    </select>
            <div>
                <p>Ten Cum Rap</p>
                <p>Dia Chi</p>
            </div>
        </div>
        <div style="background-color: cornflowerblue;" class="text col-lg-6 col-md-6 col-12 w-50 pt-5 pb-5">
                <% for(const key in foundCumRap){%>

                    <select class="data" name="" id="<%- foundCumRap[key].IDcumrap%>">
                            <%for(const temp in foundRap){
                                if(foundCumRap[key].IDcumrap === foundRap[temp].CumRapIDcumrap){%>
                         <option value="<%-foundRap[temp].Tenrap%>"><%-foundRap[temp].Tenrap%></option>
                            <%}
                        }%>
                        </select>
                <%}%>
            <div>
                <p>Ten  Rap</p>
                <p>Dia Chi</p>
            </div>
        </div> 
       
    </div>
    <div  class="row align-items-center container my-5 mx-auto">
        <div style="background-color: salmon; " class="col-lg-12 col-md-12 col-12 w-100 pt-5 pb-5">
            <div style="background-color: #000;"  class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="list-home" role="tabpanel" aria-labelledby="list-home-list">
                       
                        <main class="m  container align-items-center">
                            <% for(const key in found_AllMovie){%>
                            <div class="phim ">
                                <img src="<%- found_AllMovie[key].Posterphim %>" alt="">
                                <div class="phim-info">
                                    <p><%- found_AllMovie[key].Tenphim %></p>
                                    <button onclick="thaydoiphim1('<%- found_AllMovie[key].Tenphim %>', '<%- found_AllMovie[key].Posterphim %>', '<%- found_AllMovie[key].Thoiluong %>', '<%- found_AllMovie[key].IDphim %>')"   id="edit" class="edit" >Edit</button>
                                </div>
                                <select hidden class="custom-select" name="inputGroupSelect05" id="inputGroupSelect05" aria-label="Example select with button addon">
                                                                                
                                    <option value="<%- found_AllMovie[key].Tenphim %>"><%- found_AllMovie[key].Tenphim %></option>
                                    <option value="<%- found_AllMovie[key].Posterphim %>"><%- found_AllMovie[key].Posterphim %></option>    
                                                         
                                </select>
                            
                            </div>
                            <%}%>
                        </main>
                </div>
               
            </div>
        </div>
    </div>  
</section>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js">
</script>
<script>
    $(document).ready(function(){
        $("#selectedname").on('change', function(){
            $(".data").hide();
            $("#" + $(this).val()).fadeIn(700);
        }).change();
        
    });

 
    
</script>