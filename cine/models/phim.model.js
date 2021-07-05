
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
    return Phim.findAll({
      order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ['Ngaycongchieu', 'ASC'],
      ]
    });

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

Phim.findPhimByID = async function(IDphim)
{
    // return users.find(u => u.email === email);
    return Phim.findAll({
        where :{
          IDphim,
        },
        
    });
};
Phim.findPhimByTenphim1 = async function(Tenphim)
{
    // return users.find(u => u.email === email);
    return Phim.findAll({
        where :{
          Tenphim,
        },
        
    });
};

Phim.findPhimByTenphim = async function(Tenphim)
{
    // return users.find(u => u.email === email);
    return Phim.findOne({
        where :{
          Tenphim,
        },
        
    });
};


Phim.updatePhimByIDPhim = async function(IDphim, Tenphim, Posterphim, Thoiluong, check_option, Ngaycongchieu)
{
    if(check_option === '1'){ //khong thay doi posterphim
      return Phim.update({ Tenphim: Tenphim,  Thoiluong: Thoiluong, Ngaycongchieu: Ngaycongchieu}, {
        where: {
          IDphim: IDphim ,
        },
      });
    }else{ // thay doi posterphim
      return Phim.update({ Tenphim: Tenphim,  Thoiluong: Thoiluong,Posterphim: Posterphim, Ngaycongchieu: Ngaycongchieu  }, {
        where: {
          IDphim: IDphim ,
        },
      });
    }
    
};
Phim.createdPhim = async function( Tenphim, Ngaycongchieu, Posterphim, Thoiluong)
{
    const phim = await Phim.create({
      IDphim: randomstring.generate(),
      Tenphim: Tenphim,
      Ngaycongchieu: Ngaycongchieu,
      Posterphim: Posterphim,
      Thoiluong: Thoiluong
        

    });

};

Phim.deletePhimByIDphim = async function(IDphim)
{
    return Phim.destroy({
        where: {
          IDphim: IDphim
        }
    });
}
module.exports = Phim;