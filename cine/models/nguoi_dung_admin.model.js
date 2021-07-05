
const { DataTypes} = require('sequelize');
const db = require('./db');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');
const NguoiDungAdmin = db.define('NguoiDungAdmin', {
    // Model attributes are defined here
    IDnguoidung: {
      type: DataTypes.STRING,
      allowNull: false,
        primaryKey: true,
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Matkhau: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Hoten: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Sodienthoai: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Vaitro: {
        type: DataTypes.ENUM(['user', 'admin']),
        defaultValue: 'user',
    },
    Code_Active: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
   


  });
    NguoiDungAdmin.findUser = async function()
    {
        return NguoiDungAdmin.findAll();
    };

  NguoiDungAdmin.addUser = async function(Email, Matkhau, Hoten, Sodienthoai)
  {
      let hashedPassword = await bcrypt.hash(Matkhau, 8);
      const nguoidungadmin = await NguoiDungAdmin.create({
          IDnguoidung: randomstring.generate(),
          Email: Email,
          Matkhau: hashedPassword,
          Hoten: Hoten,
          Sodienthoai: Sodienthoai,
          Code_Active: randomstring.generate(),
          Status: 0

      });
  
  };

  NguoiDungAdmin.findUserByEmail = async function(Email)
  {
      // return users.find(u => u.email === email);
      return NguoiDungAdmin.findOne({
          where :{
              Email,
          },
      });
  };


  NguoiDungAdmin.activeUser = async function(Code_Active)
  {
      const idByCode = await NguoiDungAdmin.findOne({
          where :{
            Code_Active,
            Status: 0,
          },
      });
      
  
  
      return NguoiDungAdmin.update({ Code_Active: "", Status: 1 }, {
          where: {
            IDnguoidung: idByCode.IDnguoidung ,
          },
        });
  };

    NguoiDungAdmin.findById = async function(IDnguoidung)
    {
        // return users.find(u => u.id === id);
        return NguoiDungAdmin.findByPk(IDnguoidung);
    };



   
    NguoiDungAdmin.changePass = async function(IDnguoidung, newPass, Sodienthoai, hoten)
    {
        let hashedPassword = await bcrypt.hash(newPass, 8);

        return NguoiDungAdmin.update({ Hoten: hoten, Sodienthoai: Sodienthoai, Matkhau: hashedPassword }, {
            where: {
                IDnguoidung: IDnguoidung ,
            },
          });
    };


    NguoiDungAdmin.updateThongTinUserPass = async function(IDnguoidung, Matkhau)
    {
        let hashedPassword = await bcrypt.hash(Matkhau, 8);

        return NguoiDungAdmin.update({ Matkhau: hashedPassword}, {
            where: {
                IDnguoidung: IDnguoidung,
            },
        });
        
        
    };
    NguoiDungAdmin.updateThongTinUser = async function(IDnguoidung, Hoten, Email, Sodienthoai)
    {
        return NguoiDungAdmin.update({ Hoten: Hoten, Email: Email, Sodienthoai: Sodienthoai}, {
            where: {
                IDnguoidung: IDnguoidung,
            },
        });
        
        
    };









module.exports = NguoiDungAdmin;