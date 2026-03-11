const express = require('express');
const {authRouter} = require('./routes/authRoute');
const {userRouter} = require('./routes/userRoutes.js');
const {profileRouter} = require('./routes/profileRoute.js')
const {ErrorMiddleware} = require('./middleware/errorMiddleware.js');
const {env} = require('./config/env.js');

const app = express()
app.use(express.json());

app.use('/user',userRouter);
app.use('/auth',authRouter);
app.use('/profile',profileRouter)

app.use(ErrorMiddleware.handle)

app.listen(env.port,()=>{
  console.log(`Server running on http://localhost:${env.port}`);
})