const cron = require("node-cron")
const model = require("../model")

cron.schedule("* */10 * * * *", async function () {
	await model.order.deleteRejectedOrder()
})