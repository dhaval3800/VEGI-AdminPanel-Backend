const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true, 
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error('password cannot contain "password"')
            }
        }
    },
    role: {
        type: String,
        enum: ['admin', 'user'], 
        default: 'user'
    },
    avatar: {   
        type: Buffer
    },
    isDeleted: {
        type: Boolean,
        default: false 
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

userSchema.virtual('categories',{
    ref: 'Category', 
    localField: '_id',
    foreignField: 'adminID'
})

// methods are accessible on the instance of the model(user)
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.methods.isMatch = async function(orgPassword,oldPassword){
    const isMatch = await bcrypt.compare(oldPassword, orgPassword)
    return isMatch
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    delete userObject.createdAt
    delete userObject.updatedAt

    return userObject
}

userSchema.methods.generateResetToken = async function () {
    const resetToken = crypto.randomBytes(20).toString('hex')
    this.resetToken = resetToken
    this.resetTokenExpires = Date.now() + 3600000 // expires in an hour
    await this.save()
    return resetToken
}

// statics method accessible on the Model(User)
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email: email})  
    if(!user){
        throw new Error("invalid credential")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error("invalid credential")
    }
    return user
}

// Hashing the password
userSchema.pre('save', async function(next){
    const user = this
   
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


const User = mongoose.model('User', userSchema);
module.exports = User
