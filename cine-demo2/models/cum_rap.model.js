
const { DataTypes} = require('sequelize');
const db = require('./db');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');

const CumRap = db.define('CumRap', {
    // Model attributes are defined here
    IDcumrap: {
      type: DataTypes.STRING,
      allowNull: false,
        primaryKey: true,
    },
    Tencumrap: {
        type: DataTypes.STRING,
        allowNull: false,
    },
   
    Diachi: {
        type: DataTypes.STRING,
        allowNull: false,
    }
   
  });


  CumRap.findCR_Rap = async function()
  {
      return CumRap.findAll();
  
  };



module.exports = CumRap;