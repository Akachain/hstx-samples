const express = require('express');
const HSTx = require('@akachain/hstx-node-sdk');

const u2f = require('../utils/u2f/index')

/**
 * A class to initialize router instance
 */
class Router {

  constructor() {
    try {
      this.router = express.Router();
      this.hstx = new HSTx(process.env.PEER, process.env.CHANNEL_NAME, process.env.CHAINCODE, process.env.ORG_NAME, process.env.USER_NAME);
      this._setRoutes()
    } catch (err) {
      logger.error(err.message)
    }
  }

  /**
   * Check validation of secret key in header of request
   * @param {Request} req request from client
   * @param {Response} res request to client
   */
  _checkSecretKey(req, res) {
    if (req.headers['secretkey'] != process.env.SECRETKEY) {
      logger.error('Secretkey is invalid!')
      res.send({
        status: 500,
        message: 'Secretkey is invalid!'
      });
      return false
    }
    return true
  }

  /**
   * Set routes for API
   */
  async _setRoutes() {
    this.createSuperAdmin()
    this.updateSuperAdmin()
    this.getAllSuperAdmin()
    this.getSuperAdminByID()

    this.createAdmin()
    this.updateAdmin()
    this.getAllAdmin()
    this.getAdminByID()

    this.createProposal()
    this.updateProposal()
    this.getAllProposal()
    this.getProposalByID()
    this.getPendingProposalBySuperAdminID()
    this.commitProposal()

    this.createApproval()
    this.updateApproval()
    this.getAllApproval()
    this.getApprovalByID()
  }

  /**
   * Invoke to chaincode via functions of HSTx-SDK instance
   * @param {Request} req request from client
   * @param {Response} res response to client
   * @param {string} funcName name of HSTx's function
   * @param {function} hstxFunc HSTx's function used to invoke to chaincode
   */
  async _invoke(req, res, funcName, hstxFunc, args) {
    if (!this._checkSecretKey(req, res)) return
    logger.info(`==================== INVOKE ON CHAINCODE TO ${funcName.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()} ==================`);

    try {
      // Invoke to chaincode by 'func'
      let payload = await hstxFunc(args)

      if (payload.Result.Status == 200) {
        // Response success to client
        res.send({
          status: 200,
          payload: payload
        });
      } else {
        throw new Error(payload.Message)
      }
    } catch (err) {
      logger.error(err.message)
      // Response error to client
      res.send({
        status: 500,
        message: 'Calling failed!',
        err: err.message
      });
    }
  }

  /**
   * Query to chaincode via functions of HSTx-SDK instance
   * @param {Request} req request from client
   * @param {Response} res response to client
   * @param {string} funcName name of HSTx's function
   * @param {function} hstxFunc HSTx's function used to query to chaincode
   */
  async _query(req, res, funcName, hstxFunc, args) {
    if (!this._checkSecretKey(req, res)) return

    logger.info(`==================== QUERY ON CHAINCODE TO ${funcName.toUpperCase()} ==================`);
    try {
      // Query to chaincode by 'hstxFunc'
      let result = await hstxFunc(args)
      let obj
      try {
        obj = JSON.parse(result);
      } catch (err) {
        throw new Error(result)
      }

      // Response success to client
      res.send({
        status: 200,
        payload: obj
      });
    } catch (err) {
      logger.error(err)
      // Response error to client
      res.send({
        status: 500,
        message: 'Calling failed',
        err: err.message
      });
    }
  }

  /** SUPER ADMIN FUNCTIONS **************************************************/
  /**
   * Set route /CreateSuperAdmin
   */
  createSuperAdmin() {
    this.router.post('/CreateSuperAdmin', async (req, res) => {
      let registrationData = req.body.registrationData

      // Parse registrationData.
      var buf = new Buffer(registrationData, 'base64');
      buf[0];
      buf = buf.slice(1);
      var publicKey = buf.slice(0, 65);
      buf = buf.slice(65);
      var keyHandleLen = buf[0];
      buf = buf.slice(1);
      var keyHandle = buf.slice(0, keyHandleLen);
      buf = buf.slice(keyHandleLen);
      var certLen = u2f.asnLen(buf);
      buf.slice(0, certLen);
      buf = buf.slice(certLen);
      var signLen = u2f.asnLen(buf);
      buf.slice(0, signLen);
      buf = buf.slice(signLen);
      if (buf.length !== 0)
        console.error("U2F Registration Warning: registrationData has extra bytes: " + buf.toString('hex'));

      // SEND
      let superAdmin = {
        SuperAdminID: u2f.toWebsafeBase64(keyHandle),
        Name: req.body.Name,
        PublicKey: u2f.convertCertToPEM(publicKey)
      }
      let args = []
      args.push(JSON.stringify(superAdmin))
      logger.debug(args)

      this._invoke(req, res, "CreateSuperAdmin", this.hstx.createSuperAdmin, args)
    });
  }

  /**
   * Set route /UpdateSuperAdmin
   */
  updateSuperAdmin() {
    this.router.post('/UpdateSuperAdmin', async (req, res) => {
      let superAdmin = {
        SuperAdminID: req.body.SuperAdminID,
        Name: req.body.Name,
        PublicKey: req.body.PublicKey,
        Status: req.body.Status
      }
      let args = []
      args.push(JSON.stringify(superAdmin))
      logger.debug(args)

      this._invoke(req, res, "UpdateSuperAdmin", this.hstx.updateSuperAdmin, args)
    });
  }

  /**
   * Set route /GetAllSuperAdmin
   */
  getAllSuperAdmin() {
    this.router.get('/GetAllSuperAdmin', async (req, res) => {
      this._query(req, res, "GetAllSuperAdmin", this.hstx.getAllSuperAdmin, null)
    });
  }

  /**
   * Set route /GetSuperAdminByID/:id
   */
  getSuperAdminByID() {
    this.router.get('/GetSuperAdminByID/:id', async (req, res) => {
      logger.debug(req.params.id)
      this._query(req, res, "GetSuperAdminByID", this.hstx.getSuperAdminByID, req.params.id)
    });
  }

  /** ADMIN FUNCTIONS **************************************************/
  /**
   * Set route /CreateAdmin
   */
  createAdmin() {
    this.router.post('/CreateAdmin', async (req, res) => {
      let admin = {
        Name: req.body.Name,
      }
      let args = []
      args.push(JSON.stringify(admin))
      logger.debug(args)

      this._invoke(req, res, "CreateAdmin", this.hstx.createAdmin, args)
    });
  }

  /**
   * Set route /UpdateAdmin
   */
  updateAdmin() {
    this.router.post('/UpdateAdmin', async (req, res) => {
      let admin = {
        AdminID: req.body.AdminID,
        Name: req.body.Name,
        Status: req.body.Status
      }
      let args = []
      args.push(JSON.stringify(admin))
      logger.debug(args)

      this._invoke(req, res, "UpdateAdmin", this.hstx.updateAdmin, args)
    });
  }

  /**
   * Set route /GetAllAdmin
   */
  getAllAdmin() {
    this.router.get('/GetAllAdmin', async (req, res) => {
      this._query(req, res, "GetAllAdmin", this.hstx.getAllAdmin, null)
    });
  }

  /**
   * Set route /GetAdminByID/:id
   */
  getAdminByID() {
    this.router.get('/GetAdminByID/:id', async (req, res) => {
      logger.debug(req.params.id)
      this._query(req, res, "GetAdminByID", this.hstx.getAdminByID, req.params.id)
    });
  }

  /** PROPOSAL FUNCTIONS **************************************************/
  /**
   * Set route /CreateProposal
   */
  createProposal() {
    this.router.post('/CreateProposal', async (req, res) => {
      let proposal = {
        Message: req.body.Message,
        CreatedBy: req.body.CreatedBy,
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      }
      let args = []
      args.push(JSON.stringify(proposal))
      logger.debug(args)
      logger.debug(proposal)

      this._invoke(req, res, "CreateProposal", this.hstx.createProposal, args)
    });
  }

  /**
   * Set route /UpdateProposal
   */
  updateProposal() {
    this.router.post('/UpdateProposal', async (req, res) => {
      let proposal = {
        ProposalID: req.body.ProposalID,
        Message: req.body.Message,
        CreatedBy: req.body.CreatedBy,
        Status: req.body.Status,
        UpdatedAt: new Date()
      }
      let args = []
      args.push(JSON.stringify(proposal))
      logger.debug(args)

      this._invoke(req, res, "UpdateProposal", this.hstx.updateProposal, args)
    });
  }

  /**
   * Set route /CommitProposal
   */
  commitProposal() {
    this.router.post('/CommitProposal', async (req, res) => {
      let proposal = {
        ProposalID: req.body.ProposalID,
        UpdatedAt: new Date()
      }
      let args = []
      args.push(JSON.stringify(proposal))
      logger.debug(args)

      this._invoke(req, res, "CommitProposal", this.hstx.commitProposal, args)
    });
  }

  /**
   * Set route /GetAllProposal
   */
  getAllProposal() {
    this.router.get('/GetAllProposal', async (req, res) => {
      this._query(req, res, "GetAllProposal", this.hstx.getAllProposal, null)
    });
  }

  /**
   * Set route /GetProposalByID/:id
   */
  getProposalByID() {
    this.router.get('/GetProposalByID/:id', async (req, res) => {
      logger.debug(req.params.id)
      this._query(req, res, "GetProposalByID", this.hstx.getProposalByID, req.params.id)
    });
  }

  /**
   * Set route /GetPendingProposalBySuperAdminID/:id
   */
  getPendingProposalBySuperAdminID() {
    this.router.get('/GetPendingProposalBySuperAdminID/:id', async (req, res) => {
      logger.debug(req.params.id)
      this._query(req, res, "GetPendingProposalBySuperAdminID", this.hstx.getPendingProposalBySuperAdminID, req.params.id)
    });
  }

  /** APPROVAL FUNCTIONS **************************************************/
  /**
   * Set route /CreateApproval
   */
  createApproval() {
    this.router.post('/CreateApproval', async (req, res) => {
      let keyHandle = req.body.keyHandle
      let clientData = req.body.clientData
      let signatureData = req.body.signatureData
      let appId = "https://akc-sdk.akachain.io";

      clientData = new Buffer(clientData, 'base64');
      // Parse signatureData
      var buf = new Buffer(signatureData, 'base64');
      var userPresenceFlag = buf.slice(0, 1);
      buf = buf.slice(1);
      var counter = buf.slice(0, 4);
      buf = buf.slice(4);
      var signLen = u2f.asnLen(buf);
      var signature = buf.slice(0, signLen);
      buf = buf.slice(signLen);
      if (buf.length !== 0)
        console.error("U2F Authentication Warning: signatureData has extra bytes: " + buf.toString('hex'));

      var appIdHash = u2f.hash(appId);
      var clientDataHash = u2f.hash(clientData);

      var signatureBase = Buffer.concat([appIdHash, userPresenceFlag, counter, clientDataHash]);

      // SEND
      let approval = {
        ProposalID: req.body.ProposalID,
        ApproverID: keyHandle,
        Challenge: req.body.Challenge,
        Signature: signature.toString('base64'),
        Message: signatureBase.toString('base64'),
        Status: req.body.Status,
        CreatedAt: new Date()
      }
      let args = []
      args.push(JSON.stringify(approval))
      logger.debug(args)

      this._invoke(req, res, "CreateApproval", this.hstx.createApproval, args)
    });
  }

  /**
   * Set route /UpdateApproval
   */
  updateApproval() {
    this.router.post('/UpdateApproval', async (req, res) => {
      let approval = {
        ApprovalID: req.body.ApprovalID,
        ProposalID: req.body.ProposalID,
        ApproverID: req.body.ApproverID,
        Challenge: req.body.Challenge,
        Signature: req.body.Signature,
        Message: req.body.Message,
        CreatedAt: new Date()
      }
      let args = []
      args.push(JSON.stringify(approval))
      logger.debug(args)

      this._invoke(req, res, "UpdateApproval", this.hstx.updateApproval, args)
    });
  }

  /**
   * Set route /GetAllApproval
   */
  getAllApproval() {
    this.router.get('/GetAllApproval', async (req, res) => {
      this._query(req, res, "GetAllApproval", this.hstx.getAllApproval, null)
    });
  }

  /**
   * Set route /GetApprovalByID/:id
   */
  getApprovalByID() {
    this.router.get('/GetApprovalByID/:id', async (req, res) => {
      logger.debug(req.params.id)
      this._query(req, res, "GetApprovalByID", this.hstx.getApprovalByID, req.params.id)
    });
  }
}

module.exports = Router;