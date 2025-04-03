const accModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  res.locals.loggedin = 0
  req.flash("notice", "You've been logged out.")
  return res.redirect("/")
}

/* ****************************************
 *  Build account update view
 * *************************************** */
async function buildAccountUpdate(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  
  // Make sure logged in user is only accessing their own account
  if (account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You don't have permission to update this account")
    return res.redirect("/account/")
  }
  
  let nav = await utilities.getNav()
  const accountData = await accModel.getAccountById(account_id)
  
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

/* ****************************************
 *  Process account update
 * *************************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { 
    account_id,
    account_firstname, 
    account_lastname, 
    account_email
  } = req.body
  
  // Make sure logged in user is only updating their own account
  if (parseInt(account_id) !== res.locals.accountData.account_id) {
    req.flash("notice", "You don't have permission to update this account")
    return res.redirect("/account/")
  }
  
  const updateResult = await accModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )
  
  if (updateResult) {
    // Update the JWT with the new data
    const updatedAccountData = await accModel.getAccountById(account_id)
    delete updatedAccountData.account_password
    const accessToken = jwt.sign(updatedAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    
    if(process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    
    req.flash("notice", "Account information updated successfully")
    return res.redirect("/account/")
  } else {
    req.flash("notice", "Failed to update account information")
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
 *  Process password update
 * *************************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  
  // Make sure logged in user is only updating their own account
  if (parseInt(account_id) !== res.locals.accountData.account_id) {
    req.flash("notice", "You don't have permission to update this account")
    return res.redirect("/account/")
  }
  
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.')
    const accountData = await accModel.getAccountById(account_id)
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id
    })
    return
  }
  
  const updateResult = await accModel.updatePassword(account_id, hashedPassword)
  
  if (updateResult) {
    req.flash("notice", "Password updated successfully")
    return res.redirect("/account/")
  } else {
    req.flash("notice", "Failed to update password")
    const accountData = await accModel.getAccountById(account_id)
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id,
    })
  }
}

module.exports = { 
  buildAccount, 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  accountLogout,
  buildAccountUpdate,
  updateAccount,
  updatePassword
}