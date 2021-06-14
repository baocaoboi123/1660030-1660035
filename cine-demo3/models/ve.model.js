
const { DataTypes} = require('sequelize');
const db = require('./db');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');
const Rap = require('../models/rap.model');
const DatCho = require('../models/dat_cho.model');

const Ve = db.define('Ve', {
    // Model attributes are defined here
    IDve: {
      type: DataTypes.STRING,
      allowNull: false,
        primaryKey: true,
    },
   
    Maghe: {
        type: DataTypes.STRING,
        allowNull: false,
    },    
    Giatien: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
   
  });
  Ve.findAllve_datcho = async function(SuatChieuIDsuatchieu)
  {
      return Ve.findAll({
          include: [{
              model: DatCho,               
              where: { SuatChieuIDsuatchieu, } 
          }]
      });
  };

  Ve.createdVe = async function(IDve, DatChoIDdatcho, RapIDrap, Maghe, Giatien)
  {
      const ve = await Ve.create({
        IDve,
        DatChoIDdatcho,
          RapIDrap,
          Maghe,
          Giatien
          

      });
  
  };





  DatCho.hasMany(Ve);
  
  Ve.belongsTo(DatCho);

  Rap.hasMany(Ve);
  

  Ve.belongsTo(Rap);


module.exports = Ve;