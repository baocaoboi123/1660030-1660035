
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