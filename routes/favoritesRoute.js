const express = require("express")
const router = new express.Router()
const favController = require("../controllers/favController")
const utilities = require("../utilities/")

// All routes require login
router.get("/", 
  utilities.checkLogin, 
  utilities.handleErrors(favController.buildFavorites))

router.post("/add", 
  utilities.checkLogin, 
  utilities.handleErrors(favController.addFavorite))

router.post("/remove", 
  utilities.checkLogin, 
  utilities.handleErrors(favController.removeFavorite))

module.exports = router