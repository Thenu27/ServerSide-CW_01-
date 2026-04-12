const dotenv = require('dotenv');
dotenv.config() // Load variables from the .env file into process.env

const env = {
    port : process.env.PORT || 4000,
    database_url : process.env.DATABASE_URL,
    session_secret : process.env.SESSION_SECRET,
    jwtAccessToken : process.env.JWT_ACCESS_SECRET,
    jwtRefreshToken : process.env.JWT_REFRESH_SECRET,
    emailUser : process.env.EMAIL_USER,
    emailPass : process.env.EMAIL_PASS,
    frontendUrl : process.env.FRONTEND_URL

}

module.exports={env}