
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
   

    SuatChieu.findPosterPhimByIDSuatChieu = async function(IDsuatchieu,Tenphim)
    {
        return SuatChieu.findAll({
            attributes: [
                'IDsuatchieu','RapIDrap', 'Batdau', 'Ketthuc','Giave', 'GioBatDau', 'GioKetThuc'
            ],
            where: {
                IDsuatchieu:IDsuatchieu,
                
                

            },

            include: [{

                model: Phim,
                attributes: [
                    'IDphim','Tenphim', 'Posterphim'
                ],
                where: { 
                    Tenphim,                
                 }
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

    SuatChieu.updateSuatChieuIDsuatchieu = async function(IDsuatchieu, Giave, GioBatDau, GioKetThuc)
    {
        
        
          return SuatChieu.update({ Giave: Giave,  GioBatDau: GioBatDau, GioKetThuc: GioKetThuc  }, {
            where: {
                IDsuatchieu: IDsuatchieu ,
            },
          });
        
        
    };
    SuatChieu.createdSuatChieu = async function( Batdau, GioBatDau, Ketthuc, GioKetThuc, Giave, PhimIDphim, RapIDrap)
    {
        const suatchieu = await SuatChieu.create({
            IDsuatchieu: randomstring.generate(),
            Batdau: Batdau,
            GioBatDau: GioBatDau,
            Ketthuc: Ketthuc,
            GioKetThuc : GioKetThuc,
            Giave: Giave,
            PhimIDphim : PhimIDphim,
            RapIDrap: RapIDrap
        });
    
    };


    SuatChieu.deleteSuatChieuByIDrap = async function(RapIDrap)
    {
        return SuatChieu.destroy({
            where: {
                RapIDrap: RapIDrap
            }
        });
    }


    SuatChieu.deleteSuatChieuByIDsuatchieu = async function(IDsuatchieu)
    {
        return SuatChieu.destroy({
            where: {
                IDsuatchieu: IDsuatchieu
            }
        });
    }


    SuatChieu.findSuatChieuByIDphim = async function(PhimIDphim)
    {
        return SuatChieu.findAll({
            where: {
                PhimIDphim: PhimIDphim
            }
        });
    };

    Phim.hasMany(SuatChieu);
    
    SuatChieu.belongsTo(Phim);

    Rap.hasMany(SuatChieu);
    

    SuatChieu.belongsTo(Rap);


module.exports = SuatChieu;