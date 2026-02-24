const jwt = require('jsonwebtoken');
const {env} = require('../config/env');

const generateAccessToken=(payload)=>{
    return jwt.sign(payload,env.jwtAccessToken,{
        expiresIn: "15m"
    })
}

const generateRefreshToken = (payload)=>{
    return jwt.sign(payload,env.jwtRefreshToken, {
        expiresIn : "7d"
    })
}

const verifyAccessToken = (token)=>{
    return jwt.verify(token,env.jwtAccessToken)
}

const verifyRefreshToken = (token)=>{
    return jwt.verify(token,env.jwtRefreshToken)
}

module.exports={
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}