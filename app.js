require("dotenv").config()
require("express-async-errors")

const express = require("express")
const app = express()

// connectDB
const connectDB = require("./db/connect")
const authenticateUser = require("./middleware/auth")

// routers
const loginRouter = require("./routes/login")
const registerRouter = require("./routes/register")

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require("./middleware/error-handler")

// static assets
app.use(express.static("./public"))
// parse form data
app.use(express.urlencoded({extended: false}))
// parse json
app.use(express.json())


// routes
// app.use("/api/v1/auth", loginRouter, registerRouter)
app.use("/api/v1/auth/login", loginRouter)
app.use("/api/v1/auth/register", registerRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = 3000

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI) 
      app.listen(port, console.log(`Server is listening on port ${port}`));
    } catch (error) {
      console.log(error);
    }
  };
  
start()

module.exports = app