const Category = require("../model/category");
const Post = require("../model/post");
const multer = require("multer");
const Price = require("../model/price");
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

const addPost = async (req, res, next) => {
  console.log("req.body.priceList", req.body.priceList);

  try {
    const { caption, categoryId, description } = req.body;
    const category = await Category.findById(req.body.categoryId);
    if (!category) {
      return next("Category not found.");
    }
    const post = await new Post({
      caption,
      category: categoryId,
      admin: req.user._id,
      description,
      image: await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer(),
    });
    await post.save();
    console.log(post._id);

    let priceList = req.body.priceList;
    
    const prices = priceList.map((price) => {
      parsedPrice = JSON.parse(price);
      return {
        unit: parsedPrice.unitId,
        quantity: parsedPrice.quantity,
        salePrice: parsedPrice.sale_price,
        post: post._id,
      };
    });

    await Price.insertMany(prices);
    res.status(201).send(post);
  } catch (e) {
    next(e);
  }
};

const readAllPost = async (req, res, next) => {
  try {
    let query = {};
    if (req.query.search) {
      query.caption = { $regex: req.query.search, $options: "i" };
    }
    const posts = await Post.find({}).populate({
      path: 'prices',
      model : "Price",
      select: "salePrice"
    }).exec();

    // const response = {
    //   prices: posts.prices,
    //   posts: posts
    // };
    res.send(posts);
  } catch (e) {
    next(e);
  }
};




const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id });
    if (!post) {
      return next("Post not found");
    }
    res.send(post);
  } catch (e) {
    next(e);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const postId  = req.params.id;
    const { caption, categoryId, description } = req.body;
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return next("Post not found.");
    }
    if (Object.keys(req.body).length === 0 && !req.file) {
      return next('please provide fields to update');
    } 
    // updating image
    if(req.file){
      category.image = await req.file.buffer; 
    }
    // Update post fields
    
    post.caption = caption;
    post.category = categoryId;
    post.description = description;
    // Save post
    await post.save();
    res.status(200).send(post);
  } catch (e) {
    next(e);
  }
};


// const getPostByCategory = async (req, res, next) => {
//   try {
//     const category = await Category.findOne({ _id: req.params.categoryId });
//     if (!category) {
//       return next("Invalid category");
//     }
//     await category.populate("posts");
//     // res.set('Content-Type', 'post/jpeg')
//     res.send(category.posts);
//   } catch (e) {
//     next(e);
//   }
// };

module.exports = {
  uploadPost,
  addPost,
  // getPostByCategory,
  deletePost,
  readAllPost,
  updatePost,
};
