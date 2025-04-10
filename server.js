/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const favoritesRoute = require("./routes/favoritesRoute")
const utilities = require("./utilities")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cookieParser())

app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index Route
// app.get("/", (req, res) => {
//   res.render("index", { title: "Home" })
// })
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory Routes
app.use("/inv", utilities.handleErrors(inventoryRoute))

// Inventory Routes
app.use("/account", utilities.handleErrors(accountRoute))

app.use("/account/favorites", utilities.handleErrors(favoritesRoute))

app.get("/trigger-error", utilities.handleErrors(baseController.triggerError))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  // next({status: 404, message: 'Sorry, we appear to have lost that page.'})

  let nav = await utilities.getNav()
  let message;

    message = `<div class="error"><p>404 Cannot find page</p>
               <p>Our team has been notified and is working to resolve the issue.</p></div>`;
  
  res.render("errors/error", {
    title: "404 Error",
    message,
    nav
  })
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message;

  message = `<div class="error"><p>We apologize for the inconvenience. Our system encountered an unexpected error.</p>
              <p>Our team has been notified and is working to resolve the issue.</p></div>`;
  // if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
