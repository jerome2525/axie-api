const express = require('express');
const router = express.Router();
const { getSmartContractData, fetchAxieData, getAxieData } = require('../controllers/axie');

// Smart Contract Data Endpoint
router.get('/smart-contract', getSmartContractData);

// Fetch Axie Data Endpoint
router.post('/fetch', fetchAxieData);

// Get All Axie Data Endpoint
router.get('/all', getAxieData);

module.exports = router;