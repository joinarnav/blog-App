const jwt= require('jsonwebtoken');

const secret= 'wtf$superman';

function createToken(user){
    const payload={
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImageURL,
        role: user.role
    };
    const token= jwt.sign(payload, secret);
    return token;
}

function validateToken(token){
    const validation= jwt.verify(token, secret);
    // console.log(validation);
    return validation;
}

module.exports={
    createToken,
    validateToken
}