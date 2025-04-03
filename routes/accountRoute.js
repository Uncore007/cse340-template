const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

router.get("/", 
    utilities.checkLogin, 
    utilities.handleErrors(accController.buildAccount))

router.get("/login", accController.buildLogin)
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accController.accountLogin)
    )

router.get("/register", accController.buildRegister)
router.post('/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount))

module.exports = router;