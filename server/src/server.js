const express = require('express');
const {authRouter} = require('./routes/authRoute');
const {userRouter} = require('./routes/userRoutes.js');
const {profileRouter} = require('./routes/profileRoute.js')
const {ErrorMiddleware} = require('./middleware/errorMiddleware.js');
const {env} = require('./config/env.js');
const { degreeRouter } = require('./routes/degreeRoute.js');
const { employmentRouter } = require('./routes/employmentRoute.js');
const { certificationRouter } = require('./routes/certificationRoute.js');
const { liscenceRouter } = require('./routes/liscenceRoute.js');
const { courseRouter } = require('./routes/courseRoute.js');
const { bidRouter } = require('./routes/bidRoute.js');
const {apiRouter} = require("./routes/apiRoute.js");
const swaggerUi = require('swagger-ui-express')
const {swaggerSpec} = require('./config/swagger.js')
const { rateLimit } = require("express-rate-limit");

const cors = require('cors');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 100,              
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests, please try again later."
  }
});
const app = express()

app.use(cors({
  origin: env.frontendUrl, 
  credentials: true
}));
app.use(globalLimiter);
app.use(express.json());

require('./scheduler/winnerScheduler.js')

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))
app.use('/user',userRouter);
app.use('/auth',authRouter);
app.use('/profile',profileRouter);
app.use('/degree',degreeRouter);
app.use('/employment',employmentRouter);
app.use('/certification',certificationRouter);
app.use('/liscence',liscenceRouter);
app.use('/course',courseRouter)
app.use('/bid',bidRouter)
app.use('/api',apiRouter)

app.use(ErrorMiddleware.handle);

app.listen(env.port,()=>{
  console.log(`Server running on http://localhost:${env.port}`);
})











