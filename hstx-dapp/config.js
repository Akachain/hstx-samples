// Project: AKACHAIN
// Desc: 	Entry file of Web api server
// History: Create new 2019/05/01

var util = require('util');
var path = require('path');
var hfc = require('fabric-client');
require('dotenv').config()

// Set config for fabrice client
var file = 'network-config%s.yaml';
var env = process.env.TARGET_NETWORK;

if (env)
    file = util.format(file, '-' + env);
else
    file = util.format(file, '');

// Indicate to the application where the setup file is located so it able
// to have the hfc load it to initalize the fabric client instance
hfc.setConfigSetting('network-connection-profile-path', path.join(__dirname, 'artifacts', file));
hfc.setConfigSetting(`${process.env.ORG_NAME}-connection-profile-path`, path.join(__dirname, 'artifacts', `${process.env.ORG_NAME}.yaml`));

// Some other settings the application might need to know
hfc.addConfigFile(path.join(__dirname, 'config.json'));