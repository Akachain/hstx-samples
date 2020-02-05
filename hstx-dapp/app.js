// Project: AKACHAIN
// Desc: 	Entry file of Web api server

'use strict';

/**
 * Import libraries
 */
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var cors = require('cors');
var hfc = require('fabric-client');

/**
 * Import files
 */
require('dotenv').config()
require('./src/utils/logger')
require('./config.js');

// Import routers
var HstxRouter = require('./src/router/hstxRouter');

/**
 * A class to initialize and config an instance to run a server of D-app
 */
class Application {

	constructor() {
		this.app = express();
		this._init()
		this._readConfig()
		this._setRouters()
	}

	/**
	 * To initialize application
	 */
	_init() {
		// Allow cors
		this.app.options('*', cors());
		this.app.use(cors());

		// Support parsing of application/json type post data
		this.app.use(bodyParser.json());
		// Support parsing of application/x-www-form-urlencoded post data
		this.app.use(bodyParser.urlencoded({
			extended: false
		}));
	}

	/**
	 * To read configuration from file config.js
	 */
	_readConfig() {
		// Read config
		this.host = process.env.HOST || hfc.getConfigSetting('host');
		this.port = process.env.PORT || hfc.getConfigSetting('port');
	}

	/**
	 * Set routes for api 
	 */
	async _setRouters() {
		let hstxRouter = await new HstxRouter()
		this.app.use('/api/v1', hstxRouter.router);
	}

	/**
	 * Start server and listen on $host:$port
	 */
	startServer() {
		this.server = http.Server(this.app);
		this.server.listen(this.port);
		logger.info('****************** SERVER STARTED ************************');
		logger.info('***************  http://%s:%s  ******************', this.host, this.port);
		this.server.timeout = 240000;
	}
}

/**
 * Main function
 */
async function main() {
	await new Application().startServer()
}

main()