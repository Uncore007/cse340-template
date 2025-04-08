const pool = require("../database/")

/* ***************************
 *  Add a favorite
 * ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = "INSERT INTO favorites (account_id, inv_id) VALUES ($1, $2) RETURNING *"
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("addFavorite error: " + error)
    return null
  }
}

/* ***************************
 *  Remove a favorite
 * ************************** */
async function removeFavorite(favorite_id, account_id) {
  try {
    const sql = "DELETE FROM favorites WHERE favorite_id = $1 AND account_id = $2 RETURNING *"
    const result = await pool.query(sql, [favorite_id, account_id])
    return result.rowCount
  } catch (error) {
    console.error("removeFavorite error: " + error)
    return 0
  }
}

/* ***************************
 *  Get all favorites for an account
 * ************************** */
async function getFavoritesByAccount(account_id) {
  try {
    const sql = `
      SELECT f.favorite_id, f.date_added, i.*, c.classification_name
      FROM favorites f
      JOIN inventory i ON f.inv_id = i.inv_id
      JOIN classification c ON i.classification_id = c.classification_id
      WHERE f.account_id = $1
      ORDER BY f.date_added DESC
    `
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("getFavoritesByAccount error: " + error)
    return []
  }
}

/* ***************************
 *  Check if a vehicle is already a favorite
 * ************************** */
async function checkFavorite(account_id, inv_id) {
  try {
    const sql = "SELECT * FROM favorites WHERE account_id = $1 AND inv_id = $2"
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount > 0 ? result.rows[0] : null
  } catch (error) {
    console.error("checkFavorite error: " + error)
    return null
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesByAccount,
  checkFavorite
}