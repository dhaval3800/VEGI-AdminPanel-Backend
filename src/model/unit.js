const mongoose = require('mongoose')

const unitSchema = new mongoose.Schema({
  unit: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
})


unitSchema.methods.toJSON = function(){
  const unit = this
  const unitObject = unit.toObject()

  delete unitObject._id
  
  return unitObject
}

const Unit = mongoose.model('Unit', unitSchema)
module.exports = Unit
