require("dotenv").config({path: '../.env'})
require("express-async-errors")

const express = require("express")
const app = express()

// connectDB
const connectDB = require("./db/connect")
const authenticateUser = require("./middleware/auth")
const cors = require("cors")
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200
}

// routers
const usersRouter = require("./routes/users")
const videosRouter = require("./routes/videos")
const authRouter = require("./routes/auth")

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require("./middleware/error-handler")

app.use(cors(corsOptions))
// static assets
app.use(express.static("./public"))
// parse form data
app.use(express.urlencoded({extended: false}))
// parse json
app.use(express.json())


// routes
app.use("/api/v1/users", authenticateUser, usersRouter)
app.use("/api/v1/videos", authenticateUser, videosRouter)
app.use("/api/v1/auth", authRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT_NUMBER || 1000

const start = async () => {
    try {
      if (process.env.NODE_ENV !== 'test') {
        await connectDB(process.env.MONGO_URI) 
        app.listen(port);
      }
      else {
        await connectDB(process.env.MONGO_TEST_URI) 
      }
    } catch (error) {
      console.log(error);
    }
  };
  
start()

module.exports = app