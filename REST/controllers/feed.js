const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const Post = require("../models/post");
const { throwError } = require("../util/errors");
const User = require("../models/user");

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  try {
    fs.unlink(filePath, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({ message: "Fetched posts.", posts, totalItems });
  } catch (err) {
    next(err);
  }
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) throwError(404, "Could not find post");
      res.status(200).json({ message: "Post fetched.", post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const error = validationResult(req).array()[0];
  if (error) throwError(422, "Validation failed.", { error });
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path.replace("\\", "/");
  const creatorId = req.userId;
  let creator;
  const post = new Post({
    title,
    content,
    creator: creatorId,
    imageUrl,
  });
  post
    .save()
    .then((result) => {
      return User.findById(creatorId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      io.getIO().emit("posts", { action: "create", post });
      res.status(201).json({
        message: "Post created successfully!",
        post,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const error = validationResult(req).array()[0];
  if (error) throwError(422, "Validation failed.", { error });
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image || req.file.path || undefined;
  if (imageUrl) imageUrl = imageUrl.replace("\\", "/");
  if (!imageUrl) throwError(422, "No file picked");
  Post.findById(postId)
    .populate("creator")
    .then((post) => {
      if (!post) throwError(404, "Could not find post");
      console.log(post.creator._id.toString());
      console.log(req.userId.toString());
      console.log(req.userId.toString() === post.creator._id.toString());
      console.log(req.userId === post.creator._id.toString());
      if (req.userId.toString() !== post.creator._id.toString())
        throwError(401, "Unauthorized to edit this resource.");
      if (imageUrl !== post.imageUrl) clearImage(post.imageUrl);
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      io.getIO().emit("posts", { action: "update", post });
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated.", post: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) throwError(404, "Could not find post");
      //return User.findById(req.userId);
      if (req.userId.toString() !== post.creator.toString())
        throwError(401, "Unauthorized to delete this resource.");
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(() => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      io.getIO().emit("posts", { action: "delete", post: postId });
      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: "Deleted post." });
    })
    .catch((err) => {
      next(err);
    });
};
