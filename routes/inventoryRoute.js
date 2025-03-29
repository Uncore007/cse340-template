const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

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

module.exports = router;