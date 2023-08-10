const express = require('express');
const router = express.Router();
const Price = require('../model/price');
const Unit = require('../model/unit')

// Create a new price
router.post('/prices/:unitId', async (req, res, next) => {
    const Fields = Object.keys(req.body);
    const allowedField = ["salePrice", "quantity"];
    const isValidOperation = Fields.every((Field) => {
        return allowedField.includes(Field);
    })
    try {
        if (!isValidOperation) {
            return next("Invalid Field!");
        }
        const unitId = req.params.unitId;
        const unit = await Unit.findById(unitId);
        if (!unit) {
            return next('Unit not found')
        }
        const price = new Price({...req.body, unit: unitId});
        await price.save();
        res.status(201).send(price);
    } catch (e) {
        next(e);
    }
});

// Get all prices
router.get('/prices', async (req, res, next) => {
    try {
        const prices = await Price.find({}).populate({
            path: 'post',
            select: 'caption description', 
            populate: {
                path:'category',
                select: 'name'
            }
        }).populate({
          path: 'unit',
          select: 'unit'  
        })
        res.send(prices);
    } catch (error) {
        next(error);
    }
});

// Get a price by ID
router.get('/prices/:id', async (req, res, next) => {
    try {
        const price = await Price.findById(req.params.id).populate('unit','unit');
        if (!price) {
            return next('priceId not found');
        }
        res.send(price);
    } catch (error) {
        next(error);
    }
});

// Update a price by ID
router.patch('/prices/:priceId', async (req, res, next) => { 
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['salePrice', 'quantity',"unit"];
        const isValidUpdate = updates.every((update) =>
            allowedUpdates.includes(update)
        )

        if (!isValidUpdate) {
            return next('Invalid updates!')
        }

        const price = await Price.findByIdAndUpdate(req.params.priceId, req.body, {
            new: true,
            runValidators: true,
        }).populate("unit","unit");

        if (!price) {
            return res.status(404).send('price not found');
        }

        res.send(price);
    } catch (error) {
        next(error);
    }
});

// Delete a price by ID
router.delete('/prices/:id', async (req, res, next) => {
    try {
        const price = await Price.findByIdAndDelete(req.params.id);
        console.log("🚀 ~ file: price.js:85 ~ router.delete ~ price:", price)
        if (!price) {
            return next('priceId not found');
        }
        res.send(price);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
