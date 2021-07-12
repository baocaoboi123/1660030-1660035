

const { model } = require('./db');
const { DataTypes} = require('sequelize');
const db = require('./db');
const CumRap = require('../models/cum_rap.model');
var LoggedIn = require('../middlewares/logged_in');

const Ima = db.define('Ima', {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: false,
      allowNull: false,
    },
    

  });


Ima.add_ima = async function(name,description, UserId)
{
    const ima = await Ima.create({
        UserId: UserId,
        name: name,
        description: description,
       
        
    });
};
Ima.edit = async function(UserId, name, description)
{
    const idByUserId = await User.findOne({
        where :{
            id: UserId,
            
        },
    });
    
    return Ima.update({ name: name , description: description, UserId: idByUserId.id }, {
        where: {
            UserId: idByUserId.id ,
        },
      });




};


Ima.findById = async function(UserId)
{
    return Ima.findOne({
        where: {           
            UserId,
            },
    });
};


Ima.belongsTo(CumRap);
CumRap.hasMany(Ima);


module.exports = Ima;
