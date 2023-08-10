const express = require('express');
const router = express.Router();
const Unit = require('../model/unit');

// Create a unit
router.post('/units', async (req, res, next) => {
    const Fields = Object.keys(req.body);
    const allowedField = ["unit"];
    const isValidOperation = Fields.every((Field) => {
        return allowedField.includes(Field);
    })
    try {
        if (!isValidOperation) {
            return next("Invalid Field!");
        }
        const unit = new Unit(req.body);
        await unit.save();
        res.status(201).send(unit);
    } catch (e) {
        next(e);
    }
});

// Update a unit
router.patch('/units/:id', async (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['unit'];
    const isValidUpdate = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidUpdate) {
        return next('Invalid updates!')
    }
    try {
        const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!unit) {
            return next('unit not found');
        }
        res.send(unit);
    } catch (e) {
        next(e);
    }
});

// Delete a unit
router.delete('/units/:id', async (req, res, next) => {
    try {
        const unit = await Unit.findByIdAndDelete(req.params.id);
        if (!unit) {
            return next('unit not found');
        }
        res.send(unit);
    } catch (e) {
        next(e);
    }
});

// Get all units
router.get('/units', async (req, res, next) => {
    try {
        let query ={};
        if (req.query.search) {
            query.unit =  { $regex: req.query.search, $options: 'i' }
        }
        const units = await Unit.find(query)
        res.send(units);
    } catch (e) {
        next(e);
    }
});

module.exports = router;


module.exports = router;
