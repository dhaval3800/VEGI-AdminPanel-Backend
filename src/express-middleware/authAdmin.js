const User = require('../model/user')
const jwt = require('jsonwebtoken')

const auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.JWT_SECRET)    
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})    

        if(!user){
            next("user not found")
        }

        if(user.role==="user"){
            next("only admin can access this data")
        }

        req.token = token
        req.user = user
        next()

    }catch(e){
        next(e)
    }
}

module.exports = auth