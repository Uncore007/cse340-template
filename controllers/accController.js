const utilities = require("../utilities/")

const accCont = {}

accCont.buildLogin = async function (req, res, next) { 
    const grid = await utilities.buildLoginGrid()
    let nav = await utilities.getNav()
    res.render("./account/login", {
        title: "Login",
        nav,
        grid,
    })
}

// Add this function for the root route
accCont.buildAccount = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/account", {
        title: "Account Management",
        nav,
    })
}

accCont.buildRegister = async function (req, res, next) {
    const grid = await utilities.buildRegisterGrid()
    let nav = await utilities.getNav()
    res.render("./account/register", {
        title: "Register",
        nav,
        grid,
    })
}

// Fix: Export the accCont object directly
module.exports = accCont