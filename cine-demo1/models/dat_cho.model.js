
const { DataTypes} = require('sequelize');
const db = require('./db');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');
const NguoiDungAdmin = require('../models/nguoi_dung_admin.model');
const SuatChieu = require('../models/suat_chieu.model');

const DatCho = db.define('DatCho', {
    // Model attributes are defined here
    IDdatcho: {
      type: DataTypes.STRING,
      allowNull: false,
        primaryKey: true,
    },
    
    Thoigiandatve: {
        type: DataTypes.DATE,
        allowNull: false,
    },    
    Tongtien: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
   
  });

  NguoiDungAdmin.hasMany(DatCho);
  
  DatCho.belongsTo(NguoiDungAdmin);

  SuatChieu.hasMany(DatCho);
  

  DatCho.belongsTo(SuatChieu);




module.exports = DatCho;