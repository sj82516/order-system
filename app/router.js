const Router = require("express").Router;
const router = Router();

const controller = require("./controller")

const reservation = Router()
reservation
    .get("/:urlCode", controller.reservation.get)
    .post("/", controller.reservation.insert)
    .put("/:urlCode", controller.reservation.update)

router.use("/reservation", reservation)
router.use("*", function(){
    throw new Error("NO_URL")
})
module.exports = router