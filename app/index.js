// entrypoint for execution
const CronJob = require('cron').CronJob
const handler = require('./lib/handler')

module.exports.handler = handler

// remove quotes around cron schedule
const cronSchedule = process.env.CRON_SCHEDULE.replace(/["']+/g, '')

console.log('Starting backup service on cron schedule: ' + cronSchedule)

const job = new CronJob(cronSchedule, () => {
    console.log('Running cron task at ' + new Date())
    // run the backup script
    handler(null, null, () => {})
}, null, true, 'America/Los_Angeles')

process.on('SIGINT', () => {
    job.stop()
    process.exit(0)
})

// run without event or context for execution outside of lambda environment
// handler(null,null,function(){})
