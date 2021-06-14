
const { DataTypes, Op, sequelize } = require('sequelize');
const db = require('./db');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');
const Phim = require('../models/phim.model');
const Rap = require('../models/rap.model');

const SuatChieu = db.define('SuatChieu', {
    // Model attributes are defined here
    IDsuatchieu: {
      type: DataTypes.STRING,
      allowNull: false,
        primaryKey: true,
    },
    
    Batdau: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    GioBatDau: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    Ketthuc: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    GioKetThuc: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    Giave: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
   
  });
  SuatChieu.findSuatChieuByID = async function(IDsuatchieu)
  {
      // return users.find(u => u.email === email);
      return SuatChieu.findAll({
          where :{
            IDsuatchieu,
          },
          
      });
  };
    SuatChieu.findAllSuatChieuByTenphim = async function(Tenphim)
    {
        return SuatChieu.findAll({
            include: [{
                model: Phim,               
                where: { Tenphim, } 
            }]
        });
    };
   
    SuatChieu.findPosterPhimByIDSuatChieu = async function(IDsuatchieu)
    {
        return SuatChieu.findAll({
            attributes: [
                'IDsuatchieu','RapIDrap', 'Batdau', 'Ketthuc','Giave', 'GioBatDau', 'GioKetThuc'
            ],
            where: {
                IDsuatchieu: IDsuatchieu,
            },
            include: [{
                attributes: [
                    'IDphim','Tenphim', 'Posterphim'
                ],
                model: Phim,                
            }],
            group: ['IDphim','Tenphim','IDsuatchieu']

        });
    };



    SuatChieu.findAllSuatChieuBy_Tphim_Rap_ddmmyyy = async function(Tenphim, RapIDrap, start1_year)
    {
        // return users.find(u => u.email === email);
        return SuatChieu.findAll({
            attributes: [
                'IDsuatchieu','RapIDrap', 'Batdau', 'Ketthuc','Giave', 'GioBatDau', 'GioKetThuc'
            ],
            where: {
           
                RapIDrap: RapIDrap,
                Batdau: start1_year,
                

            },

            include: [{

                model: Phim,
                attributes: [
                    'IDphim','Tenphim'
                ],
                where: { 
                    Tenphim,                
                 }
            }],
            group: ['IDphim','Tenphim','IDsuatchieu']
        });
    };




    Phim.hasMany(SuatChieu);
    
    SuatChieu.belongsTo(Phim);

    Rap.hasMany(SuatChieu);
    

    SuatChieu.belongsTo(Rap);


module.exports = SuatChieu;