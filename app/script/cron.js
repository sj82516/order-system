const CronJob = require("cron").CronJob;
const model = require("../model")

const job = new CronJob('* */10 * * * *', async function() {
	await model.order.deleteRejectedOrder()
});

job.start();