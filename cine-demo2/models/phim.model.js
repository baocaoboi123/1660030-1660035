
const { DataTypes} = require('sequelize');
const db = require('./db');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');

const Phim = db.define('Phim', {
    // Model attributes are defined here
    IDphim: {
      type: DataTypes.STRING,
      allowNull: false,
        primaryKey: true,
    },
    Tenphim: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Ngaycongchieu: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Posterphim: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Thoiluong: {
        type: DataTypes.STRING,
        allowNull: false,
    }
   
  });



Phim.find_All = async function()
{
    return Phim.findAll();

};

Phim.findOneMovie = async function(Tenphim)
{
    // return users.find(u => u.email === email);
    return Phim.findOne({
        where :{
          Tenphim,
        },
    });
};



 
module.exports = Phim;