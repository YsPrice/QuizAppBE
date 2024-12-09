require('dotenv').config({path: require('path').resolve(__dirname, '../.env')});
const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()', (err,res)=>{
    if(err){
        console.log('error connecting to db', err.stack);
    } else{
        console.log('Db connection successful!', res.rows[0].now);
    }
});
console.log(process.env.DATABASE_URL);

module.exports = pool;