const { body, validationResult } = require("express-validator")
const utilities = require(".")
const invValidate = {}

// Validation rules for adding classification
invValidate.classificationRules = () => {
    return [
        // classification name is required and must contain only alphanumeric characters
        body("classification_name")
            .trim()
            .isAlphanumeric()
            .withMessage("Classification name cannot contain spaces or special characters.")
            .isLength({ min: 1 })
            .withMessage("Please provide a classification name."),
    ]
}

// Validation rules for adding inventory
invValidate.inventoryRules = () => {
  return [
    // make is required
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the vehicle make."),
    
    // model is required
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the vehicle model."),
    
    // year must be a 4-digit year
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide a 4-digit year.")
      .matches(/^\d{4}$/)
      .withMessage("Year must be a 4-digit number."),
    
    // description is required
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle description."),
    
    // image path is required
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an image path."),
    
    // thumbnail path is required
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail path."),
    
    // price is required and must be a number
    body("inv_price")
      .trim()
      .isNumeric()
      .withMessage("Price must be a number."),
    
    // miles is required and must be a number
    body("inv_miles")
      .trim()
      .isInt()
      .withMessage("Mileage must be a whole number."),
    
    // color is required
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."),
    
    // classification is required
    body("classification_id")
      .isLength({ min: 1 })
      .withMessage("Please select a classification."),
  ]
}

// Check data and return errors or continue to adding classification
invValidate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

invValidate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

/* ***************************
 *  Check data and return errors or continue to update inventory
 * ************************** */
invValidate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}

module.exports = invValidate