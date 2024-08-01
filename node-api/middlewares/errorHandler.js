const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack)
    response.status(err.statusCode || 500).json({ message: err.message });
}

module.exports = errorHandler;