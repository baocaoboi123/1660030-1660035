
const { DataTypes} = require('sequelize');
const db = require('./db');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');
const CumRap = require('../models/cum_rap.model');

const Rap = db.define('Rap', {
    // Model attributes are defined here
    IDrap: {
      type: DataTypes.STRING,
      allowNull: false,
        primaryKey: true,
    },
    Tenrap: {
        type: DataTypes.STRING,
        allowNull: false,
    },
   
    Loairap: {
        type: DataTypes.ENUM(['2D', '3D', '4DX']),
        defaultValue: '2D',
    },
    
    Kichthuocngang: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Kichthuocdoc: {
        type: DataTypes.STRING,
        allowNull: false,
    }
   
  });

  Rap.findCR_Rap = async function()
{
    return Rap.findAll( 
        { include: [ CumRap ] } 
    );
  
};

Rap.findRapByTenrap = async function(Tenrap)
{
    return Rap.findAll({
        where :{
            Tenrap,
        },
    });
};


  CumRap.hasMany(Rap);
  

  Rap.belongsTo(CumRap);
 

  
module.exports = Rap;