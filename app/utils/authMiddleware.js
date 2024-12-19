
const {verifyToken} = require('./jwtHelper')
const authenticate = (req) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new Error('Authentication Required')
    }

const token = authHeader.split(' ')[1];
try{
    const decoded =verifyToken(token);
    return decoded.userId;
} catch(err){
    throw new Error('invalid or expired token', err)
}
};

module.exports = authenticate;