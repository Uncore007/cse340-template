const favModel = require("../models/favorites-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

/* ****************************************
 *  Display Favorites Page
 * *************************************** */
async function buildFavorites(req, res) {
  const account_id = res.locals.accountData.account_id
  let nav = await utilities.getNav()
  
  const favorites = await favModel.getFavoritesByAccount(account_id)
  
  let grid
  if (favorites.length > 0) {
    grid = await utilities.buildClassificationGrid(favorites)
  } else {
    grid = '<p class="notice">You have no favorite vehicles.</p>'
  }
  
  res.render("./account/favorites", {
    title: "My Favorites",
    nav,
    grid,
    errors: null,
  })
}

/* ****************************************
 *  Process Add Favorite
 * *************************************** */
async function addFavorite(req, res) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id
  
  // Check if already favorited
  const existingFavorite = await favModel.checkFavorite(account_id, inv_id)
  if (existingFavorite) {
    req.flash("notice", "This vehicle is already in your favorites.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }
  
  const result = await favModel.addFavorite(account_id, inv_id)
  
  if (result) {
    req.flash("notice", "Vehicle added to favorites.")
  } else {
    req.flash("notice", "Error adding vehicle to favorites.")
  }
  
  return res.redirect(`/inv/detail/${inv_id}`)
}

/* ****************************************
 *  Process Remove Favorite
 * *************************************** */
async function removeFavorite(req, res) {
  const { favorite_id } = req.body
  const account_id = res.locals.accountData.account_id
  
  const result = await favModel.removeFavorite(favorite_id, account_id)
  
  if (result > 0) {
    req.flash("notice", "Vehicle removed from favorites.")
  } else {
    req.flash("notice", "Error removing vehicle from favorites.")
  }
  
  return res.redirect("/account/favorites")
}

module.exports = {
  buildFavorites,
  addFavorite,
  removeFavorite
}