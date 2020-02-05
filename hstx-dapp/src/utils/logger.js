'user strict';

const log4js = require('log4js')
global.logger = log4js.getLogger(process.env.APP_NAME || 'akc-hstx-dapp')
logger.level = 'debug'

var getLogger = function(moduleName) {
	var logger = log4js.getLogger(moduleName);
	logger.level = 'debug'
	return logger;
};

exports.getLogger = getLogger;