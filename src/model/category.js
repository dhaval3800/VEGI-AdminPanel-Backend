        const mongoose = require("mongoose")

        const categorySchema = new mongoose.Schema({
            name: {
                type: String,
                required: true,
                trim: true,
                unique: true
            },
            image: {
                type: Buffer,
                required: true
            },
            adminID: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            }
        })

        categorySchema.virtual('posts',{
            ref: 'Post',
            localField: '_id',
            foreignField: 'category'
        })

        categorySchema.methods.toJSON = function(){
            const category = this
            const categoryObject = category.toObject()
        
            delete categoryObject.image
            
            return categoryObject
        }

        const Category = mongoose.model('Category', categorySchema);
        module.exports = Category