const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

// Public routes - no login required
// Route to build inventory by id view
router.get("/detail/:inventoryId", invController.buildInventoryId);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// JSON route for JavaScript
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Protected routes - require Admin or Employee account type
// Route to build inventory management view
router.get("/", utilities.checkAuthorization, invController.buildManagement);

// Route to build add classification view
router.get("/add-classification", utilities.checkAuthorization, invController.buildAddClassification);
// Route to process add classification form
router.post(
  "/add-classification",
  utilities.checkAuthorization,
  invValidate.classificationRules(),
  invValidate.checkClassData,
  invController.addClassification
);

// Route to build add inventory view
router.get("/add-inventory", utilities.checkAuthorization, invController.buildAddInventory);
// Route to process add inventory form
router.post(
  "/add-inventory",
  utilities.checkAuthorization,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  invController.addInventory
);

// Route to build edit inventory view
router.get("/edit/:inventoryId", utilities.checkAuthorization, utilities.handleErrors(invController.editInventoryView));
// Route to process the inventory update
router.post("/update/", 
  utilities.checkAuthorization,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.updateInventory)
);

router.get("/delete/:inventoryId", utilities.checkAuthorization, utilities.handleErrors(invController.deleteInventoryView));
router.post("/delete", utilities.checkAuthorization, utilities.handleErrors(invController.deleteInventory));

module.exports = router;