const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// request and responds
// one single pont of failure?
// decentralized application, downloading the whole chain deciding where to send start of session