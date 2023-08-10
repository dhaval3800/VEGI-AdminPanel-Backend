const express = require("express");
const Category = require("../model/category");
const authAdmin = require("../express-middleware/authAdmin");

const {
  uploadPost,
  createCategory,
  readAllCategory,
  updateCategory,
  deleteCategory,
  getCategoryImage
} = require("../controller/categoryController")

const router = new express.Router();

router.post("/category", authAdmin, uploadPost.single('image'), createCategory);

router.get("/category", readAllCategory);

router.patch("/category/:id", authAdmin,uploadPost.single('image'), updateCategory);

router.get("/category/:id/image", getCategoryImage);

router.delete("/category/delete/:id", authAdmin, deleteCategory);

// router.get("/category/:id", authAdmin, async (req, res, next) => {
//   try {
//     const category = await Category.findById(req.params.id);
//     await category.populate("adminID");
//     res.send(category.adminID);
//   } catch (e) {
//     next(e);
//   }
// });

module.exports = router;
