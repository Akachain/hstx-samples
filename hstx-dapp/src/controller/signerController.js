const crypto = require('crypto')
const fs = require('fs')
const mkdirp = require('mkdirp');
const path = require('path')

// var invoke = require('./smartcontract/invokeController')
// var query = require('./smartcontract/queryController')

/**
 * @description A class to generate/read key pair, create signature and verify.
 * @param {String} data Data will be sign
 * @param {Boolean} generate If generate = true, generate key pair (public key, private key), otherwise read key pair from files
 * @param {Boolean} dir Directory to save files. Default: './data/'
 */
class Signer {

  /**
   * @description Create Signer instance
   */
  constructor(data, generate, dir) {
    this.data = data
    this.dir = dir ? dir : './data/'
    if (generate) {
      this._generateKeyPairSync()
    } else {
      this._loadKeyPair(this.dir)
    }
  }

  /**
   * @description Get public key
   */
  get publicKey() {
    return this._keyPair.publicKey
  }

  /**
   * @description Load key pair from file
   */
  _loadKeyPair(dir) {
    let pk = fs.readFileSync(path.resolve(dir + 'pk.pem'))
    let sk = fs.readFileSync(path.resolve(dir + 'sk.pem'))
    this._keyPair = {
      publicKey: pk.toString(),
      privateKey: sk.toString()
    }
  }

  /**
   * @description Generate key pair
   */
  _generateKeyPairSync() {
    this._keyPair = crypto.generateKeyPairSync("rsa", {
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      modulusLength: 2048,
    })
    this._savePrivateKey(this.dir)
    this._savePublicKey(this.dir)
  }

  /**
   * @description Save public key to file
   * @param {string} dir 
   */
  _savePublicKey(dir) {
    mkdirp(path.resolve(dir), (err) => {
      if (err == null) {
        fs.writeFileSync(path.resolve(dir + 'pk.pem'), this._keyPair.publicKey)
      } else {
        console.log(err)
      }
    })
  }

  /**
   * @description Save private key to file
   * @param {string} dir 
   */
  _savePrivateKey(dir) {
    mkdirp(path.resolve(dir), (err) => {
      if (err == null) {
        fs.writeFileSync(path.resolve(dir + 'sk.pem'), this._keyPair.privateKey)
      } else {
        console.log(err)
      }
    })
  }

  /**
   * @description Save signature to file
   * @param {string} dir 
   */
  _saveSignature(dir) {
    mkdirp(path.resolve(dir))
    fs.writeFileSync(path.resolve(dir + 'signature'), this.signature.toString('hex'))
  }

  /**
   * @description Sign data by private key
   */
  sign() {
    // console.log(crypto.getCurves())
    // console.log(crypto.getHashes())
    let signer = crypto.createSign('sha512');
    signer.update(this.data);
    signer.end();
    this.signature = signer.sign(this._keyPair.privateKey)
    this._saveSignature(this.dir)
    return this.signature
  }

  /**
   * @description Verify signature by public key.
   * @param {string} publicKey Default: Signer.publicKey
   * @param {string} data Default: Signer.data
   */
  verify(publicKey, data) {
    let rs = false

    try {
      let verify = crypto.createVerify('sha512');
      data = data ? data : this.data
      verify.write(data);
      verify.end();

      publicKey = publicKey ? publicKey : this.publicKey
      rs = verify.verify(publicKey, this.signature)
    } catch (err) {
      throw err
    } finally {
      return rs
    }
  }
}

module.exports = Signer

/**
 * Test
 */
const test = async () => {
  let signer = await new Signer('ngon', true, '../data/')
  signer.sign()
  let verifyRs = signer.verify(null, 'ngon')

  // Log info
  // console.log(`Signature base64: ${signer.signature.toString('base64')}`)
  console.log(`Signature hex: ${signer.signature.toString('hex')}`)
  console.log(`Verify: ${verifyRs}`)
}

// test()