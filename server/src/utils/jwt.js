const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

// Generate short-lived access token
const generateAccessToken = (payload) => {
    return jwt.sign(payload, env.jwtAccessToken, {
        expiresIn: "30m" // Expires in 30 minutes
    })
}

// Generate long-lived refresh token
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, env.jwtRefreshToken, {
        expiresIn: "7d" // Expires in 7 days
    })
}

// Verify access token
const verifyAccessToken = (token) => {
    return jwt.verify(token, env.jwtAccessToken)
}

// Verify refresh token
const verifyRefreshToken = (token) => {
    return jwt.verify(token, env.jwtRefreshToken)
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}