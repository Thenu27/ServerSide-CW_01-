const express = require('express');
const { authRouter } = require('./routes/authRoute');
const { userRouter } = require('./routes/userRoutes.js');
const { profileRouter } = require('./routes/profileRoute.js')
const { ErrorMiddleware } = require('./middleware/errorMiddleware.js');
const { env } = require('./config/env.js');
const { degreeRouter } = require('./routes/degreeRoute.js');
const { employmentRouter } = require('./routes/employmentRoute.js');
const { certificationRouter } = require('./routes/certificationRoute.js');
const { liscenceRouter } = require('./routes/liscenceRoute.js');
const { courseRouter } = require('./routes/courseRoute.js');
const { bidRouter } = require('./routes/bidRoute.js');
const { apiRouter } = require("./routes/apiRoute.js");
const swaggerUi = require('swagger-ui-express')
const { swaggerSpec } = require('./config/swagger.js')
const { rateLimit } = require("express-rate-limit");
const cookieParser = require('cookie-parser');
const helmet = require("helmet");

const cors = require('cors');
const { analyticsRoute } = require('./routes/analyticsRoute.js');
const insightsRouter = require('./routes/insightsRoute.js');

// Global rate limiter to prevent abuse
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000,              // Max requests per window
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests, please try again later."
  }
});

const app = express()

// Security middleware
app.use(helmet());

// Enable CORS for frontend
app.use(cors({
  origin: env.frontendUrl,
  credentials: true
}));

// Apply rate limiting
app.use(globalLimiter);

// Parse cookies
app.use(cookieParser());

// Parse JSON body
app.use(express.json());

// Start scheduled jobs 
require('./scheduler/winnerScheduler.js')

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/degree', degreeRouter);
app.use('/employment', employmentRouter);
app.use('/certification', certificationRouter);
app.use('/liscence', liscenceRouter);
app.use('/course', courseRouter);
app.use('/bid', bidRouter);
app.use('/api', apiRouter);

// Analytics & insights routes
app.use('/analytics', analyticsRoute)
app.use('/key-insights', insightsRouter)

// Global error handler 
app.use(ErrorMiddleware.handle);

// Start server
app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
})