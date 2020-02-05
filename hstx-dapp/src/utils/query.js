'user strict';

var util = require('util');
var helper = require('./helper')
var logger = require('./logger').getLogger('query-chaincode');

const channelName = process.env.CHANNEL_NAME
const orgname = process.env.ORG_NAME
const username = process.env.ORG_USER
const peerNames = [process.env.PEER]
const chaincodeName = process.env.CHAINCODE

var queryChaincode = (fcn, args) => new Promise(async (resolve, reject) => {
  try {
    logger.info("\nQuerying...")
    // first setup the client for this org
    var client = await helper.getClientForOrg(orgname, username);
    logger.info('Successfully got the fabric client for the organization "%s"', orgname);
    var channel = client.getChannel(channelName);
    if (!channel) {
      let message = util.format('Channel %s was not defined in the connection profile', channelName);
      logger.error(message);
      throw new Error(message);
    }

    // send query
    var request = {
      targets: peerNames, //queryByChaincode allows for multiple targets
      chaincodeId: chaincodeName,
      fcn: fcn,
      args: args
    };

    let response_payloads = await channel.queryByChaincode(request);
    if (response_payloads) {
      for (let i = 0; i < response_payloads.length; i++) {
        if (response_payloads[i] instanceof Error) {
          logger.error(response_payloads[i].message);
        } else {
            logger.debug(response_payloads[i].toString('utf8'));
            resolve(response_payloads[i].toString('utf8'));
        }
      }
      reject('Can not get any good response!\nCheck logs: query-chaincode for more details.')
    } else {
      logger.error('response_payloads is null');
      reject('response_payloads is null')
    }
  } catch (error) {
    logger.error('Failed to query due to error: ' + error.stack ? error.stack : error);
    reject(error)
  }
});

exports.queryChaincode = queryChaincode;