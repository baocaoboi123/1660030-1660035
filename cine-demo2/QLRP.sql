
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
