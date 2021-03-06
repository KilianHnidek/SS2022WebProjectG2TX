const { Router } = require("express");
const controller = require("../controllers/wheelchair-controller");

const router = Router();

router.get("/categories", controller.getCategories);
router.get("/categories/:category/wheelchairs", controller.getCategoryWheelchairs);
router.get("/wheelchairs", controller.getAllWheelchairs);
router.get("/wheelchairs/:id", controller.getWheelchair);

router.post("/categories/:category/wheelchairs", controller.createWheelchair);
router.put("/wheelchairs/:id", controller.updateWheelchair);
router.post("/wheelchairs/:id/buy", controller.buyWheelchair);
router.delete("/wheelchairs/:id", controller.deleteWheelchair);

module.exports = router;