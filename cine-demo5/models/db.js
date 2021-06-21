const {Sequelize} = require('sequelize');


module.exports = new Sequelize(process.env.DATABASE_URL ||  'postgres://postgres:pgcnvb1563@localhost:5432/rapphim', {

    dialect: "postgres",
        dialectOptions: {
          // ssl: {
            // require: true,
            // rejectUnauthorized: false // <<<<<<< YOU NEED THIS
          // }
        },


});

