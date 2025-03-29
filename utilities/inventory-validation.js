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

module.exports = invValidate