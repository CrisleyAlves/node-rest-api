const express = require("express");
const router = express.Router();
const checkAuth = require("../jwt/check-auth");
const orderController = require("../controllers/order");

router.post("/", checkAuth, orderController.insert);
router.get("/", checkAuth, orderController.getAll);
router.get("/:orderId", checkAuth, orderController.getById);
router.delete("/:orderId", checkAuth, orderController.delete);

module.exports = router;