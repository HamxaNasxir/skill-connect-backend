const express = require('express');
const router = express.Router();
const controller = require('./controller');

const {
    createTrx,
    getClientTrx,
    getBalance,
    getTranslatorTrx,
    getStats
} = controller;


router.post('/createtrx', createTrx);
router.get("/client/transections/:id" , getClientTrx)
router.get("/translator-balance/:id/:status" , getBalance)
router.get("/translator-trx/:id/:status" , getTranslatorTrx)
router.get("/translator-stats/:id",getStats)

module.exports = router