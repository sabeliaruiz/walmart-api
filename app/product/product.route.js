const express = require('express');
const { getProductMiddleware,
    isPalindromoMiddleware,
    applyDiscountMiddleware } = require('./product.mdw');
const router = express.Router();

router.get('/products', getProductMiddleware, isPalindromoMiddleware, applyDiscountMiddleware);

module.exports = router;
