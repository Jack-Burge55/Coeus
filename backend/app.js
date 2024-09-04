require('dotenv').config({ path: '../.env' })
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
const loginRouter = require("./routes/login")
const registerRouter = require("./routes/register")
const deleteRouter = require("./routes/delete")
const usersRouter = require("./routes/users")

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
// app.use("/api/v1/auth", loginRouter, registerRouter)
app.use("/api/v1/auth/login", loginRouter)
app.use("/api/v1/auth/register", registerRouter)
app.use("/api/v1/auth/delete", deleteRouter)
app.use("/api/v1/users", usersRouter)

app.use(notFoundMiddleware)
//app.use(errorHandlerMiddleware)

const port = process.env.PORT_NUMBER || 1000

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