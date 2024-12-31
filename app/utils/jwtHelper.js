
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const generateToken = (payload, expiresIn = '2h') => {
  const token = jwt.sign(payload, secretKey, { expiresIn });
  const expiresAt = Date.now() + jwt.decode(token).exp * 1000 - Math.floor(Date.now() / 1000) * 1000; 
  return { token, expiresAt };
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