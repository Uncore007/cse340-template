const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accController")
const utilities = require("../utilities/")

router.get("/", accController.buildAccount)
router.get("/login", accController.buildLogin)
router.get("/register", accController.buildRegister)

router.post('/register', utilities.handleErrors(accController.registerAccount))

module.exports = router;