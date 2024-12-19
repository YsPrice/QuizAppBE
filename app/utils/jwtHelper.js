
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const generateToken = (payload, expiresIn = '2h') =>{
    return jwt.sign(payload, secretKey,{ expiresIn});

};

const verifyToken = (token) =>{
    try{
      
        return jwt.verify(token,secretKey);

    }catch(err){
        throw new Error('Invalid or expired token', err)
    }
}
console.log("JWT_SECRET:", process.env.JWT_SECRET);


module.exports = {
    generateToken,
    verifyToken,
  };