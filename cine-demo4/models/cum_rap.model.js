
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
      return CumRap.findAll({
        order: [
            // Will escape title and validate DESC against a list of valid direction parameters
            ['updatedAt', 'DESC'],
          ]
      });
  
  };

  
  CumRap.findCumRapByTencumrap = async function(Tencumrap)
{
    return CumRap.findAll({
        where :{
            Tencumrap: Tencumrap,
        },
    });
};
CumRap.createdCumRap = async function( Tencumrap, Diachi)
{
    const cumrap = await CumRap.create({
        IDcumrap: randomstring.generate(),
        Tencumrap: Tencumrap,
        Diachi: Diachi
    });

};
CumRap.findCumRapByID = async function(IDcumrap)
{
    return CumRap.findOne({
        where :{
            IDcumrap: IDcumrap,
        },
        
    });
};

CumRap.updateCumRapByIDcumrap = async function(IDcumrap, Tencumrap, Diachi)
{
    
    
      return CumRap.update({ Tencumrap: Tencumrap,  Diachi: Diachi  }, {
        where: {
            IDcumrap: IDcumrap ,
        },
      });
    
    
};

CumRap.deleteCumRapByIDcumrap = async function(IDcumrap)
{
    return CumRap.destroy({
        where: {
            IDcumrap: IDcumrap
        }
      });
}

module.exports = CumRap;