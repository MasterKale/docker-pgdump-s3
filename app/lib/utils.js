const moment = require('moment')
const path = require('path')

module.exports = {
    generateBackupPath(databaseName, rootPath, now = null) {
        now = now || moment()
        const timestamp = moment(now).format('DD-MM-YYYY@HH-mm-ss')
        const day = moment(now).format('YYYY-MM-DD')

        const extension = process.env.BACKUP_EXTENSION || 'backup'

        const filename = `${databaseName}-${timestamp}.${extension}`
        const key = path.join(rootPath || '', day, filename)
        return key
    }
}
