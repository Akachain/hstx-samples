'use strict'

const akcSDK = require('@akachain/akc-node-sdk');
var logger = require('./logger').getLogger('invoke-chaincode');

// Define functions' name
const CREATE_SUPER_ADMIN = "CreateSuperAdmin",
  CREATE_ADMIN = "CreateAdmin",
  CREATE_PROPOSAL = "CreateProposal",
  CREATE_APPROVAL = "CreateApproval",
  CREATE_QUORUM = "CreateQuorum",
  CREATE_REJECT = "CreateReject",
  CREATE_COMMIT = "CreateCommit",
  GET_ALL_SUPER_ADMIN = "GetAllSuperAdmin",
  GET_ALL_ADMIN = "GetAllAdmin",
  GET_ALL_PROPOSAL = "GetAllProposal",
  GET_ALL_APPROVAL = "GetAllApproval",
  GET_ALL_QUORUM = "GetAllQuorum",
  GET_ALL_COMMIT = "GetAllCommit",
  GET_SUPER_ADMIN_BY_ID = "GetSuperAdminByID",
  GET_ADMIN_BY_ID = "GetAdminByID",
  GET_PROPOSAL_BY_ID = "GetProposalByID",
  GET_APPROVAL_BY_ID = "GetApprovalByID",
  GET_QUORUM_BY_ID = "GetQuorumByID",
  GET_QUORUM_BY_PROPOSAL_ID = "GetQuorumByProposalID",
  GET_COMMIT_BY_ID = "GetCommitByID",
  UPDATE_SUPER_ADMIN = "UpdateSuperAdmin",
  UPDATE_ADMIN = "UpdateAdmin",
  UPDATE_PROPOSAL = "UpdateProposal",
  UPDATE_APPROVAL = "UpdateApproval",
  UPDATE_QUORUM = "UpdateQuorum",
  UPDATE_REJECT = "UpdateReject",
  UPDATE_COMMIT = "UpdateCommit",
  GET_PENDING_PROPOSAL_BY_SUPER_ADMIN_ID = "GetPendingProposalBySuperAdminID",
  COMMIT_PROPOSAL = "CommitProposal";

// Declare common parameters
let _peerNames = '',
  _channelName = '',
  _chaincodeName = '',
  _orgName = '',
  _userName = '';

/**
 * To invoke and create data via chaincode (admin, proposal, quorum, commit)
 * @param {string} funcName function name on chaincode
 * @param {Array} args array of args pass into function on chaincode
 */
async function _createObject(funcName, args) {
  // logger.debug(args)
  return await akcSDK.invoke(_peerNames, _channelName, _chaincodeName, funcName, args, _orgName, _userName);
}

/**ß
 * To get query record from network via chaincode (admin, proposal, quorum, commit)
 * @param {string} funcName function name on chaincode
 * @param {Array} args array of args pass into function on chaincode
 */
async function _getObject(funcName, args) {
  // logger.debug(args)
  return await akcSDK.query(_peerNames, _channelName, _chaincodeName, funcName, args, _orgName, _userName);
}

/**
 * A class contains functions to create and query proposals that make high secure transaction
 * @param {*} peerNames 
 * @param {*} channelName 
 * @param {*} chaincodeName 
 * @param {*} orgName 
 * @param {*} userName 
 */
class HSTx {

  constructor(peerNames, channelName, chaincodeName, orgName, userName) {
    if (!peerNames || !channelName || !chaincodeName || !orgName || !userName) {
      throw new Error(`Argument functions 'peerNames, channelName, chaincodeName, orgName, userName' are required! \nGiven: ${peerNames} ${channelName} ${chaincodeName} ${orgName} ${userName}`)
    }
    _peerNames = peerNames;
    _channelName = channelName;
    _chaincodeName = chaincodeName;
    _orgName = orgName;
    _userName = userName;
  }

  /** SUPER ADMIN FUNCTIONS **************************************************/
  /**
   * To create a Admin who has permission to “Approve” HSTx
   * @param {JSONObject} superAdmin include {SuperAdminID, Name, PublicKey}
   */
  async createSuperAdmin(args) {
    return await _createObject(CREATE_SUPER_ADMIN, args)
  }

  /**
   * To update a SuperAdmin who has permission to “Approve” HSTx
   * @param {JSONObject} admin include {adminID, name, publickey}
   */
  async updateSuperAdmin(args) {
    return await _createObject(UPDATE_SUPER_ADMIN, args)
  }

  /**
   * To get all admin records
   */
  async getAllSuperAdmin() {
    return await _getObject(GET_ALL_SUPER_ADMIN, [])
  }

  /**
   * To get a admin records by ID
   * @param {string} id ID of Admin
   */
  async getSuperAdminByID(id) {
    let args = [id]
    return await _getObject(GET_SUPER_ADMIN_BY_ID, args)
  }

  /** ADMIN FUNCTIONS ********************************************************/
  /**
   * To create a Admin who has permission to “Approve” HSTx
   * @param {JSONObject} admin include {adminID, name, publickey}
   */
  async createAdmin(args) {
    return await _createObject(CREATE_ADMIN, args)
  }

  /**
   * To update a Admin who has permission to “Approve” HSTx
   * @param {JSONObject} admin include {adminID, name, publickey}
   */
  async updateAdmin(args) {
    return await _createObject(UPDATE_ADMIN, args)
  }

  /**
   * To get all admin records
   */
  async getAllAdmin() {
    return await _getObject(GET_ALL_ADMIN, [])
  }

  /**
   * To get a admin records by ID
   * @param {string} id ID of Admin
   */
  async getAdminByID(id) {
    let args = [id]
    return await _getObject(GET_ADMIN_BY_ID, args)
  }

  /** PROPOSAL FUNCTIONS *****************************************************/
  /**
   * To create a Proposal
   * 
   * @param {any} proposal 
   */
  async createProposal(args) {
    return await _createObject(CREATE_PROPOSAL, args)
  }

  /**
   * To update a Proposal who has permission to “Approve” HSTx
   * @param {JSONObject} admin include {adminID, name, publickey}
   */
  async updateProposal(args) {
    return await _createObject(UPDATE_PROPOSAL, args)
  }

  /**
   * To commitProposal a Proposal who has permission to “Approve” HSTx
   * @param {JSONObject} admin include {adminID, name, publickey}
   */
  async commitProposal(args) {
    return await _createObject(COMMIT_PROPOSAL, args)
  }

  /**
   * To get all proposal records
   */
  async getAllProposal() {
    return await _getObject(GET_ALL_PROPOSAL, [])
  }

  /**
   * To get a proposal records by ID
   * @param {string} id ID of Proposal
   */
  async getProposalByID(id) {
    let args = [id]
    return await _getObject(GET_PROPOSAL_BY_ID, args)
  }

  /**
   * To get a proposal records by ID
   * @param {string} id ID of Super Admin
   */
  async getPendingProposalBySuperAdminID(id) {
    let args = [id]
    return await _getObject(GET_PENDING_PROPOSAL_BY_SUPER_ADMIN_ID, args)
  }

  /** APPROVAL FUNCTIONS *******************************************************/
  /**
   * To create a Approval
   * 
   * @param {any} approval 
   */
  async createApproval(args) {
    return await _createObject(CREATE_APPROVAL, args)
  }

  /**
   * To update a Approval who has permission to “Approve” HSTx
   * @param {JSONObject} admin include {adminID, name, publickey}
   */
  async updateApproval(args) {
    return await _createObject(UPDATE_APPROVAL, args)
  }

  /**
   * To get all approval records
   */
  async getAllApproval() {
    return await _getObject(GET_ALL_APPROVAL, [])
  }

  /**
   * To get a approval records by ID
   * @param {string} id ID of Approval
   */
  async getApprovalByID(id) {
    let args = [id]
    return await _getObject(GET_APPROVAL_BY_ID, args)
  }
}

/**
 * Module exports.
 */
module.exports = HSTx