const express = require("express");
const auth = require("../express-middleware/auth");
const authAdmin = require("../express-middleware/authAdmin");


const router = new express.Router();

// Importing all the callback functions from userCallbacks.js
const {
  signUpUser,
  logInUser,
  logOutUser,
  readUserProfile,
  updateUser,
  deleteUser,
  postAvatarImage,
  uploadAvatarImage,
  deleteAvatarImage,
  getAvatarImage,
  getAllUsers,
  forgotPassword,
  resetPassword,
  updateUserById,
  changePassword
} = require("../controller/userController");

// signUp user
router.post("/users", signUpUser);

//LogIN user
router.post("/users/login", logInUser);

//LogOUT user
router.post("/users/logout", auth, logOutUser);

// read user profile
router.get("/users/me", auth, readUserProfile);

// Update user
router.patch("/users/me", auth, updateUser);

// update user by ID
router.patch("/users/:id", authAdmin, updateUserById)
 
// change password
router.patch("/users/password/change", auth, changePassword) 

// set avatar 
router.post("/users/me/avatar",auth,uploadAvatarImage.single("avatar"), postAvatarImage, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// delete avatr
router.delete("/users/me/avatar", auth, deleteAvatarImage);

// get avatar
router.get("/users/:id/avatar", getAvatarImage);

// Delete user
router.delete("/users/delete/me", auth, deleteUser);

// Get All users
router.get("/users", auth, getAllUsers);

// Forgot password 
router.post("/users/forgot-password", forgotPassword);

// reset password
router.post("/users/reset-password/:id", resetPassword)

module.exports = router;  
