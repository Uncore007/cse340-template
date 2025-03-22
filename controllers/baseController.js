const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

baseController.triggerError = async function(req, res, next){
  try {
    throw new Error("Intentional 500 error triggered");
  } catch(error) {
    next(error);
  }
}

module.exports = baseController