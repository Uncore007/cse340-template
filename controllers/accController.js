const accModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")

const accCont = {}

async function buildLogin(req, res, next) { 
    let nav = await utilities.getNav()
    res.render("./account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

// Add this function for the root route
async function buildAccount(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/account", {
        title: "Account Management",
        nav,
        errors: null,
    })
}

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res, next) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
    
    const regResult = await accModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }

async function loginAccount(req, res, next) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body

    req.flash("notice", "Login functionality will be implemented soon.")
    
    res.status(200).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
}

module.exports = { buildAccount, buildLogin, buildRegister, registerAccount, loginAccount }