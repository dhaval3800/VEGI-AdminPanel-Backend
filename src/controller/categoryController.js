const Category = require("../model/category");
const multer = require('multer')
const sharp = require("sharp");

const uploadPost = multer({
  limits: {
      fileSize: 10000000, //10mb
  },
  fileFilter(req, file, callback) {
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(new Error("Please upload a jpg, jpeg or png file"));
  }   
  callback(undefined, true);
  },
});

const createCategory =  async (req, res, next) => {
  console.log("🚀 ~ file: categoryController.js:19 ~ createCategory ~ req.body:", req.body)
    const Fields = Object.keys(req.body);
    const allowedField = ["name"];
    const isValidOperation = Fields.every((Field) => {
      return allowedField.includes(Field);
    })
    try {
      if (!isValidOperation) {
        return next("Invalid Field!");
      } 
      const category = await new Category({
        image: await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer(),
        name: req.body.name,
        adminID: req.user._id
      })
      await category.save();
      res.status(201).send(category);
    } catch (e) {
      next(e);
    }
}

const readAllCategory = async (req, res, next) => {
    try {
      const categories = await Category.find({});
      res.send(categories);
    } catch (e) {
      next(e);
    }
}

const updateCategory = async (req, res, next) => {
    const category = await Category.findOne({ _id: req.params.id });
    if (!category) {
      return next("Category not found");
    }
  
    if (Object.keys(req.body).length === 0 && !req.file) {
        return next('please provide fields to update');
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return next("Invalid Updates!");
    }
    try {
      if(Object.keys(req.body).length !== 0){
        updates.forEach((update) => (category[update] = req.body[update]));
      }
      if(req.file){
        category.image = await req.file.buffer; 
      }
      await category.save();
      res.send(category);
    } catch (e) {
      next(e);
    }
}

const getCategoryImage = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || !category.image) {
      return next("category image not found!");
    }

    res.set("Content-Type", "image/png");
    res.send(category.image);
  } catch (e) {
    next(e);
  }
}

const deleteCategory = async (req, res, next) => {
    try {
      const category = await Category.findOneAndDelete({ _id: req.params.id });
      if (!category) {
        return next("category not found");
      }
      res.send(category);
    } catch (e) {
      next(e);
    }
}


module.exports = {
    uploadPost,
    createCategory,
    getCategoryImage,
    readAllCategory,
    updateCategory,
    deleteCategory
}