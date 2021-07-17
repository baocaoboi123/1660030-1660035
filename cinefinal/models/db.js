const {Sequelize} = require('sequelize');


module.exports = new Sequelize(process.env.DATABASE_URL ||  'postgres://sgorebdlkwrubz:87c76942fc36d5c7f3e283d3805c807b8c0136c0dadd98c48923c4a6663eedaa@ec2-44-194-225-27.compute-1.amazonaws.com:5432/d8q5k6hh3frmbi', {

    dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false 
          }
        },


});


// alias heroku='winpty /e/SOFTWARE/heroku/bin/heroku.cmd'
// 'postgres://postgres:pgcnvb1563@localhost:5432/rapphim'
// module.exports = new Sequelize(process.env.DATABASE_URL ||  'postgres://njyyycbhtwcwma:0888afc68843d221947c9a5ff9502f4cb3ad21dcf409a6012dbd3fdb3c4166fc@ec2-52-5-1-20.compute-1.amazonaws.com:5432/d58q4tgs6jt3qj', {
  // postgres://sgorebdlkwrubz:87c76942fc36d5c7f3e283d3805c807b8c0136c0dadd98c48923c4a6663eedaa@ec2-44-194-225-27.compute-1.amazonaws.com:5432/d8q5k6hh3frmbi
// module.exports = new Sequelize( 
// {
//     database: "d58q4tgs6jt3qj",
//     username: "njyyycbhtwcwma",
//     password: "0888afc68843d221947c9a5ff9502f4cb3ad21dcf409a6012dbd3fdb3c4166fc",
//     host: "54.175.95.123",
//     port: 5432,
//     dialect: "postgres",
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false // <<<<<<< YOU NEED THIS
//       }
//     },
// });
