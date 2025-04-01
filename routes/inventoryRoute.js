const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

// Route to build inventory management view
router.get("/", invController.buildManagement);

// Route to build inventory by id view
router.get("/detail/:inventoryId", invController.buildInventoryId);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build add classification view
router.get("/add-classification", invController.buildAddClassification);
// Route to process add classification form
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  invController.addClassification
);

// Route to build add inventory view
router.get("/add-inventory", invController.buildAddInventory);
// Route to process add inventory form
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  invController.addInventory
);

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit inventory view
router.get("/edit/:inventoryId", utilities.handleErrors(invController.editInventoryView));

// Route to process the inventory update
router.post("/update/", 
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.updateInventory)
);

module.exports = router;