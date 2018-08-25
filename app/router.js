const Router = require("express").Router;
const router = Router();

const ip = require("./helper/middleware/ip")

const controller = require("./controller")

const order = Router()
order
    .get("/", controller.order.getOrderList)
    .get("/dashboard/status", controller.order.getOrderStatusDashboard)
    .get("/:id", controller.order.getOrder)
    .post("/", ip, controller.order.insertOrder)
    .put("/:id", controller.order.updateOrder)

router.use("/order", order)
router.use("*", function(){
    throw new Error("NO_URL")
})
module.exports = router