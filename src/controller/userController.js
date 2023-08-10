const express = require('express');
const User = require("../model/user");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");




const signUpUser = async (req, res, next) => {
  const user = await User.findOne({email:req.body.email})
  if(user?.isDeleted){
    next('user is blocked or deleted')
  }
  const Fields = Object.keys(req.body);
  const allowedField = ["name", "email", "password", "role", "isDeleted"];
  const isValidOperation = Fields.every((Field) => {
    return allowedField.includes(Field);
  })
  try {
    if (!isValidOperation) {
      return next("Invalid Field!");
    }
    const user = new User(req.body);
    await user.save();
    // const token = await user.generateAuthToken();
    res.status(201).send(user)
  } catch (e) {
    next(e);
  }
};

const logInUser = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password, next
    );
    if (!user) {
      return next("invalid credential")
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    next(e);
  }
};

const logOutUser = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send('You have successfully logged out!');
  } catch (e) {
    next(e);
  }
};

const readUserProfile = async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (e) {
    next(e);
  }
};

const updateUser = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next('please provide fields to update');
  }
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return next("Invalid updates!");
  }
  try {
    if (req.user.isDeleted === true) {
      return next("User not found!");
    }
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    next(e);
  }
};

const updateUserById = async (req, res, next)=>{   
  if (Object.keys(req.body).length === 0) {
    return next('please provide fields to update');
  }
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email","role","isDeleted"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    return next("Invalid updates!");
  }
  try{
    const user = await User.findById(req.params.id)
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (e) {
    next(e);
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { isDeleted: true });
    if (!user) {
      return next("User not found!");
    }
    if (user.isDeleted === true) {
      return next("User not found!");
    }
    await user.save()
    res.send(user);
  } catch (e) {
    next(e);
  }
};

const uploadAvatarImage = multer({
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


const postAvatarImage = async (req, res, next) => {
  try {
    if (!req.file) {return res.status(404).json({success: false,message: "please select an file!"})}
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send('avatar set successfully');
  } catch (e) {
    next(e)
  }
}

const deleteAvatarImage = async (req, res, next) => {
  try {
    if (!req.user.avatar) {
      next('Avtar not found')
    }
    req.user.avatar = undefined;
    await req.user.save();
    res.send('Avatar deleted');
  } catch (e) {
    next(e)
  }
}

const getAvatarImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      return next("User avatar not found!");
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    next(e);
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role === "user") {
      return next("only admin can access all user information");
    }
    const users = await User.find({ isDeleted: false });
    res.send(users);
  } catch (e) {
    next(e);
  }
}

const forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    if (!user || user.isDeleted === true) {
      return next("User not found!");
    }
    const token = uuidv4();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const resetUrl = `localhost:3000/users/reset-password/${token}`;
    res.send({ resetUrl });
  } catch (e) {
    next(e);
  }
}

const resetPassword = async (req, res, next) => {
  const newPassword = req.body.newPassword;
  const token = req.params.id;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next("Invalid or expired token")
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    console.log(user.password)
    await user.save();
    res.send("Password reset successful");
  } catch (e) {
    next(e);
  }
}

const changePassword = async (req, res, next) => {
  try {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    console.log("🚀 ~ file: userController.js:242 ~ changePassword ~ newPassword:", newPassword)

    if (!oldPassword || !newPassword) {
      return next("Please provide both old and new passwords!");
    }

    const isMatch = await req.user.isMatch(req.user.password, oldPassword);

    if (!isMatch) {
      return next("Invalid old password!");
    }

    req.user.password = newPassword;
    await req.user.save();

    res.send("Password updated successfully!");
  } catch (e) {
    next(e);
  }
};



module.exports = {
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
}