const express = require('express');
const router = express.Router();
const controller = require('./controller');

const {
    createWithdrew
} = controller;


router.post('/withdrew-req', createWithdrew);


module.exports = router