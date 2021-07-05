
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
            Tenrap: Tenrap,
        },
    });
};

Rap.findRapByID = async function(IDrap)
{
    return Rap.findOne({
        where :{
            IDrap: IDrap,
        },
        
    });
};
Rap.findRapByIDrap = async function(IDrap)
{
    return Rap.findAll({
        where :{
            IDrap: IDrap,
        },
    });
};
Rap.findRap = async function()
{
    return Rap.findAll();

};

Rap.updateRapByIDrap = async function(IDrap,Tenrap, CumRapIDcumrap, Loairap, Kichthuocngang, Kichthuocdoc)
{
    
    
      return Rap.update({ Tenrap: Tenrap,  CumRapIDcumrap: CumRapIDcumrap,Loairap: Loairap, Kichthuocngang: Kichthuocngang, Kichthuocdoc: Kichthuocdoc  }, {
        where: {
            IDrap: IDrap ,
        },
      });
    
    
};
Rap.createdPhim = async function( Tenrap, CumRapIDcumrap, Loairap, Kichthuocngang, Kichthuocdoc)
{
    const rap = await Rap.create({
        IDrap: randomstring.generate(),
        Tenrap: Tenrap,
        CumRapIDcumrap: CumRapIDcumrap,
        Loairap: Loairap,
        Kichthuocngang: Kichthuocngang,
        Kichthuocdoc :Kichthuocdoc
        

    });

};

Rap.deleteRapByIDrap = async function(IDrap)
{
    return Rap.destroy({
        where: {
            IDrap: IDrap
        }
      });
}

Rap.findRapByIDcumrap = async function(CumRapIDcumrap)
{
    return Rap.findAll({
        where :{
            CumRapIDcumrap: CumRapIDcumrap,
        },
    });
};

Rap.feq = async function(CumRapIDcumrap)
    {
        // return users.find(u => u.email === email);
        return Rap.findAll({
            attributes: [
                'IDrap','Tenrap'
            ],    
            include: [{

                model: CumRap,
                attributes: [
                    'IDcumrap'
                ],
                where: { 
                    IDcumrap: CumRapIDcumrap,                
                 }
            }],
            group: ['IDcumrap','IDrap']
        });
    };




  CumRap.hasMany(Rap);
  

  Rap.belongsTo(CumRap);
 

  
module.exports = Rap;